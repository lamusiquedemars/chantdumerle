<?php

declare(strict_types=1);

$dryRun = ! in_array('--apply', $argv, true);

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

$attributeMap = [
    'marque' => ['taxonomy' => 'pa_marque', 'variation' => false],
    'modele' => ['taxonomy' => 'pa_modele', 'variation' => true],
    'instrument' => ['taxonomy' => 'pa_instrument', 'variation' => true],
    'corde' => ['taxonomy' => 'pa_corde', 'variation' => true],
    'taille' => ['taxonomy' => 'pa_taille', 'variation' => true],
    'tension' => ['taxonomy' => 'pa_tension', 'variation' => true],
    'attache' => ['taxonomy' => 'pa_attache', 'variation' => true],
    'ame' => ['taxonomy' => 'pa_ame', 'variation' => true],
    'filage' => ['taxonomy' => 'pa_filage', 'variation' => true],
    'type-produit' => ['taxonomy' => 'pa_type_produit', 'variation' => true],
    'type-pack' => ['taxonomy' => 'pa_type_pack', 'variation' => true],
];

$stats = [
    'mode' => $dryRun ? 'dry-run' : 'apply',
    'products_seen' => 0,
    'products_changed' => 0,
    'product_terms_set' => [],
    'product_attributes_rewritten' => 0,
    'variations_seen' => 0,
    'variations_changed' => 0,
    'variation_meta_added_or_updated' => 0,
    'variation_meta_deleted' => 0,
    'terms_created' => [],
];

function cdm_split_attribute_values(string $value): array
{
    $parts = preg_split('/\s*\|\s*/', $value) ?: [];
    $parts = array_map(static fn (string $part): string => trim($part), $parts);
    $parts = array_filter($parts, static fn (string $part): bool => $part !== '');

    return array_values(array_unique($parts));
}

function cdm_canonical_value(string $sourceKey, string $value): string
{
    $trimmed = trim($value);
    $lower = mb_strtolower($trimmed, 'UTF-8');

    $canonical = [
        'corde' => [
            'do' => 'Do',
            'ré' => 'Ré',
            're' => 'Ré',
            'mi' => 'Mi',
            'fa' => 'Fa',
            'fa dièse' => 'Fa dièse',
            'fa diese' => 'Fa dièse',
            'sol' => 'Sol',
            'la' => 'La',
            'si' => 'Si',
            'jeu' => 'jeu',
            'do dièse' => 'Do dièse',
            'do diese' => 'Do dièse',
        ],
        'attache' => [
            'boucle' => 'Boucle',
            'boule' => 'Boule',
            'boule amovible' => 'Boule amovible',
            'tube' => 'tube',
        ],
        'ame' => [
            'boyau' => 'boyau',
            'acier' => 'acier',
        ],
    ];

    return $canonical[$sourceKey][$lower] ?? $trimmed;
}

function cdm_slug(string $value): string
{
    $slug = strtr($value, [
        'à' => 'a',
        'â' => 'a',
        'ä' => 'a',
        'ç' => 'c',
        'é' => 'e',
        'è' => 'e',
        'ê' => 'e',
        'ë' => 'e',
        'î' => 'i',
        'ï' => 'i',
        'ô' => 'o',
        'ö' => 'o',
        'ù' => 'u',
        'û' => 'u',
        'ü' => 'u',
        'À' => 'a',
        'Â' => 'a',
        'Ä' => 'a',
        'Ç' => 'c',
        'É' => 'e',
        'È' => 'e',
        'Ê' => 'e',
        'Ë' => 'e',
        'Î' => 'i',
        'Ï' => 'i',
        'Ô' => 'o',
        'Ö' => 'o',
        'Ù' => 'u',
        'Û' => 'u',
        'Ü' => 'u',
    ]);
    $slug = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $slug);
    $slug = $slug === false ? $value : $slug;
    $slug = strtolower($slug);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?: '';
    $slug = trim($slug, '-');

    return $slug !== '' ? $slug : 'term';
}

function cdm_fetch_one(PDO $pdo, string $sql, array $params = []): ?array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $row = $statement->fetch();

    return is_array($row) ? $row : null;
}

