<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$outputPath = $root . '/next-frontend/mvc/exports/woo-cordes-sans-product-brand.csv';
$prefix = 'wp_';

$pdo = new PDO(
    'mysql:host=127.0.0.1;port=3306;dbname=chantdumerle_wp;charset=utf8mb4',
    'root',
    'root',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

$rows = $pdo->query(
    "SELECT
        p.ID,
        sku.meta_value AS sku,
        p.post_title AS name,
        GROUP_CONCAT(DISTINCT child_cat.name ORDER BY child_cat.name SEPARATOR ', ') AS string_categories,
        GROUP_CONCAT(DISTINCT instrument.name ORDER BY instrument.name SEPARATOR ', ') AS instruments,
        GROUP_CONCAT(DISTINCT model.name ORDER BY model.name SEPARATOR ', ') AS models,
        GROUP_CONCAT(DISTINCT corde.name ORDER BY corde.name SEPARATOR ', ') AS cordes,
        GROUP_CONCAT(DISTINCT legacy_brand.name ORDER BY legacy_brand.name SEPARATOR ', ') AS legacy_pa_marque
     FROM {$prefix}posts p
     JOIN {$prefix}term_relationships tr_cat ON tr_cat.object_id = p.ID
     JOIN {$prefix}term_taxonomy tt_cat
       ON tt_cat.term_taxonomy_id = tr_cat.term_taxonomy_id
      AND tt_cat.taxonomy = 'product_cat'
     JOIN {$prefix}terms child_cat ON child_cat.term_id = tt_cat.term_id
     JOIN {$prefix}term_taxonomy tt_parent ON tt_parent.term_taxonomy_id = tt_cat.parent
     JOIN {$prefix}terms parent_cat
       ON parent_cat.term_id = tt_parent.term_id
      AND parent_cat.slug = 'cordes'
     LEFT JOIN (
        SELECT DISTINCT tr.object_id AS product_id
        FROM {$prefix}term_relationships tr
        JOIN {$prefix}term_taxonomy tt
          ON tt.term_taxonomy_id = tr.term_taxonomy_id
         AND tt.taxonomy = 'product_brand'
     ) brand_products ON brand_products.product_id = p.ID
     LEFT JOIN {$prefix}postmeta sku
       ON sku.post_id = p.ID
      AND sku.meta_key = '_sku'
     LEFT JOIN {$prefix}term_relationships tr_instrument ON tr_instrument.object_id = p.ID
     LEFT JOIN {$prefix}term_taxonomy tt_instrument
       ON tt_instrument.term_taxonomy_id = tr_instrument.term_taxonomy_id
      AND tt_instrument.taxonomy = 'pa_instrument'
     LEFT JOIN {$prefix}terms instrument ON instrument.term_id = tt_instrument.term_id
     LEFT JOIN {$prefix}term_relationships tr_model ON tr_model.object_id = p.ID
     LEFT JOIN {$prefix}term_taxonomy tt_model
       ON tt_model.term_taxonomy_id = tr_model.term_taxonomy_id
      AND tt_model.taxonomy = 'pa_modele'
     LEFT JOIN {$prefix}terms model ON model.term_id = tt_model.term_id
     LEFT JOIN {$prefix}term_relationships tr_corde ON tr_corde.object_id = p.ID
     LEFT JOIN {$prefix}term_taxonomy tt_corde
       ON tt_corde.term_taxonomy_id = tr_corde.term_taxonomy_id
      AND tt_corde.taxonomy = 'pa_corde'
     LEFT JOIN {$prefix}terms corde ON corde.term_id = tt_corde.term_id
     LEFT JOIN {$prefix}term_relationships tr_legacy_brand ON tr_legacy_brand.object_id = p.ID
     LEFT JOIN {$prefix}term_taxonomy tt_legacy_brand
       ON tt_legacy_brand.term_taxonomy_id = tr_legacy_brand.term_taxonomy_id
      AND tt_legacy_brand.taxonomy = 'pa_marque'
     LEFT JOIN {$prefix}terms legacy_brand ON legacy_brand.term_id = tt_legacy_brand.term_id
     WHERE p.post_type = 'product'
       AND p.post_status IN ('publish', 'private', 'draft')
       AND brand_products.product_id IS NULL
     GROUP BY p.ID, sku.meta_value, p.post_title
     ORDER BY string_categories, p.post_title"
)->fetchAll();

$output = fopen($outputPath, 'wb');

if ($output === false) {
    throw new RuntimeException("Unable to open {$outputPath}");
}

write_csv_row($output, [
    'ID',
    'SKU',
    'Name',
    'String categories',
    'Instruments',
    'Models',
    'Cordes',
    'Legacy pa_marque',
]);

foreach ($rows as $row) {
    write_csv_row($output, [
        (string) $row['ID'],
        (string) ($row['sku'] ?? ''),
        (string) $row['name'],
        (string) ($row['string_categories'] ?? ''),
        (string) ($row['instruments'] ?? ''),
        (string) ($row['models'] ?? ''),
        (string) ($row['cordes'] ?? ''),
        (string) ($row['legacy_pa_marque'] ?? ''),
    ]);
}

fclose($output);

echo json_encode(
    [
        'output' => $outputPath,
        'rows' => count($rows),
    ],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
) . PHP_EOL;

/**
 * @param resource $handle
 * @param list<string> $row
 */
function write_csv_row($handle, array $row): void
{
    fputcsv($handle, $row, ',', '"', '\\', "\n");
}
