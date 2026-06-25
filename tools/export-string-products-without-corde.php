<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$outputPath = $root . '/next-frontend/mvc/exports/woo-cordes-sans-pa-corde.csv';
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
        sku.meta_value AS sku,
        p.post_title AS nom,
        GROUP_CONCAT(DISTINCT brand.name ORDER BY brand.name SEPARATOR ', ') AS marque,
        GROUP_CONCAT(DISTINCT model.name ORDER BY model.name SEPARATOR ', ') AS modele,
        '' AS corde,
        price.meta_value AS prix
     FROM (
        SELECT DISTINCT p.ID
        FROM {$prefix}posts p
        JOIN {$prefix}term_relationships tr_cat ON tr_cat.object_id = p.ID
        JOIN {$prefix}term_taxonomy tt_cat
          ON tt_cat.term_taxonomy_id = tr_cat.term_taxonomy_id
         AND tt_cat.taxonomy = 'product_cat'
        JOIN {$prefix}term_taxonomy tt_parent ON tt_parent.term_taxonomy_id = tt_cat.parent
        JOIN {$prefix}terms parent_cat
          ON parent_cat.term_id = tt_parent.term_id
         AND parent_cat.slug = 'cordes'
        WHERE p.post_type = 'product'
          AND p.post_status IN ('publish', 'private', 'draft')
     ) string_products
     JOIN {$prefix}posts p ON p.ID = string_products.ID
     LEFT JOIN (
        SELECT DISTINCT tr.object_id AS product_id
        FROM {$prefix}term_relationships tr
        JOIN {$prefix}term_taxonomy tt
          ON tt.term_taxonomy_id = tr.term_taxonomy_id
         AND tt.taxonomy = 'pa_corde'
     ) corde_products ON corde_products.product_id = p.ID
     LEFT JOIN {$prefix}postmeta sku
       ON sku.post_id = p.ID
      AND sku.meta_key = '_sku'
     LEFT JOIN (
        SELECT post_id, MAX(meta_value) AS meta_value
        FROM {$prefix}postmeta
        WHERE meta_key = '_price'
        GROUP BY post_id
     ) price ON price.post_id = p.ID
     LEFT JOIN {$prefix}term_relationships tr_brand ON tr_brand.object_id = p.ID
     LEFT JOIN {$prefix}term_taxonomy tt_brand
       ON tt_brand.term_taxonomy_id = tr_brand.term_taxonomy_id
      AND tt_brand.taxonomy = 'product_brand'
     LEFT JOIN {$prefix}terms brand ON brand.term_id = tt_brand.term_id
     LEFT JOIN {$prefix}term_relationships tr_model ON tr_model.object_id = p.ID
     LEFT JOIN {$prefix}term_taxonomy tt_model
       ON tt_model.term_taxonomy_id = tr_model.term_taxonomy_id
      AND tt_model.taxonomy = 'pa_modele'
     LEFT JOIN {$prefix}terms model ON model.term_id = tt_model.term_id
     WHERE corde_products.product_id IS NULL
     GROUP BY p.ID, sku.meta_value, p.post_title, price.meta_value
     ORDER BY marque, modele, nom"
)->fetchAll();

$output = fopen($outputPath, 'wb');

if ($output === false) {
    throw new RuntimeException("Unable to open {$outputPath}");
}

write_csv_row($output, ['SKU', 'Nom', 'Marque', 'Modèle', 'Corde', 'Prix']);

foreach ($rows as $row) {
    write_csv_row($output, [
        (string) ($row['sku'] ?? ''),
        (string) $row['nom'],
        (string) ($row['marque'] ?? ''),
        (string) ($row['modele'] ?? ''),
        (string) ($row['corde'] ?? ''),
        (string) ($row['prix'] ?? ''),
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