function cdm_fetch_value(PDO $pdo, string $sql, array $params = []): mixed
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    return $statement->fetchColumn();
}

function cdm_term(PDO $pdo, string $prefix, string $taxonomy, string $value, bool $dryRun, array &$stats): array
{
    $existing = cdm_fetch_one(
        $pdo,
        "SELECT t.term_id, t.slug, tt.term_taxonomy_id
         FROM {$prefix}terms t
         JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id
         WHERE tt.taxonomy = :taxonomy AND t.name = :name
         LIMIT 1",
        ['taxonomy' => $taxonomy, 'name' => $value]
    );

    if ($existing !== null) {
        return [
            'term_id' => (int) $existing['term_id'],
            'slug' => (string) $existing['slug'],
            'term_taxonomy_id' => (int) $existing['term_taxonomy_id'],
        ];
    }

    $baseSlug = cdm_slug($value);
    $slug = $baseSlug;
    $suffix = 2;

    while (cdm_fetch_one(
        $pdo,
        "SELECT 1
         FROM {$prefix}terms t
         JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id
         WHERE tt.taxonomy = :taxonomy AND t.slug = :slug
         LIMIT 1",
        ['taxonomy' => $taxonomy, 'slug' => $slug]
    ) !== null) {
        $slug = $baseSlug . '-' . $suffix;
        $suffix++;
    }

    $stats['terms_created'][$taxonomy][] = $value;

    if ($dryRun) {
        return ['term_id' => 0, 'slug' => $slug, 'term_taxonomy_id' => 0];
    }

    $pdo->prepare("INSERT INTO {$prefix}terms (name, slug, term_group) VALUES (:name, :slug, 0)")
        ->execute(['name' => $value, 'slug' => $slug]);
    $termId = (int) $pdo->lastInsertId();

    $pdo->prepare("INSERT INTO {$prefix}term_taxonomy (term_id, taxonomy, description, parent, count) VALUES (:term_id, :taxonomy, '', 0, 0)")
        ->execute(['term_id' => $termId, 'taxonomy' => $taxonomy]);
    $termTaxonomyId = (int) $pdo->lastInsertId();

    return ['term_id' => $termId, 'slug' => $slug, 'term_taxonomy_id' => $termTaxonomyId];
}

function cdm_delete_relationships_for_taxonomy(PDO $pdo, string $prefix, int $objectId, string $taxonomy): void
{
    $pdo->prepare(
        "DELETE tr FROM {$prefix}term_relationships tr
         JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         WHERE tr.object_id = :object_id AND tt.taxonomy = :taxonomy"
    )->execute(['object_id' => $objectId, 'taxonomy' => $taxonomy]);
}

function cdm_term_names_for_object(PDO $pdo, string $prefix, int $objectId, string $taxonomy): array
{
    $statement = $pdo->prepare(
        "SELECT t.name
         FROM {$prefix}term_relationships tr
         JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         JOIN {$prefix}terms t ON t.term_id = tt.term_id
         WHERE tr.object_id = :object_id AND tt.taxonomy = :taxonomy
         ORDER BY t.name"
    );
    $statement->execute(['object_id' => $objectId, 'taxonomy' => $taxonomy]);

    return array_map('strval', $statement->fetchAll(PDO::FETCH_COLUMN));
}

function cdm_insert_relationship(PDO $pdo, string $prefix, int $objectId, int $termTaxonomyId): void
{
    $exists = cdm_fetch_value(
        $pdo,
        "SELECT 1 FROM {$prefix}term_relationships WHERE object_id = :object_id AND term_taxonomy_id = :term_taxonomy_id LIMIT 1",
        ['object_id' => $objectId, 'term_taxonomy_id' => $termTaxonomyId]
    );

    if ($exists) {
        return;
    }

    $pdo->prepare(
        "INSERT INTO {$prefix}term_relationships (object_id, term_taxonomy_id, term_order) VALUES (:object_id, :term_taxonomy_id, 0)"
    )->execute(['object_id' => $objectId, 'term_taxonomy_id' => $termTaxonomyId]);
}

