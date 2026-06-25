<?php

declare(strict_types=1);

$apply = in_array('--apply', $argv, true);

$pdo = new PDO(
    'mysql:host=127.0.0.1;port=3306;dbname=chantdumerle_wp;charset=utf8mb4',
    'root',
    'root',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

$prefix = 'wp_';

$taxonomyMap = [
    'pa_type-de-produit' => 'pa_type_produit',
    'pa_type-de-pack' => 'pa_type_pack',
    'pa_usage-musicien' => 'pa_usage',
    'pa_positionnement-prix' => 'pa_positionnement',
    'pa_puissance-sonore' => 'pa_puissance',
    'pa_complexite-sonore' => 'pa_complexite',
    'pa_stabilite-daccord' => 'pa_stabilite',
];

$termMap = [
    'pa_type-de-produit' => [
        'pack' => ['pack' => 'pack'],
    ],
    'pa_type-de-pack' => [
        'pack-essentiel-cordes' => ['pack-essentiel-cordes' => 'pack essentiel cordes'],
        'pack-essentiel-archet' => ['pack-essentiel-archet' => 'pack essentiel archet'],
        'pack-performance-archet' => ['pack-performance-archet' => 'pack performance archet'],
    ],
    'pa_usage-musicien' => [
        'debutant' => ['debutant' => 'débutant'],
        'etudiant' => ['etudiant' => 'étudiant'],
        'orchestre' => ['orchestre' => 'orchestre'],
        'soliste' => ['soliste' => 'soliste'],
        'debutant-etudiant' => [
            'debutant' => 'débutant',
            'etudiant' => 'étudiant',
        ],
        'debutant-etudiant-orchestre-soliste' => [
            'debutant' => 'débutant',
            'etudiant' => 'étudiant',
            'orchestre' => 'orchestre',
            'soliste' => 'soliste',
        ],
        'etudiant-orchestre-soliste' => [
            'etudiant' => 'étudiant',
            'orchestre' => 'orchestre',
            'soliste' => 'soliste',
        ],
    ],
    'pa_positionnement-prix' => [
        'entree' => ['entree' => 'entrée'],
        'intermediaire' => ['intermediaire' => 'intermédiaire'],
        'premium' => ['premium' => 'premium'],
    ],
    'pa_puissance-sonore' => [
        'equilibre' => ['modere' => 'modéré'],
        'puissant' => ['puissant' => 'puissant'],
        'doux' => ['doux' => 'doux'],
    ],
    'pa_complexite-sonore' => [
        'pur' => ['pur' => 'pur'],
        'equilibre' => ['equilibre' => 'équilibré'],
        'complexe' => ['complexe' => 'complexe'],
    ],
    'pa_stabilite-daccord' => [
        'faible' => ['faible' => 'faible'],
        'bonne' => ['bonne' => 'bonne'],
        'excellente' => ['excellente' => 'excellente'],
    ],
];

$stats = [
    'mode' => $apply ? 'apply' : 'dry-run',
    'pack_ids' => [],
    'terms_created' => [],
    'relationships_added' => 0,
    'relationships_removed' => 0,
    'product_attributes_rewritten' => 0,
    'snapshots_written' => [],
];

function fetchAll(PDO $pdo, string $sql, array $params = []): array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    return $statement->fetchAll();
}

function fetchOne(PDO $pdo, string $sql, array $params = []): ?array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $row = $statement->fetch();

    return $row ?: null;
}

