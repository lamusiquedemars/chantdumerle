<?php

declare(strict_types=1);

$baseDir = dirname(__DIR__);
$importDir = $baseDir . '/woo-backend/wp-content/uploads/wc-imports';
$setsFile = $importDir . '/jeux-composes.csv';
$productsFile = $importDir . '/01-produits-woo.csv';

function cdm_read_csv(string $file): array
{
    $handle = fopen($file, 'rb');
    if ($handle === false) {
        throw new RuntimeException("Cannot open {$file}");
    }

    $headers = fgetcsv($handle, 0, ',', '"', '\\');
    if ($headers === false) {
        fclose($handle);
        throw new RuntimeException("Cannot read headers from {$file}");
    }

    $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', (string) $headers[0]);

    $rows = [];
    while (($data = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
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

function cdm_write_csv(string $file, array $headers, array $rows): void
{
    $handle = fopen($file, 'wb');
    if ($handle === false) {
        throw new RuntimeException("Cannot write {$file}");
    }

    fputcsv($handle, $headers, ',', '"', '\\');
    foreach ($rows as $row) {
        $line = [];
        foreach ($headers as $header) {
            $line[] = $row[$header] ?? '';
        }
        fputcsv($handle, $line, ',', '"', '\\');
    }

    fclose($handle);
}

function cdm_attribute_map(array $row): array
{
    $attributes = [];

    for ($index = 1; $index <= 30; $index++) {
        $name = trim((string) ($row["Attribute {$index} name"] ?? ''));
        if ($name === '') {
            continue;
        }

        $attributes[$name] = trim((string) ($row["Attribute {$index} value(s)"] ?? ''));
    }

    return $attributes;
}

function cdm_string_key(string $label): string
{
    return match ($label) {
        'Ré' => 're',
        default => mb_strtolower($label, 'UTF-8'),
    };
}

[$productHeaders, $productRows] = cdm_read_csv($productsFile);
[$setHeaders, $setRows] = cdm_read_csv($setsFile);

$productsBySku = [];
foreach ($productRows as $productRow) {
    $sku = trim((string) ($productRow['SKU'] ?? ''));
    if ($sku !== '') {
        $productsBySku[$sku] = $productRow;
    }
}

$compositionHeader = 'Meta: _set_composition';
for ($index = 1; $index <= 11; $index++) {
    $valueHeader = "Attribute {$index} value(s)";
    $visibleHeader = "Attribute {$index} visible";
    $globalHeader = "Attribute {$index} global";
    $valuePosition = array_search($valueHeader, $setHeaders, true);

    if ($valuePosition === false) {
        continue;
    }

    $insertAt = $valuePosition + 1;
    if (! in_array($visibleHeader, $setHeaders, true)) {
        array_splice($setHeaders, $insertAt, 0, [$visibleHeader]);
        $insertAt++;
    }

    if (! in_array($globalHeader, $setHeaders, true)) {
        array_splice($setHeaders, $insertAt, 0, [$globalHeader]);
    }
}

if (! in_array($compositionHeader, $setHeaders, true)) {
    $insertAfter = array_search('Meta: cdm_component_skus', $setHeaders, true);
    $insertAt = $insertAfter === false ? count($setHeaders) : $insertAfter + 1;
    array_splice($setHeaders, $insertAt, 0, [$compositionHeader]);
}

foreach ($setRows as &$setRow) {
    for ($index = 1; $index <= 11; $index++) {
        $attributeValue = trim((string) ($setRow["Attribute {$index} value(s)"] ?? ''));
        $setRow["Attribute {$index} visible"] = $attributeValue === '' ? '' : '1';
        $setRow["Attribute {$index} global"] = $attributeValue === '' ? '' : '1';
    }

    $setAttributes = cdm_attribute_map($setRow);
    $composition = [
        'instrument' => mb_strtolower((string) ($setAttributes['Instrument'] ?? ''), 'UTF-8'),
        'strings' => [],
    ];

    preg_match_all(
        '/(Mi|La|Ré|Sol|Do):\s*(CDM-[A-F0-9]{6})/u',
        (string) ($setRow['Meta: cdm_component_skus'] ?? ''),
        $matches,
        PREG_SET_ORDER
    );

    foreach ($matches as $match) {
        $label = $match[1];
        $sku = $match[2];
        $productRow = $productsBySku[$sku] ?? [];
        $productAttributes = cdm_attribute_map($productRow);

        $composition['strings'][cdm_string_key($label)] = array_filter(
            [
                'sku' => $sku,
                'name' => trim((string) ($productRow['Name'] ?? '')),
                'brand' => $productAttributes['Marque'] ?? '',
                'model' => $productAttributes['Modèle'] ?? '',
                'string' => $label,
            ],
            static fn (string $value): bool => $value !== ''
        );
    }

    $setRow[$compositionHeader] = json_encode(
        $composition,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}
unset($setRow);

cdm_write_csv($setsFile, $setHeaders, $setRows);

echo json_encode(
    [
        'file' => $setsFile,
        'rows' => count($setRows),
        'headers' => count($setHeaders),
        'composition_meta' => $compositionHeader,
    ],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
) . PHP_EOL;
