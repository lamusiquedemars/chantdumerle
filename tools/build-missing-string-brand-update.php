<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$outputPath = $root . '/next-frontend/mvc/exports/woo-cordes-brands-update.csv';
$reviewPath = $root . '/next-frontend/mvc/exports/woo-cordes-brands-a-controler.csv';
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

$brandTerms = $pdo->query(
    "SELECT t.name, t.slug
     FROM {$prefix}terms t
     JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id
     WHERE tt.taxonomy = 'product_brand'
     ORDER BY CHAR_LENGTH(t.name) DESC, t.name ASC"
)->fetchAll();

$brandAliases = [];
foreach ($brandTerms as $term) {
    $name = (string) $term['name'];

    $brandAliases[] = [
        'brand' => $name,
        'pattern' => brand_pattern($name),
    ];

    if ($name === "D'Addario") {
        $brandAliases[] = [
            'brand' => $name,
            'pattern' => brand_pattern("D’Addario"),
        ];
    }
}

$modelAliases = $pdo->query(
    "SELECT model.name AS model_name, brand.name AS brand_name
     FROM {$prefix}posts p
     JOIN {$prefix}term_relationships tr_model ON tr_model.object_id = p.ID
     JOIN {$prefix}term_taxonomy tt_model
       ON tt_model.term_taxonomy_id = tr_model.term_taxonomy_id
      AND tt_model.taxonomy = 'pa_modele'
     JOIN {$prefix}terms model ON model.term_id = tt_model.term_id
     JOIN {$prefix}term_relationships tr_brand ON tr_brand.object_id = p.ID
     JOIN {$prefix}term_taxonomy tt_brand
       ON tt_brand.term_taxonomy_id = tr_brand.term_taxonomy_id
      AND tt_brand.taxonomy = 'product_brand'
     JOIN {$prefix}terms brand ON brand.term_id = tt_brand.term_id
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
     GROUP BY model.name, brand.name"
)->fetchAll();

$brandsByModel = [];
foreach ($modelAliases as $alias) {
    $modelName = (string) $alias['model_name'];

    if (mb_strlen($modelName) < 4) {
        continue;
    }

    $brandsByModel[$modelName][(string) $alias['brand_name']] = true;
}

$modelBrandAliases = [];
foreach ($brandsByModel as $modelName => $brands) {
    if (count($brands) !== 1) {
        continue;
    }

    $modelBrandAliases[] = [
        'model' => $modelName,
        'brand' => array_key_first($brands),
        'pattern' => brand_pattern($modelName),
    ];
}

usort(
    $modelBrandAliases,
    static fn (array $left, array $right): int => mb_strlen($right['model']) <=> mb_strlen($left['model'])
);

$products = $pdo->query(
    "SELECT p.ID, sku.meta_value AS sku, p.post_title
     FROM (
         SELECT DISTINCT p.ID
         FROM {$prefix}posts p
         JOIN {$prefix}term_relationships tr_cat ON tr_cat.object_id = p.ID
         JOIN {$prefix}term_taxonomy tt_cat
           ON tt_cat.term_taxonomy_id = tr_cat.term_taxonomy_id
          AND tt_cat.taxonomy = 'product_cat'
         JOIN {$prefix}term_taxonomy tt_parent
           ON tt_parent.term_taxonomy_id = tt_cat.parent
         JOIN {$prefix}terms parent_cat
           ON parent_cat.term_id = tt_parent.term_id
          AND parent_cat.slug = 'cordes'
         WHERE p.post_type = 'product'
           AND p.post_status IN ('publish', 'private', 'draft')
     ) string_products
     JOIN {$prefix}posts p ON p.ID = string_products.ID
     LEFT JOIN (
         SELECT DISTINCT tr.object_id AS ID
         FROM {$prefix}term_relationships tr
         JOIN {$prefix}term_taxonomy tt
           ON tt.term_taxonomy_id = tr.term_taxonomy_id
          AND tt.taxonomy = 'product_brand'
     ) brand_products ON brand_products.ID = string_products.ID
     LEFT JOIN {$prefix}postmeta sku
       ON sku.post_id = p.ID
      AND sku.meta_key = '_sku'
     WHERE brand_products.ID IS NULL
     ORDER BY p.post_title"
)->fetchAll();

$headers = ['ID', 'SKU', 'Name', 'Brands'];
$reviewHeaders = ['ID', 'SKU', 'Name', 'Detected brands', 'Reason'];

$output = fopen($outputPath, 'wb');
$review = fopen($reviewPath, 'wb');

if ($output === false || $review === false) {
    throw new RuntimeException('Unable to open output files.');
}

write_csv_row($output, $headers);
write_csv_row($review, $reviewHeaders);

$stats = [
    'missing_brand' => 0,
    'update_rows' => 0,
    'review_rows' => 0,
];

foreach ($products as $product) {
    $stats['missing_brand'] += 1;

    $productId = (int) $product['ID'];
    $sku = (string) ($product['sku'] ?? '');
    $title = (string) $product['post_title'];
    $matches = detect_brands($title, $brandAliases);
    $modelMatches = detect_model_brands($title, $modelBrandAliases);
    $inferredBrands = array_values(array_unique([...$matches, ...$modelMatches]));

    if (str_starts_with($sku, 'CDM-SET-')) {
        if (count($inferredBrands) === 1) {
            write_csv_row($output, [
                $productId,
                $sku,
                $title,
                $inferredBrands[0],
            ]);
            $stats['update_rows'] += 1;
            continue;
        }

        write_csv_row(
            $review,
            [
                $productId,
                $sku,
                $title,
                implode(' | ', $inferredBrands),
                count($inferredBrands) === 0
                    ? 'selection/composed set: no brand inferred'
                    : 'selection/composed set: multiple brands inferred',
            ]
        );
        $stats['review_rows'] += 1;
        continue;
    }

    if (count($inferredBrands) !== 1) {
        write_csv_row($review, [
            $productId,
            $sku,
            $title,
            implode(' | ', $inferredBrands),
            count($inferredBrands) === 0 ? 'no brand found in title/model' : 'multiple brands found in title/model',
        ]);
        $stats['review_rows'] += 1;
        continue;
    }

    write_csv_row($output, [
        $productId,
        $sku,
        $title,
        $inferredBrands[0],
    ]);
    $stats['update_rows'] += 1;
}

fclose($output);
fclose($review);

echo json_encode(
    [
        'output' => $outputPath,
        'review' => $reviewPath,
        'stats' => $stats,
    ],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
) . PHP_EOL;

function detect_brands(string $title, array $brandAliases): array
{
    $matches = [];

    foreach ($brandAliases as $alias) {
        if (preg_match($alias['pattern'], $title) === 1) {
            $matches[$alias['brand']] = true;
        }
    }

    return array_keys($matches);
}

function brand_pattern(string $brand): string
{
    $quoted = preg_quote($brand, '/');

    return '/(?<![\p{L}\p{N}])' . $quoted . '(?![\p{L}\p{N}])/iu';
}

function detect_model_brands(string $title, array $modelBrandAliases): array
{
    $matches = [];

    foreach ($modelBrandAliases as $alias) {
        if (preg_match($alias['pattern'], $title) === 1) {
            $matches[$alias['brand']] = true;
        }
    }

    return array_keys($matches);
}

/**
 * @param resource $handle
 * @param list<string|int> $row
 */
function write_csv_row($handle, array $row): void
{
    fputcsv($handle, $row, ',', '"', '\\', "\n");
}