function ensureTermTaxonomy(
    PDO $pdo,
    string $prefix,
    string $taxonomy,
    string $slug,
    string $name,
    bool $apply,
    array &$stats
): ?int {
    $existing = fetchOne(
        $pdo,
        "SELECT tt.term_taxonomy_id
         FROM {$prefix}terms t
         JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id
         WHERE tt.taxonomy = :taxonomy AND t.slug = :slug
         LIMIT 1",
        ['taxonomy' => $taxonomy, 'slug' => $slug]
    );

    if ($existing) {
        return (int) $existing['term_taxonomy_id'];
    }

    if (! $apply) {
        $stats['terms_created'][] = "{$taxonomy}:{$slug}";

        return null;
    }

    $term = fetchOne(
        $pdo,
        "SELECT term_id FROM {$prefix}terms WHERE slug = :slug LIMIT 1",
        ['slug' => $slug]
    );

    if (! $term) {
        $statement = $pdo->prepare(
            "INSERT INTO {$prefix}terms (name, slug, term_group) VALUES (:name, :slug, 0)"
        );
        $statement->execute(['name' => $name, 'slug' => $slug]);
        $termId = (int) $pdo->lastInsertId();
    } else {
        $termId = (int) $term['term_id'];
    }

    $statement = $pdo->prepare(
        "INSERT INTO {$prefix}term_taxonomy (term_id, taxonomy, description, parent, count)
         VALUES (:term_id, :taxonomy, '', 0, 0)"
    );
    $statement->execute(['term_id' => $termId, 'taxonomy' => $taxonomy]);
    $termTaxonomyId = (int) $pdo->lastInsertId();
    $stats['terms_created'][] = "{$taxonomy}:{$slug}";

    return $termTaxonomyId;
}

function addRelationship(
    PDO $pdo,
    string $prefix,
    int $postId,
    ?int $termTaxonomyId,
    bool $apply,
    array &$stats
): void {
    if ($termTaxonomyId === null) {
        $stats['relationships_added']++;

        return;
    }

    $existing = fetchOne(
        $pdo,
        "SELECT object_id FROM {$prefix}term_relationships
         WHERE object_id = :post_id AND term_taxonomy_id = :term_taxonomy_id
         LIMIT 1",
        ['post_id' => $postId, 'term_taxonomy_id' => $termTaxonomyId]
    );

    if ($existing) {
        return;
    }

    $stats['relationships_added']++;

    if ($apply) {
        $statement = $pdo->prepare(
            "INSERT INTO {$prefix}term_relationships (object_id, term_taxonomy_id, term_order)
             VALUES (:post_id, :term_taxonomy_id, 0)"
        );
        $statement->execute(['post_id' => $postId, 'term_taxonomy_id' => $termTaxonomyId]);
    }
}

function rewriteProductAttributes(array $attributes, array $taxonomyMap): array
{
    foreach ($taxonomyMap as $sourceTaxonomy => $targetTaxonomy) {
        if (! isset($attributes[$sourceTaxonomy])) {
            continue;
        }

        $attribute = $attributes[$sourceTaxonomy];
        $attribute['name'] = $targetTaxonomy;
        unset($attributes[$sourceTaxonomy]);

        if (! isset($attributes[$targetTaxonomy])) {
            $attributes[$targetTaxonomy] = $attribute;
        }
    }

    return $attributes;
}

$packRows = fetchAll(
    $pdo,
    "SELECT DISTINCT p.ID, p.post_title
     FROM {$prefix}posts p
     JOIN {$prefix}term_relationships tr ON tr.object_id = p.ID
     JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
     JOIN {$prefix}terms t ON t.term_id = tt.term_id
     WHERE p.post_type = 'product'
       AND tt.taxonomy = 'pa_type-de-produit'
       AND t.slug = 'pack'
     ORDER BY p.ID"
);

$packIds = array_map(static fn (array $row): int => (int) $row['ID'], $packRows);
$stats['pack_ids'] = $packIds;

if ($packIds === []) {
    echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
    exit(0);
}

$snapshotDir = dirname(__DIR__) . '/woo-backend/wp-content/uploads/_cleanup-reports';
if (! is_dir($snapshotDir) && $apply) {
    mkdir($snapshotDir, 0775, true);
}

$idList = implode(',', $packIds);
$snapshotTables = [
    'posts' => "SELECT * FROM {$prefix}posts WHERE ID IN ({$idList})",
    'postmeta' => "SELECT * FROM {$prefix}postmeta WHERE post_id IN ({$idList})",
    'term_relationships' => "SELECT tr.* FROM {$prefix}term_relationships tr WHERE tr.object_id IN ({$idList})",
    'term_taxonomy' => "SELECT DISTINCT tt.* FROM {$prefix}term_taxonomy tt JOIN {$prefix}term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id WHERE tr.object_id IN ({$idList})",
    'terms' => "SELECT DISTINCT t.* FROM {$prefix}terms t JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id JOIN {$prefix}term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id WHERE tr.object_id IN ({$idList})",
];

