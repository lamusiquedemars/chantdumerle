<?php

declare(strict_types=1);

/*
 * Repair accessory product attributes in WooCommerce.
 *
 * This script converts the accessory import's local attributes into the global
 * Woo taxonomies needed by the frontend filters. It targets product parents
 * only; variation rows from the source CSV are intentionally skipped.
 *
 * Dry-run:
 *   php tools/repair-accessory-global-attributes.php
 *
 * Apply:
 *   php tools/repair-accessory-global-attributes.php --apply
 */

$dryRun = ! in_array('--apply', $argv, true);
$root = dirname(__DIR__);
$sourcePath = $root . '/woo-backend/wp-content/uploads/wc-imports/accessoires.csv';
$prefix = 'wp_';

$globalAttributes = [
    'Instrument' => [
        'taxonomy' => 'pa_instrument',
        'source' => 'Instrument',
        'split' => 'comma',
    ],
    'Marque' => [
        'taxonomy' => 'pa_marque',
        'source' => 'Marque',
        'split' => 'none',
    ],
    'Modèle' => [
        'taxonomy' => 'pa_modele',
        'source' => 'Modèle',
        'split' => 'none',
    ],
    'Type produit' => [
        'taxonomy' => 'pa_type_produit',
        'source' => 'Type de produit',
        'split' => 'none',
    ],
];

$stats = [
    'mode' => $dryRun ? 'dry-run' : 'apply',
    'source_skus' => 0,
    'products_matched' => 0,
    'products_changed' => 0,
    'variations_skipped' => 0,
    'missing_skus' => [],
    'terms_set' => [],
    'terms_created' => [],
    'attributes_rewritten' => 0,
];

if (! is_file($sourcePath)) {
    fwrite(STDERR, "Missing source CSV: {$sourcePath}\n");
    exit(1);
}

$source = read_accessory_source($sourcePath);
$stats['source_skus'] = count($source);

