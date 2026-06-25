<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$files = [
    $root . '/woo-backend/wp-content/uploads/wc-imports/packs_woocommerce_v2.csv',
    $root . '/woo-backend/wp-content/uploads/wc-imports/product-packs_woocommerce_v2-qxly2mn0dt.csv',
];

$attributeNameMap = [
    'Type de produit' => 'Type produit',
    'Complexité sonore' => 'Complexité',
    'Puissance sonore' => 'Puissance',
    'Usage musicien' => 'Usage',
    'Positionnement prix' => 'Positionnement',
    'Stabilité d’accord' => 'Stabilité',
    'Type de pack' => 'Type pack',
];

$attributeValueMap = [
    'Puissance' => [
        'équilibré' => 'modéré',
    ],
    'Usage' => [
        'débutant | étudiant' => 'débutant, étudiant',
        'débutant | étudiant | orchestre | soliste' => 'débutant, étudiant, orchestre, soliste',
        'étudiant | orchestre | soliste' => 'étudiant, orchestre, soliste',
    ],
];

foreach ($files as $file) {
    $handle = fopen($file, 'rb');

    if (! $handle) {
        throw new RuntimeException("Unable to read {$file}");
    }

    $headers = fgetcsv($handle, escape: '\\');

    if (! is_array($headers)) {
        throw new RuntimeException("Unable to parse headers from {$file}");
    }

    if (isset($headers[0])) {
        $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', $headers[0]) ?? $headers[0];
    }

    $rows = [];

    while (($row = fgetcsv($handle, escape: '\\')) !== false) {
        $row = array_pad($row, count($headers), '');

        for ($index = 1; $index <= 20; $index++) {
            $nameColumn = array_search("Attribute {$index} name", $headers, true);
            $valueColumn = array_search("Attribute {$index} value(s)", $headers, true);

            if ($nameColumn === false || $valueColumn === false) {
                continue;
            }

            $attributeName = $row[$nameColumn] ?? '';
            $targetName = $attributeNameMap[$attributeName] ?? $attributeName;
            $row[$nameColumn] = $targetName;

            if (isset($attributeValueMap[$targetName][$row[$valueColumn] ?? ''])) {
                $row[$valueColumn] = $attributeValueMap[$targetName][$row[$valueColumn]];
            }
        }

        $rows[] = $row;
    }

    fclose($handle);

    $handle = fopen($file, 'wb');

    if (! $handle) {
        throw new RuntimeException("Unable to write {$file}");
    }

    fputcsv($handle, $headers, escape: '\\');

    foreach ($rows as $row) {
        fputcsv($handle, $row, escape: '\\');
    }

    fclose($handle);
}

echo json_encode([
    'normalized_files' => $files,
    'attribute_names' => $attributeNameMap,
    'attribute_values' => $attributeValueMap,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