function cdm_get_post_meta(PDO $pdo, string $prefix, int $postId, string $key): ?string
{
    $value = cdm_fetch_value(
        $pdo,
        "SELECT meta_value FROM {$prefix}postmeta WHERE post_id = :post_id AND meta_key = :meta_key ORDER BY meta_id ASC LIMIT 1",
        ['post_id' => $postId, 'meta_key' => $key]
    );

    return $value === false ? null : (string) $value;
}

function cdm_update_post_meta(PDO $pdo, string $prefix, int $postId, string $key, string $value): void
{
    $metaId = cdm_fetch_value(
        $pdo,
        "SELECT meta_id FROM {$prefix}postmeta WHERE post_id = :post_id AND meta_key = :meta_key ORDER BY meta_id ASC LIMIT 1",
        ['post_id' => $postId, 'meta_key' => $key]
    );

    if ($metaId === false) {
        $pdo->prepare("INSERT INTO {$prefix}postmeta (post_id, meta_key, meta_value) VALUES (:post_id, :meta_key, :meta_value)")
            ->execute(['post_id' => $postId, 'meta_key' => $key, 'meta_value' => $value]);
        return;
    }

    $pdo->prepare("UPDATE {$prefix}postmeta SET meta_value = :meta_value WHERE meta_id = :meta_id")
        ->execute(['meta_value' => $value, 'meta_id' => (int) $metaId]);
}

function cdm_delete_post_meta(PDO $pdo, string $prefix, int $postId, string $key): int
{
    $statement = $pdo->prepare("DELETE FROM {$prefix}postmeta WHERE post_id = :post_id AND meta_key = :meta_key");
    $statement->execute(['post_id' => $postId, 'meta_key' => $key]);

    return $statement->rowCount();
}

function cdm_recount_taxonomy(PDO $pdo, string $prefix, string $taxonomy): void
{
    $pdo->prepare(
        "UPDATE {$prefix}term_taxonomy tt
         SET count = (
             SELECT COUNT(*)
             FROM {$prefix}term_relationships tr
             JOIN {$prefix}posts p ON p.ID = tr.object_id
             WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
               AND p.post_status IN ('publish', 'private')
         )
         WHERE tt.taxonomy = :taxonomy"
    )->execute(['taxonomy' => $taxonomy]);
}

$productRows = $pdo->query(
    "SELECT ID FROM {$prefix}posts WHERE post_type = 'product' AND post_status IN ('publish', 'draft', 'pending', 'private')"
)->fetchAll();

if (! $dryRun) {
    $pdo->beginTransaction();
}

