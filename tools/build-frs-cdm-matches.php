<?php

declare(strict_types=1);

$baseDir = dirname(__DIR__);
$importDir = $baseDir . '/woo-backend/wp-content/uploads/wc-imports';

$cdmFile = $importDir . '/catalogue-cordes-cdm.csv';
$frsFile = $importDir . '/catalogue-cordes-frs.csv';

$matchedFile = $importDir . '/catalogue-cordes-correspondances-ean.csv';
$missingEanFile = $importDir . '/catalogue-cordes-sans-ean-a-rapprocher.csv';
$ambiguousFile = $importDir . '/catalogue-cordes-ean-a-controler.csv';
$reportFile = $importDir . '/catalogue-cordes-correspondances-rapport.json';

function read_csv_assoc(string $file, string $delimiter): array
{
    $handle = fopen($file, 'rb');
    if ($handle === false) {
        throw new RuntimeException("Cannot open {$file}");
    }

    $headers = fgetcsv($handle, 0, $delimiter, '"', '\\');
    if ($headers === false) {
        fclose($handle);
        throw new RuntimeException("Cannot read headers from {$file}");
    }

    $rows = [];
    while (($data = fgetcsv($handle, 0, $delimiter, '"', '\\')) !== false) {
        if (count($data) === 1 && trim((string) $data[0]) === '') {
            continue;
        }

        $row = [];
        foreach ($headers as $index => $header) {
            $row[(string) $header] = $data[$index] ?? '';
        }
        $rows[] = $row;
    }

    fclose($handle);

    return [$headers, $rows];
}

function write_csv_assoc(string $file, array $headers, array $rows): void
{
    $handle = fopen($file, 'wb');
    if ($handle === false) {
        throw new RuntimeException("Cannot write {$file}");
    }

    fputcsv($handle, $headers, ';', '"', '\\');
    foreach ($rows as $row) {
        $line = [];
        foreach ($headers as $header) {
            $line[] = $row[$header] ?? '';
        }
        fputcsv($handle, $line, ';', '"', '\\');
    }

    fclose($handle);
}

function clean_value(?string $value): string
{
    return trim((string) $value);
}

function normalize_key(string $value): string
{
    $value = mb_strtolower(trim($value), 'UTF-8');
    $value = str_replace(['é', 'è', 'ê', 'ë'], 'e', $value);
    $value = str_replace(['à', 'â', 'ä'], 'a', $value);
    $value = str_replace(['î', 'ï'], 'i', $value);
    $value = str_replace(['ô', 'ö'], 'o', $value);
    $value = str_replace(['ù', 'û', 'ü'], 'u', $value);
    $value = str_replace(['ç'], 'c', $value);

    return preg_replace('/[^a-z0-9]+/', '_', $value) ?? $value;
}

function attribute_map(array $row): array
{
    $attributes = [];
    for ($index = 1; $index <= 30; $index++) {
        $name = clean_value($row["Attribute{$index}_name"] ?? '');
        if ($name === '') {
            continue;
        }

        $attributes[normalize_key($name)] = clean_value($row["Attribute{$index}_value"] ?? '');
    }

    return $attributes;
}

function first_attr(array $attributes, array $keys): string
{
    foreach ($keys as $key) {
        $normalized = normalize_key($key);
        if (($attributes[$normalized] ?? '') !== '') {
            return $attributes[$normalized];
        }
    }

    return '';
}

function count_by_key(array $rows, string $key): array
{
    $counts = [];
    foreach ($rows as $row) {
        $value = clean_value($row[$key] ?? '');
        if ($value === '') {
            continue;
        }

        $counts[$value] = ($counts[$value] ?? 0) + 1;
    }

    return $counts;
}

[$cdmHeaders, $cdmRows] = read_csv_assoc($cdmFile, ',');
[$frsHeaders, $frsRows] = read_csv_assoc($frsFile, ';');

$frsByEan = [];
foreach ($frsRows as $row) {
    $ean = clean_value($row['EAN'] ?? '');
    if ($ean === '') {
        continue;
    }

    $frsByEan[$ean][] = $row;
}

$cdmEanCounts = count_by_key($cdmRows, 'Meta: _ean');
$frsEanCounts = count_by_key($frsRows, 'EAN');

$commonHeaders = [
    'cdm_sku',
    'cdm_name',
    'cdm_ean',
    'cdm_brand_attr',
    'cdm_model_attr',
    'cdm_string_attr',
    'cdm_instrument_attr',
    'cdm_size_attr',
    'cdm_tension_attr',
];

$matchedHeaders = array_merge($commonHeaders, [
    'frs_ref',
    'frs_shop_code',
    'frs_name',
    'frs_stock',
    'frs_purchase_price',
    'frs_regular_price',
    'frs_regular_price_tva',
    'frs_ean',
    'frs_brand',
]);

$missingEanHeaders = array_merge($commonHeaders, [
    'cdm_categories',
    'candidate_search_text',
]);

$ambiguousHeaders = array_merge($matchedHeaders, [
    'reason',
    'cdm_ean_count',
    'frs_ean_count',
]);

$matched = [];
$missingEan = [];
$ambiguous = [];