$pdo = new PDO(
    'mysql:host=127.0.0.1;port=3306;dbname=chantdumerle_wp;charset=utf8mb4',
    'root',
    'root',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

$products = fetch_products_by_sku($pdo, $prefix, array_keys($source));

if (! $dryRun) {
    $pdo->beginTransaction();
}

try {
    foreach ($source as $sku => $item) {
        $product = $products[$sku] ?? null;

        if (! $product) {
            $stats['missing_skus'][] = $sku;
            continue;
        }

        if ($product['post_type'] === 'product_variation') {
            $stats['variations_skipped']++;
            continue;
        }

        if ($product['post_status'] !== 'publish') {
            continue;
        }

        $productId = (int) $product['ID'];
        $stats['products_matched']++;

        $serialized = get_post_meta_value($pdo, $prefix, $productId, '_product_attributes');
        $attributes = is_string($serialized) && $serialized !== ''
            ? @unserialize($serialized)
            : [];

        if (! is_array($attributes)) {
            $attributes = [];
        }

        $newAttributes = $attributes;
        $changed = false;
        $position = 0;

        foreach ($globalAttributes as $displayName => $definition) {
            $taxonomy = $definition['taxonomy'];
            $sourceName = $definition['source'];
            $values = split_values((string) ($item['attributes'][$sourceName] ?? ''), $definition['split']);
            $values = array_values(array_filter(
                array_map(
                    static fn(string $value): string => canonical_value($sourceName, $value),
                    $values
                ),
                static fn(string $value): bool => $value !== ''
            ));

            if ($values === []) {
                continue;
            }

            if (! $dryRun) {
                delete_relationships_for_taxonomy($pdo, $prefix, $productId, $taxonomy);
            }

            foreach ($values as $value) {
                $term = term($pdo, $prefix, $taxonomy, $value, $dryRun, $stats);
                $stats['terms_set'][$taxonomy] = ($stats['terms_set'][$taxonomy] ?? 0) + 1;

                if (! $dryRun) {
                    insert_relationship($pdo, $prefix, $productId, $term['term_taxonomy_id']);
                }
            }

            $localKeys = local_keys_for_source($sourceName);
            $sourceAttribute = null;
            foreach ($localKeys as $localKey) {
                if (isset($attributes[$localKey]) && is_array($attributes[$localKey])) {
                    $sourceAttribute = $attributes[$localKey];
                    unset($newAttributes[$localKey]);
                }
            }

            $newAttributes[$taxonomy] = [
                'name' => $taxonomy,
                'value' => '',
                'position' => $position++,
                'is_visible' => 1,
                'is_variation' => (int) ($sourceAttribute['is_variation'] ?? 0),
                'is_taxonomy' => 1,
            ];

            $changed = true;
        }

        if ($changed) {
            $stats['products_changed']++;
            $stats['attributes_rewritten']++;

            if (! $dryRun) {
                update_post_meta($pdo, $prefix, $productId, '_product_attributes', serialize($newAttributes));
            }
        }
    }

    if (! $dryRun) {
        foreach (array_unique(array_column($globalAttributes, 'taxonomy')) as $taxonomy) {
            recount_taxonomy($pdo, $prefix, $taxonomy);
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

if (count($stats['missing_skus']) > 20) {
    $stats['missing_skus'] = array_merge(array_slice($stats['missing_skus'], 0, 20), ['...']);
}

echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;

/**
 * @return array<string, array{name: string, attributes: array<string, string>}>
 */
function read_accessory_source(string $path): array
{
    $file = new SplFileObject($path, 'rb');
    $file->setCsvControl(',', '"', '');
    $headers = $file->fgetcsv();

    if (! is_array($headers)) {
        return [];
    }

    $indexes = array_flip($headers);
    $source = [];

    while (! $file->eof()) {
        $row = $file->fgetcsv();

        if (! is_array($row) || count($row) < 2) {
            continue;
        }

        $sku = trim((string) ($row[$indexes['SKU']] ?? ''));
        if ($sku === '' || $sku === 'SKU') {
            continue;
        }

        $attributes = [];
        for ($i = 1; $i <= 12; $i++) {
            $name = trim((string) ($row[$indexes["Attribute {$i} name"]] ?? ''));
            $value = trim((string) ($row[$indexes["Attribute {$i} value(s)"]] ?? ''));

            if ($name !== '') {
                $attributes[$name] = $value;
            }
        }

        $source[$sku] = [
            'name' => trim((string) ($row[$indexes['Name']] ?? '')),
            'attributes' => $attributes,
        ];
    }

    return $source;
}

/**
 * @param string[] $skus
 * @return array<string, array{ID: int, post_type: string, post_status: string}>
 */
function fetch_products_by_sku(PDO $pdo, string $prefix, array $skus): array
{
    $products = [];

    foreach (array_chunk($skus, 100) as $chunk) {
        $placeholders = implode(',', array_fill(0, count($chunk), '?'));
        $statement = $pdo->prepare(
            "SELECT p.ID, p.post_type, p.post_status, sku.meta_value AS sku
             FROM {$prefix}posts p
             JOIN {$prefix}postmeta sku
               ON sku.post_id = p.ID
              AND sku.meta_key = '_sku'
             WHERE p.post_type IN ('product', 'product_variation')
               AND sku.meta_value IN ({$placeholders})"
        );
        $statement->execute($chunk);

        foreach ($statement->fetchAll() as $row) {
            $products[(string) $row['sku']] = [
                'ID' => (int) $row['ID'],
                'post_type' => (string) $row['post_type'],
                'post_status' => (string) $row['post_status'],
            ];
        }
    }

    return $products;
}

/**
 * @return string[]
 */
function split_values(string $value, string $mode): array
{
    $value = trim($value);
    if ($value === '') {
        return [];
    }

    $pattern = match ($mode) {
        'comma' => '/\s*,\s*/',
        'pipe' => '/\s*\|\s*/',
        default => null,
    };

    if ($pattern === null) {
        return [$value];
    }

    return array_values(array_unique(array_filter(
        array_map('trim', preg_split($pattern, $value) ?: []),
        static fn(string $part): bool => $part !== ''
    )));
}

function canonical_value(string $sourceName, string $value): string
{
    $value = trim($value);

    if ($sourceName === 'Instrument' && $value === 'Archet') {
        return '';
    }

    if ($sourceName === 'Type de produit') {
        return str_replace('Type de produit', 'Type produit', $value);
    }

    return $value;
}

/**
 * @return string[]
 */
function local_keys_for_source(string $sourceName): array
{
    return match ($sourceName) {
        'Instrument' => ['instrument'],
        'Marque' => ['marque'],
        'Modèle' => ['modele'],
        'Type de produit' => ['type-de-produit', 'type-produit'],
        'Taille' => ['taille'],
        default => [],
    };
}

function slug(string $value): string
{
    $slug = strtr($value, [
        'à' => 'a', 'â' => 'a', 'ä' => 'a',
        'ç' => 'c',
        'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
        'î' => 'i', 'ï' => 'i',
        'ô' => 'o', 'ö' => 'o',
        'ù' => 'u', 'û' => 'u', 'ü' => 'u',
        'À' => 'a', 'Â' => 'a', 'Ä' => 'a',
        'Ç' => 'c',
        'É' => 'e', 'È' => 'e', 'Ê' => 'e', 'Ë' => 'e',
        'Î' => 'i', 'Ï' => 'i',
        'Ô' => 'o', 'Ö' => 'o',
        'Ù' => 'u', 'Û' => 'u', 'Ü' => 'u',
    ]);
    $slug = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $slug);
    $slug = $slug === false ? $value : $slug;
    $slug = strtolower($slug);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?: '';

    return trim($slug, '-');
}

/**
 * @param array<string, mixed> $stats
 * @return array{term_id: int, term_taxonomy_id: int, slug: string}
 */
function term(PDO $pdo, string $prefix, string $taxonomy, string $name, bool $dryRun, array &$stats): array
{
    $slug = slug($name);
    $statement = $pdo->prepare(
        "SELECT t.term_id, tt.term_taxonomy_id, t.slug
         FROM {$prefix}terms t
         JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id
         WHERE tt.taxonomy = :taxonomy
           AND t.slug = :slug
         LIMIT 1"
    );
    $statement->execute(['taxonomy' => $taxonomy, 'slug' => $slug]);
    $row = $statement->fetch();

    if ($row) {
        return [
            'term_id' => (int) $row['term_id'],
            'term_taxonomy_id' => (int) $row['term_taxonomy_id'],
            'slug' => (string) $row['slug'],
        ];
    }

    $stats['terms_created'][$taxonomy][] = $name;

    if ($dryRun) {
        return [
            'term_id' => 0,
            'term_taxonomy_id' => 0,
            'slug' => $slug,
        ];
    }

    $pdo->prepare("INSERT INTO {$prefix}terms (name, slug, term_group) VALUES (:name, :slug, 0)")
        ->execute(['name' => $name, 'slug' => $slug]);
    $termId = (int) $pdo->lastInsertId();

    $pdo->prepare("INSERT INTO {$prefix}term_taxonomy (term_id, taxonomy, description, parent, count) VALUES (:term_id, :taxonomy, '', 0, 0)")
        ->execute(['term_id' => $termId, 'taxonomy' => $taxonomy]);

    return [
        'term_id' => $termId,
        'term_taxonomy_id' => (int) $pdo->lastInsertId(),
        'slug' => $slug,
    ];
}

function get_post_meta_value(PDO $pdo, string $prefix, int $postId, string $key): ?string
{
    $statement = $pdo->prepare(
        "SELECT meta_value FROM {$prefix}postmeta WHERE post_id = :post_id AND meta_key = :meta_key LIMIT 1"
    );
    $statement->execute(['post_id' => $postId, 'meta_key' => $key]);
    $value = $statement->fetchColumn();

    return $value === false ? null : (string) $value;
}

function update_post_meta(PDO $pdo, string $prefix, int $postId, string $key, string $value): void
{
    $statement = $pdo->prepare(
        "UPDATE {$prefix}postmeta SET meta_value = :meta_value WHERE post_id = :post_id AND meta_key = :meta_key"
    );
    $statement->execute(['meta_value' => $value, 'post_id' => $postId, 'meta_key' => $key]);

    if ($statement->rowCount() === 0) {
        $pdo->prepare(
            "INSERT INTO {$prefix}postmeta (post_id, meta_key, meta_value) VALUES (:post_id, :meta_key, :meta_value)"
        )->execute(['post_id' => $postId, 'meta_key' => $key, 'meta_value' => $value]);
    }
}

function delete_relationships_for_taxonomy(PDO $pdo, string $prefix, int $postId, string $taxonomy): void
{
    $pdo->prepare(
        "DELETE tr FROM {$prefix}term_relationships tr
         JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         WHERE tr.object_id = :object_id
           AND tt.taxonomy = :taxonomy"
    )->execute(['object_id' => $postId, 'taxonomy' => $taxonomy]);
}

function insert_relationship(PDO $pdo, string $prefix, int $postId, int $termTaxonomyId): void
{
    $pdo->prepare(
        "INSERT IGNORE INTO {$prefix}term_relationships (object_id, term_taxonomy_id, term_order)
         VALUES (:object_id, :term_taxonomy_id, 0)"
    )->execute(['object_id' => $postId, 'term_taxonomy_id' => $termTaxonomyId]);
}

function recount_taxonomy(PDO $pdo, string $prefix, string $taxonomy): void
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
