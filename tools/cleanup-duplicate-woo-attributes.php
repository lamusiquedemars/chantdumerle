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
    'pa_complexite-sonore' => 'pa_complexite',
    'pa_puissance-sonore' => 'pa_puissance',
    'pa_usage-musicien' => 'pa_usage',
    'pa_positionnement-prix' => 'pa_positionnement',
    'pa_stabilite-daccord' => 'pa_stabilite',
    'pa_type-de-pack' => 'pa_type_pack',
];

$attributeNames = [
    'type-de-produit',
    'complexite-sonore',
    'puissance-sonore',
    'usage-musicien',
    'positionnement-prix',
    'stabilite-daccord',
    'type-de-pack',
];

$termMap = [
    'pa_type-de-produit' => [
        'jeu-complet' => ['jeu-complet' => 'jeu complet'],
        'pack' => ['pack' => 'pack'],
    ],
    'pa_complexite-sonore' => [
        'pur' => ['pur' => 'pur'],
        'equilibre' => ['equilibre' => 'équilibré'],
        'complexe' => ['complexe' => 'complexe'],
    ],
    'pa_puissance-sonore' => [
        'equilibre' => ['modere' => 'modéré'],
        'puissant' => ['puissant' => 'puissant'],
        'doux' => ['doux' => 'doux'],
    ],
    'pa_usage-musicien' => [
        'baroque' => ['baroque' => 'baroque'],
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
    'pa_stabilite-daccord' => [
        'faible' => ['faible' => 'faible'],
        'bonne' => ['bonne' => 'bonne'],
        'excellente' => ['excellente' => 'excellente'],
    ],
    'pa_type-de-pack' => [
        'pack-essentiel-cordes' => ['pack-essentiel-cordes' => 'pack essentiel cordes'],
        'pack-essentiel-archet' => ['pack-essentiel-archet' => 'pack essentiel archet'],
        'pack-performance-archet' => ['pack-performance-archet' => 'pack performance archet'],
    ],
];

$stats = [
    'mode' => $apply ? 'apply' : 'dry-run',
    'products_seen' => 0,
    'relationships_added' => 0,
    'relationships_removed' => 0,
    'product_attributes_rewritten' => 0,
    'terms_created' => [],
    'term_taxonomies_deleted' => 0,
    'terms_deleted' => 0,
    'attribute_taxonomies_deleted' => 0,
    'snapshots_written' => [],
];

function rows(PDO $pdo, string $sql, array $params = []): array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    return $statement->fetchAll();
}

function row(PDO $pdo, string $sql, array $params = []): ?array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $result = $statement->fetch();

    return $result ?: null;
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
    $existing = row(
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

    $stats['terms_created'][] = "{$taxonomy}:{$slug}";

    if (! $apply) {
        return null;
    }

    $term = row(
        $pdo,
        "SELECT term_id FROM {$prefix}terms WHERE slug = :slug LIMIT 1",
        ['slug' => $slug]
    );

    if ($term) {
        $termId = (int) $term['term_id'];
    } else {
        $statement = $pdo->prepare(
            "INSERT INTO {$prefix}terms (name, slug, term_group) VALUES (:name, :slug, 0)"
        );
        $statement->execute(['name' => $name, 'slug' => $slug]);
        $termId = (int) $pdo->lastInsertId();
    }

    $statement = $pdo->prepare(
        "INSERT INTO {$prefix}term_taxonomy (term_id, taxonomy, description, parent, count)
         VALUES (:term_id, :taxonomy, '', 0, 0)"
    );
    $statement->execute(['term_id' => $termId, 'taxonomy' => $taxonomy]);

    return (int) $pdo->lastInsertId();
}

