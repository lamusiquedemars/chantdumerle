<?php

declare(strict_types=1);

/*
 * Build a WooCommerce CSV update for accessory attributes.
 *
 * Source:
 * - woo-backend/wp-content/uploads/wc-imports/accessoires.csv
 *
 * Output:
 * - next-frontend/mvc/exports/woo-accessoires-attributs-import.csv
 *
 * The generated CSV updates existing Woo products by ID/SKU and normalizes the
 * main attributes as Woo global attributes. Product data such as price, stock,
 * description and images is intentionally omitted.
 */

$root = dirname(__DIR__);
$sourcePath = $root . '/woo-backend/wp-content/uploads/wc-imports/accessoires.csv';
$outputPath = $root . '/next-frontend/mvc/exports/woo-accessoires-attributs-import.csv';

if (!is_file($sourcePath)) {
    fwrite(STDERR, "Missing source CSV: {$sourcePath}\n");
    exit(1);
}

$source = readAccessorySource($sourcePath);

$mysqli = new mysqli('127.0.0.1', 'root', 'root', 'chantdumerle_wp', 3306);
if ($mysqli->connect_errno) {
    fwrite(STDERR, "MySQL connection failed: {$mysqli->connect_error}\n");
    exit(1);
}

$mysqli->set_charset('utf8mb4');

$skus = array_keys($source);
$products = fetchProductsBySku($mysqli, $skus);

$headers = ['ID', 'SKU', 'Name'];
$attributeColumns = [
    ['Instrument', true],
    ['Marque', true],
    ['Modèle', true],
    ['Type produit', true],
    ['Taille', true],
    ['Couleur', false],
    ['Matière', false],
    ['Poids', false],
    ['Forme', false],
    ['Capacité archets', false],
    ['Roulettes', false],
    ['Variante', false],
];

foreach (array_keys($attributeColumns) as $index) {
    $number = $index + 1;
    $headers[] = "Attribute {$number} name";
    $headers[] = "Attribute {$number} value(s)";
    $headers[] = "Attribute {$number} visible";
    $headers[] = "Attribute {$number} global";
}

$rows = [];
$missingInWoo = [];
$skippedNotPublished = [];
$skippedVariations = [];

foreach ($source as $sku => $item) {
    $product = $products[$sku] ?? null;

    if (!$product) {
        $missingInWoo[] = $sku;
        continue;
    }

    if ($product['post_type'] === 'product_variation') {
        $skippedVariations[] = $sku;
        continue;
    }

    if ($product['post_status'] !== 'publish') {
        $skippedNotPublished[] = $sku;
        continue;
    }

    $row = [
        $product['ID'],
        $sku,
        $product['post_title'],
    ];

    foreach ($attributeColumns as [$name, $isGlobal]) {
        $sourceName = $name === 'Type produit' ? 'Type de produit' : $name;
        $value = normalizeAttributeValue($item['attributes'][$sourceName] ?? '', $name);

        $row[] = $name;
        $row[] = $value;
        $row[] = $value === '' ? '0' : '1';
        $row[] = $isGlobal ? '1' : '0';
    }

    $rows[] = $row;
}

usort($rows, static fn(array $left, array $right): int => (int) $left[0] <=> (int) $right[0]);

$output = fopen($outputPath, 'wb');
if (!$output) {
    fwrite(STDERR, "Unable to write output CSV: {$outputPath}\n");
    exit(1);
}

fputcsv($output, $headers, ',', '"', '');
foreach ($rows as $row) {
    fputcsv($output, $row, ',', '"', '');
}
fclose($output);

echo "Generated: {$outputPath}\n";
echo 'Rows: ' . count($rows) . "\n";
echo 'Source SKUs: ' . count($source) . "\n";
echo 'Missing in Woo: ' . count($missingInWoo) . "\n";
echo 'Skipped not published: ' . count($skippedNotPublished) . "\n";
echo 'Skipped variations: ' . count($skippedVariations) . "\n";

if ($missingInWoo !== []) {
    echo 'Missing SKUs: ' . implode(', ', array_slice($missingInWoo, 0, 20));
    echo count($missingInWoo) > 20 ? "...\n" : "\n";
}

if ($skippedNotPublished !== []) {
    echo 'Skipped SKUs: ' . implode(', ', array_slice($skippedNotPublished, 0, 20));
    echo count($skippedNotPublished) > 20 ? "...\n" : "\n";
}

if ($skippedVariations !== []) {
    echo 'Variation SKUs: ' . implode(', ', array_slice($skippedVariations, 0, 20));
    echo count($skippedVariations) > 20 ? "...\n" : "\n";
}

/**
 * @return array<string, array{name: string, attributes: array<string, string>}>
 */
function readAccessorySource(string $path): array
{
    $file = new SplFileObject($path, 'rb');
    $file->setCsvControl(',', '"', '');

    $headers = $file->fgetcsv();
    if (!is_array($headers)) {
        return [];
    }

    $indexes = array_flip($headers);
    $source = [];

    while (!$file->eof()) {
        $row = $file->fgetcsv();

        if (!is_array($row) || count($row) < 2) {
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
 * @return array<string, array{ID: int, post_title: string, post_status: string, post_type: string}>
 */
function fetchProductsBySku(mysqli $mysqli, array $skus): array
{
    if ($skus === []) {
        return [];
    }

    $products = [];
    $chunks = array_chunk($skus, 100);

    foreach ($chunks as $chunk) {
        $quoted = array_map(
            static fn(string $sku): string => "'" . $mysqli->real_escape_string($sku) . "'",
            $chunk
        );

        $sql = "
            SELECT p.ID, p.post_title, p.post_status, p.post_type, sku.meta_value AS sku
            FROM wp_posts p
            JOIN wp_postmeta sku
              ON sku.post_id = p.ID
             AND sku.meta_key = '_sku'
            WHERE p.post_type IN ('product', 'product_variation')
              AND sku.meta_value IN (" . implode(',', $quoted) . ")
        ";

        $result = $mysqli->query($sql);
        if (!$result) {
            fwrite(STDERR, "MySQL query failed: {$mysqli->error}\n");
            exit(1);
        }

        while ($row = $result->fetch_assoc()) {
            $products[(string) $row['sku']] = [
                'ID' => (int) $row['ID'],
                'post_title' => (string) $row['post_title'],
                'post_status' => (string) $row['post_status'],
                'post_type' => (string) $row['post_type'],
            ];
        }
    }

    return $products;
}

function normalizeAttributeValue(string $value, string $attributeName): string
{
    $value = trim($value);

    if ($value === '') {
        return '';
    }

    if ($attributeName === 'Instrument' && $value === 'Archet') {
        return '';
    }

    $value = str_replace(' | ', ', ', $value);

    return preg_replace('/\s+/', ' ', $value) ?? $value;
}