foreach ($cdmRows as $cdmRow) {
    $attributes = attribute_map($cdmRow);
    $base = [
        'cdm_sku' => clean_value($cdmRow['SKU'] ?? ''),
        'cdm_name' => clean_value($cdmRow['Name'] ?? ''),
        'cdm_ean' => clean_value($cdmRow['Meta: _ean'] ?? ''),
        'cdm_brand_attr' => first_attr($attributes, ['Marque', 'Brand']),
        'cdm_model_attr' => first_attr($attributes, ['Modele', 'Modèle', 'Model']),
        'cdm_string_attr' => first_attr($attributes, ['Corde', 'String']),
        'cdm_instrument_attr' => first_attr($attributes, ['Instrument']),
        'cdm_size_attr' => first_attr($attributes, ['Taille', 'Size']),
        'cdm_tension_attr' => first_attr($attributes, ['Tension']),
    ];

    if ($base['cdm_ean'] === '') {
        $missingEan[] = array_merge($base, [
            'cdm_categories' => clean_value($cdmRow['Categories'] ?? ''),
            'candidate_search_text' => trim(implode(' ', array_filter([
                $base['cdm_brand_attr'],
                $base['cdm_model_attr'],
                $base['cdm_string_attr'],
                $base['cdm_instrument_attr'],
                $base['cdm_size_attr'],
                $base['cdm_tension_attr'],
                $base['cdm_name'],
            ]))),
        ]);
        continue;
    }

    $cdmCount = $cdmEanCounts[$base['cdm_ean']] ?? 0;
    $frsCount = $frsEanCounts[$base['cdm_ean']] ?? 0;
    $frsMatches = $frsByEan[$base['cdm_ean']] ?? [];

    if ($cdmCount === 1 && $frsCount === 1) {
        $frsRow = $frsMatches[0];
        $matched[] = array_merge($base, [
            'frs_ref' => clean_value($frsRow['Ref'] ?? ''),
            'frs_shop_code' => clean_value($frsRow['Shop_code'] ?? ''),
            'frs_name' => clean_value($frsRow['Name'] ?? ''),
            'frs_stock' => clean_value($frsRow['Stock'] ?? ''),
            'frs_purchase_price' => clean_value($frsRow['P_price'] ?? ''),
            'frs_regular_price' => clean_value($frsRow['R_price'] ?? ''),
            'frs_regular_price_tva' => clean_value($frsRow['R_price_TVA'] ?? ''),
            'frs_ean' => clean_value($frsRow['EAN'] ?? ''),
            'frs_brand' => clean_value($frsRow['Brand'] ?? ''),
        ]);
        continue;
    }

    if ($frsCount === 0) {
        $ambiguous[] = array_merge($base, [
            'frs_ref' => '',
            'frs_shop_code' => '',
            'frs_name' => '',
            'frs_stock' => '',
            'frs_purchase_price' => '',
            'frs_regular_price' => '',
            'frs_regular_price_tva' => '',
            'frs_ean' => '',
            'frs_brand' => '',
            'reason' => 'EAN absent du fichier FRS',
            'cdm_ean_count' => (string) $cdmCount,
            'frs_ean_count' => (string) $frsCount,
        ]);
        continue;
    }

    foreach ($frsMatches as $frsRow) {
        $ambiguous[] = array_merge($base, [
            'frs_ref' => clean_value($frsRow['Ref'] ?? ''),
            'frs_shop_code' => clean_value($frsRow['Shop_code'] ?? ''),
            'frs_name' => clean_value($frsRow['Name'] ?? ''),
            'frs_stock' => clean_value($frsRow['Stock'] ?? ''),
            'frs_purchase_price' => clean_value($frsRow['P_price'] ?? ''),
            'frs_regular_price' => clean_value($frsRow['R_price'] ?? ''),
            'frs_regular_price_tva' => clean_value($frsRow['R_price_TVA'] ?? ''),
            'frs_ean' => clean_value($frsRow['EAN'] ?? ''),
            'frs_brand' => clean_value($frsRow['Brand'] ?? ''),
            'reason' => 'EAN non unique cote CDM ou FRS',
            'cdm_ean_count' => (string) $cdmCount,
            'frs_ean_count' => (string) $frsCount,
        ]);
    }
}

write_csv_assoc($matchedFile, $matchedHeaders, $matched);
write_csv_assoc($missingEanFile, $missingEanHeaders, $missingEan);
write_csv_assoc($ambiguousFile, $ambiguousHeaders, $ambiguous);

$report = [
    'inputs' => [
        'cdm_file' => $cdmFile,
        'frs_file' => $frsFile,
        'cdm_rows' => count($cdmRows),
        'frs_rows' => count($frsRows),
    ],
    'outputs' => [
        'matched_by_unique_ean' => [
            'file' => $matchedFile,
            'rows' => count($matched),
        ],
        'missing_ean_to_match_by_text' => [
            'file' => $missingEanFile,
            'rows' => count($missingEan),
        ],
        'ean_to_review' => [
            'file' => $ambiguousFile,
            'rows' => count($ambiguous),
        ],
    ],
];

file_put_contents(
    $reportFile,
    json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL
);

echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