function addRelationship(PDO $pdo, string $prefix, int $postId, ?int $termTaxonomyId, bool $apply, array &$stats): void
{
    if ($termTaxonomyId === null) {
        $stats['relationships_added']++;

        return;
    }

    $existing = row(
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

$oldTaxonomies = array_keys($taxonomyMap);
$quotedOldTaxonomies = implode(',', array_map([$pdo, 'quote'], $oldTaxonomies));
$quotedAttributeNames = implode(',', array_map([$pdo, 'quote'], $attributeNames));

$affectedProducts = rows(
    $pdo,
    "SELECT DISTINCT p.ID
     FROM {$prefix}posts p
     JOIN {$prefix}term_relationships tr ON tr.object_id = p.ID
     JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
     WHERE tt.taxonomy IN ({$quotedOldTaxonomies})
     ORDER BY p.ID"
);
$productIds = array_map(static fn (array $item): int => (int) $item['ID'], $affectedProducts);
$stats['products_seen'] = count($productIds);

$snapshotDir = dirname(__DIR__) . '/woo-backend/wp-content/uploads/_cleanup-reports';
if (! is_dir($snapshotDir) && $apply) {
    mkdir($snapshotDir, 0775, true);
}

$timestamp = date('Ymd-His');
$snapshotQueries = [
    'attribute_taxonomies' => "SELECT * FROM {$prefix}woocommerce_attribute_taxonomies WHERE attribute_name IN ({$quotedAttributeNames})",
    'term_taxonomy' => "SELECT * FROM {$prefix}term_taxonomy WHERE taxonomy IN ({$quotedOldTaxonomies})",
    'terms' => "SELECT DISTINCT t.* FROM {$prefix}terms t JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id WHERE tt.taxonomy IN ({$quotedOldTaxonomies})",
    'term_relationships' => "SELECT tr.* FROM {$prefix}term_relationships tr JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id WHERE tt.taxonomy IN ({$quotedOldTaxonomies})",
    'postmeta_product_attributes' => "SELECT * FROM {$prefix}postmeta WHERE meta_key = '_product_attributes' AND meta_value REGEXP 'pa_(type-de-produit|complexite-sonore|puissance-sonore|usage-musicien|positionnement-prix|stabilite-daccord|type-de-pack)'",
];

foreach ($snapshotQueries as $name => $sql) {
    $path = "{$snapshotDir}/duplicate-attribute-cleanup-{$name}-{$timestamp}.json";
    $stats['snapshots_written'][] = $path;

    if ($apply) {
        file_put_contents($path, json_encode(rows($pdo, $sql), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

if ($apply) {
    $pdo->beginTransaction();
}

foreach ($productIds as $postId) {
    $relationships = rows(
        $pdo,
        "SELECT tr.term_taxonomy_id, tt.taxonomy, t.slug, t.name
         FROM {$prefix}term_relationships tr
         JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         JOIN {$prefix}terms t ON t.term_id = tt.term_id
         WHERE tr.object_id = :post_id AND tt.taxonomy IN ({$quotedOldTaxonomies})",
        ['post_id' => $postId]
    );

    foreach ($relationships as $relationship) {
        $sourceTaxonomy = $relationship['taxonomy'];
        $targetTaxonomy = $taxonomyMap[$sourceTaxonomy];
        $targetTerms = $termMap[$sourceTaxonomy][$relationship['slug']] ?? [
            $relationship['slug'] => $relationship['name'],
        ];

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
}

$attributeMetaRows = rows(
    $pdo,
    "SELECT meta_id, meta_value
     FROM {$prefix}postmeta
     WHERE meta_key = '_product_attributes'
       AND meta_value REGEXP 'pa_(type-de-produit|complexite-sonore|puissance-sonore|usage-musicien|positionnement-prix|stabilite-daccord|type-de-pack)'"
);

foreach ($attributeMetaRows as $metaRow) {
    $attributes = @unserialize($metaRow['meta_value']);

    if (! is_array($attributes)) {
        continue;
    }

    $rewritten = rewriteProductAttributes($attributes, $taxonomyMap);

    if ($rewritten === $attributes) {
        continue;
    }

    $stats['product_attributes_rewritten']++;

    if ($apply) {
        $statement = $pdo->prepare(
            "UPDATE {$prefix}postmeta SET meta_value = :value WHERE meta_id = :meta_id"
        );
        $statement->execute([
            'value' => serialize($rewritten),
            'meta_id' => (int) $metaRow['meta_id'],
        ]);
    }
}

$oldTermTaxonomies = rows(
    $pdo,
    "SELECT term_taxonomy_id, term_id FROM {$prefix}term_taxonomy WHERE taxonomy IN ({$quotedOldTaxonomies})"
);
$oldTermIds = array_values(array_unique(array_map(static fn (array $row): int => (int) $row['term_id'], $oldTermTaxonomies)));
$stats['term_taxonomies_deleted'] = count($oldTermTaxonomies);

if ($apply && $oldTermTaxonomies !== []) {
    $ids = implode(',', array_map(static fn (array $row): int => (int) $row['term_taxonomy_id'], $oldTermTaxonomies));
    $pdo->exec("DELETE FROM {$prefix}term_relationships WHERE term_taxonomy_id IN ({$ids})");
    $pdo->exec("DELETE FROM {$prefix}term_taxonomy WHERE term_taxonomy_id IN ({$ids})");
}

foreach ($oldTermIds as $termId) {
    $stillUsed = row(
        $pdo,
        "SELECT term_taxonomy_id FROM {$prefix}term_taxonomy WHERE term_id = :term_id LIMIT 1",
        ['term_id' => $termId]
    );

    if ($stillUsed) {
        continue;
    }

    $stats['terms_deleted']++;

    if ($apply) {
        $statement = $pdo->prepare("DELETE FROM {$prefix}terms WHERE term_id = :term_id");
        $statement->execute(['term_id' => $termId]);
    }
}

$attributeCount = (int) (row(
    $pdo,
    "SELECT COUNT(*) AS count FROM {$prefix}woocommerce_attribute_taxonomies WHERE attribute_name IN ({$quotedAttributeNames})"
)['count'] ?? 0);
$stats['attribute_taxonomies_deleted'] = $attributeCount;

if ($apply && $attributeCount > 0) {
    $pdo->exec("DELETE FROM {$prefix}woocommerce_attribute_taxonomies WHERE attribute_name IN ({$quotedAttributeNames})");
}

if ($apply) {
    $targetTaxonomies = array_unique(array_values($taxonomyMap));

    foreach ($targetTaxonomies as $taxonomy) {
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