foreach ($snapshotTables as $name => $sql) {
    $snapshotPath = "{$snapshotDir}/pack-attribute-migration-{$name}-" . date('Ymd-His') . '.json';
    $stats['snapshots_written'][] = $snapshotPath;

    if ($apply) {
        file_put_contents(
            $snapshotPath,
            json_encode(fetchAll($pdo, $sql), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
}

if ($apply) {
    $pdo->beginTransaction();
}

foreach ($packIds as $postId) {
    $sourceRelationships = fetchAll(
        $pdo,
        "SELECT tr.term_taxonomy_id, tt.taxonomy, t.slug, t.name
         FROM {$prefix}term_relationships tr
         JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         JOIN {$prefix}terms t ON t.term_id = tt.term_id
         WHERE tr.object_id = :post_id
           AND tt.taxonomy IN ('" . implode("','", array_keys($taxonomyMap)) . "')",
        ['post_id' => $postId]
    );

    foreach ($sourceRelationships as $relationship) {
        $sourceTaxonomy = $relationship['taxonomy'];
        $sourceSlug = $relationship['slug'];
        $targetTaxonomy = $taxonomyMap[$sourceTaxonomy];
        $targetTerms = $termMap[$sourceTaxonomy][$sourceSlug] ?? [$sourceSlug => $relationship['name']];

        foreach ($targetTerms as $targetSlug => $targetName) {
            $targetTermTaxonomyId = ensureTermTaxonomy(
                $pdo,
                $prefix,
                $targetTaxonomy,
                (string) $targetSlug,
                (string) $targetName,
                $apply,
                $stats
            );
            addRelationship($pdo, $prefix, $postId, $targetTermTaxonomyId, $apply, $stats);
        }

        $stats['relationships_removed']++;

        if ($apply) {
            $statement = $pdo->prepare(
                "DELETE FROM {$prefix}term_relationships
                 WHERE object_id = :post_id AND term_taxonomy_id = :term_taxonomy_id"
            );
            $statement->execute([
                'post_id' => $postId,
                'term_taxonomy_id' => (int) $relationship['term_taxonomy_id'],
            ]);
        }
    }

    $attributeMeta = fetchOne(
        $pdo,
        "SELECT meta_id, meta_value FROM {$prefix}postmeta
         WHERE post_id = :post_id AND meta_key = '_product_attributes'
         LIMIT 1",
        ['post_id' => $postId]
    );

    if ($attributeMeta && is_string($attributeMeta['meta_value'])) {
        $attributes = @unserialize($attributeMeta['meta_value']);

        if (is_array($attributes)) {
            $rewritten = rewriteProductAttributes($attributes, $taxonomyMap);

            if ($rewritten !== $attributes) {
                $stats['product_attributes_rewritten']++;

                if ($apply) {
                    $statement = $pdo->prepare(
                        "UPDATE {$prefix}postmeta SET meta_value = :meta_value WHERE meta_id = :meta_id"
                    );
                    $statement->execute([
                        'meta_value' => serialize($rewritten),
                        'meta_id' => (int) $attributeMeta['meta_id'],
                    ]);
                }
            }
        }
    }
}

if ($apply) {
    foreach (array_unique(array_values($taxonomyMap)) as $taxonomy) {
        $pdo->exec(
            "UPDATE {$prefix}term_taxonomy tt
             SET count = (
                 SELECT COUNT(*)
                 FROM {$prefix}term_relationships tr
                 JOIN {$prefix}posts p ON p.ID = tr.object_id
                 WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
                   AND p.post_status = 'publish'
             )
             WHERE tt.taxonomy = " . $pdo->quote($taxonomy)
        );
    }

    foreach (array_unique(array_keys($taxonomyMap)) as $taxonomy) {
        $pdo->exec(
            "UPDATE {$prefix}term_taxonomy tt
             SET count = (
                 SELECT COUNT(*)
                 FROM {$prefix}term_relationships tr
                 JOIN {$prefix}posts p ON p.ID = tr.object_id
                 WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
                   AND p.post_status = 'publish'
             )
             WHERE tt.taxonomy = " . $pdo->quote($taxonomy)
        );
    }

    $pdo->commit();
}

echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