try {
    foreach ($productRows as $row) {
        $productId = (int) $row['ID'];
        $stats['products_seen']++;

        $serialized = cdm_get_post_meta($pdo, $prefix, $productId, '_product_attributes');
        if ($serialized === null || $serialized === '') {
            continue;
        }

        $attributes = @unserialize($serialized);
        if (! is_array($attributes)) {
            continue;
        }

        $newAttributes = $attributes;
        $changed = false;

        foreach ($attributeMap as $sourceKey => $definition) {
            $sourceAttribute = $attributes[$sourceKey] ?? null;
            $taxonomy = $definition['taxonomy'];

            if ($sourceKey === 'marque' && ! is_array($sourceAttribute)) {
                $brandValues = cdm_term_names_for_object($pdo, $prefix, $productId, 'product_brand');
                if ($brandValues !== []) {
                    $sourceAttribute = [
                        'value' => implode(' | ', $brandValues),
                        'position' => 0,
                        'is_visible' => 1,
                        'is_variation' => 0,
                    ];
                }
            }

            if (! is_array($sourceAttribute)) {
                continue;
            }

            $values = array_map(
                static fn (string $value): string => cdm_canonical_value($sourceKey, $value),
                cdm_split_attribute_values((string) ($sourceAttribute['value'] ?? ''))
            );

            if ($values === []) {
                unset($newAttributes[$sourceKey]);
                $changed = true;
                continue;
            }

            if (! $dryRun) {
                cdm_delete_relationships_for_taxonomy($pdo, $prefix, $productId, $taxonomy);
            }

            foreach ($values as $value) {
                $term = cdm_term($pdo, $prefix, $taxonomy, $value, $dryRun, $stats);
                $stats['product_terms_set'][$taxonomy] = ($stats['product_terms_set'][$taxonomy] ?? 0) + 1;

                if (! $dryRun) {
                    cdm_insert_relationship($pdo, $prefix, $productId, $term['term_taxonomy_id']);
                }
            }

            $newAttributes[$taxonomy] = [
                'name' => $taxonomy,
                'value' => '',
                'position' => (int) ($sourceAttribute['position'] ?? 0),
                'is_visible' => (int) ($sourceAttribute['is_visible'] ?? 1),
                'is_variation' => (int) ($sourceAttribute['is_variation'] ?? ($definition['variation'] ? 1 : 0)),
                'is_taxonomy' => 1,
            ];
            unset($newAttributes[$sourceKey]);
            $changed = true;
        }

        if ($changed) {
            $stats['products_changed']++;
            $stats['product_attributes_rewritten']++;

            if (! $dryRun) {
                cdm_update_post_meta($pdo, $prefix, $productId, '_product_attributes', serialize($newAttributes));
            }
        }
    }

    $variationRows = $pdo->query(
        "SELECT ID FROM {$prefix}posts WHERE post_type = 'product_variation' AND post_status IN ('publish', 'private')"
    )->fetchAll();

    foreach ($variationRows as $row) {
        $variationId = (int) $row['ID'];
        $stats['variations_seen']++;
        $changed = false;

        foreach ($attributeMap as $sourceKey => $definition) {
            if (! $definition['variation']) {
                continue;
            }

            $oldKey = 'attribute_' . $sourceKey;
            $newKey = 'attribute_' . $definition['taxonomy'];
            $value = trim((string) (cdm_get_post_meta($pdo, $prefix, $variationId, $oldKey) ?? ''));
            $value = $value === '' ? '' : cdm_canonical_value($sourceKey, $value);

            if ($value === '') {
                $deleted = 0;
                if (! $dryRun) {
                    $deleted = cdm_delete_post_meta($pdo, $prefix, $variationId, $oldKey);
                } elseif (cdm_get_post_meta($pdo, $prefix, $variationId, $oldKey) !== null) {
                    $deleted = 1;
                }

                if ($deleted > 0) {
                    $stats['variation_meta_deleted'] += $deleted;
                    $changed = true;
                }
                continue;
            }

            $term = cdm_term($pdo, $prefix, $definition['taxonomy'], $value, $dryRun, $stats);
            $current = cdm_get_post_meta($pdo, $prefix, $variationId, $newKey);

            if ($current !== $term['slug']) {
                $stats['variation_meta_added_or_updated']++;
                $changed = true;

                if (! $dryRun) {
                    cdm_update_post_meta($pdo, $prefix, $variationId, $newKey, $term['slug']);
                }
            }

            $deleted = 0;
            if (! $dryRun) {
                $deleted = cdm_delete_post_meta($pdo, $prefix, $variationId, $oldKey);
            } elseif (cdm_get_post_meta($pdo, $prefix, $variationId, $oldKey) !== null) {
                $deleted = 1;
            }

            if ($deleted > 0) {
                $stats['variation_meta_deleted'] += $deleted;
                $changed = true;
            }
        }

        if ($changed) {
            $stats['variations_changed']++;
        }
    }

    if (! $dryRun) {
        foreach (array_unique(array_column($attributeMap, 'taxonomy')) as $taxonomy) {
            cdm_recount_taxonomy($pdo, $prefix, $taxonomy);
        }

        $pdo->prepare("DELETE FROM {$prefix}options WHERE option_name IN ('_transient_wc_attribute_taxonomies', '_transient_timeout_wc_attribute_taxonomies')")
            ->execute();

        $pdo->commit();
    }
} catch (Throwable $exception) {
    if (! $dryRun && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    throw $exception;
}

foreach ($stats['terms_created'] as $taxonomy => $terms) {
    $stats['terms_created'][$taxonomy] = array_values(array_unique($terms));
}

echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
