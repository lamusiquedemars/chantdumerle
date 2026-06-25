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

$targets = [
    'light' => 'Faible',
    'medium-light' => 'Moyenne faible',
    'medium' => 'Moyenne',
    'medium-heavy' => 'Moyenne forte',
    'heavy' => 'Forte',
];

$aliases = [
    'basse' => 'light',
    'moyenne' => 'medium',
    'haute' => 'heavy',
];

$stats = [
    'mode' => $apply ? 'apply' : 'dry-run',
    'terms_renamed' => [],
    'relationships_moved' => 0,
    'variation_meta_updated' => 0,
    'source_term_taxonomies_deleted' => 0,
    'source_terms_deleted' => 0,
];

function fetchRow(PDO $pdo, string $sql, array $params = []): ?array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $row = $statement->fetch();

    return is_array($row) ? $row : null;
}

function fetchRows(PDO $pdo, string $sql, array $params = []): array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    return $statement->fetchAll();
}

function tensionTerm(PDO $pdo, string $prefix, string $slug): ?array
{
    return fetchRow(
        $pdo,
        "SELECT t.term_id, t.name, t.slug, tt.term_taxonomy_id
         FROM {$prefix}terms t
         JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id
         WHERE tt.taxonomy = 'pa_tension' AND t.slug = :slug
         LIMIT 1",
        ['slug' => $slug]
    );
}

foreach ($targets as $slug => $name) {
    $term = tensionTerm($pdo, $prefix, $slug);

    if ($term === null || $term['name'] === $name) {
        continue;
    }

    $stats['terms_renamed'][] = "{$term['slug']}: {$term['name']} -> {$name}";

    if ($apply) {
        $pdo->prepare(
            "UPDATE {$prefix}terms SET name = :name WHERE term_id = :term_id"
        )->execute([
            'name' => $name,
            'term_id' => (int) $term['term_id'],
        ]);
    }
}

foreach ($aliases as $sourceSlug => $targetSlug) {
    $source = tensionTerm($pdo, $prefix, $sourceSlug);
    $target = tensionTerm($pdo, $prefix, $targetSlug);

    if ($source === null || $target === null) {
        continue;
    }

    $sourceTermTaxonomyId = (int) $source['term_taxonomy_id'];
    $targetTermTaxonomyId = (int) $target['term_taxonomy_id'];
    $relationships = fetchRows(
        $pdo,
        "SELECT object_id
         FROM {$prefix}term_relationships
         WHERE term_taxonomy_id = :term_taxonomy_id",
        ['term_taxonomy_id' => $sourceTermTaxonomyId]
    );

    $stats['relationships_moved'] += count($relationships);

    if ($apply) {
        foreach ($relationships as $relationship) {
            $pdo->prepare(
                "INSERT IGNORE INTO {$prefix}term_relationships
                    (object_id, term_taxonomy_id, term_order)
                 VALUES (:object_id, :term_taxonomy_id, 0)"
            )->execute([
                'object_id' => (int) $relationship['object_id'],
                'term_taxonomy_id' => $targetTermTaxonomyId,
            ]);
        }

        $pdo->prepare(
            "DELETE FROM {$prefix}term_relationships
             WHERE term_taxonomy_id = :term_taxonomy_id"
        )->execute(['term_taxonomy_id' => $sourceTermTaxonomyId]);

        $pdo->prepare(
            "DELETE FROM {$prefix}term_taxonomy
             WHERE term_taxonomy_id = :term_taxonomy_id"
        )->execute(['term_taxonomy_id' => $sourceTermTaxonomyId]);
        $stats['source_term_taxonomies_deleted']++;

        $otherTaxonomies = fetchRow(
            $pdo,
            "SELECT 1
             FROM {$prefix}term_taxonomy
             WHERE term_id = :term_id
             LIMIT 1",
            ['term_id' => (int) $source['term_id']]
        );

        if ($otherTaxonomies === null) {
            $pdo->prepare(
                "DELETE FROM {$prefix}terms WHERE term_id = :term_id"
            )->execute(['term_id' => (int) $source['term_id']]);
            $stats['source_terms_deleted']++;
        }
    }

    $metaUpdate = $pdo->prepare(
        "SELECT COUNT(*)
         FROM {$prefix}postmeta
         WHERE meta_key = 'attribute_pa_tension'
           AND meta_value = :source_slug"
    );
    $metaUpdate->execute(['source_slug' => $sourceSlug]);
    $stats['variation_meta_updated'] += (int) $metaUpdate->fetchColumn();

    if ($apply) {
        $pdo->prepare(
            "UPDATE {$prefix}postmeta
             SET meta_value = :target_slug
             WHERE meta_key = 'attribute_pa_tension'
               AND meta_value = :source_slug"
        )->execute([
            'source_slug' => $sourceSlug,
            'target_slug' => $targetSlug,
        ]);
    }
}

if ($apply) {
    $countRows = fetchRows(
        $pdo,
        "SELECT tt.term_taxonomy_id, COUNT(tr.object_id) AS relationship_count
         FROM {$prefix}term_taxonomy tt
         LEFT JOIN {$prefix}term_relationships tr
           ON tr.term_taxonomy_id = tt.term_taxonomy_id
         WHERE tt.taxonomy = 'pa_tension'
         GROUP BY tt.term_taxonomy_id"
    );

    foreach ($countRows as $row) {
        $pdo->prepare(
            "UPDATE {$prefix}term_taxonomy
             SET count = :count
             WHERE term_taxonomy_id = :term_taxonomy_id"
        )->execute([
            'count' => (int) $row['relationship_count'],
            'term_taxonomy_id' => (int) $row['term_taxonomy_id'],
        ]);
    }
}

echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
