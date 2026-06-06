<?php

declare(strict_types=1);

$baseDir = dirname(__DIR__);
$importDir = $baseDir . '/woo-backend/wp-content/uploads/wc-imports';

$cdmFile = $importDir . '/catalogue-cordes-cdm.csv';
$frsFile = $importDir . '/catalogue-cordes-frs.csv';
$controlFile = $importDir . '/catalogue-cordes-ean-a-controler.csv';
$controlBackupFile = $importDir . '/catalogue-cordes-ean-a-controler.backup-before-corrections-20260606.csv';
$correctedControlFile = $importDir . '/catalogue-cordes-ean-corrige.csv';
$wooImportFile = $importDir . '/01-produits-woo.csv';
$reportFile = $importDir . '/01-produits-woo-report.json';

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

function write_csv_assoc(string $file, array $headers, array $rows, string $delimiter = ','): void
{
    $handle = fopen($file, 'wb');
    if ($handle === false) {
        throw new RuntimeException("Cannot write {$file}");
    }

    fputcsv($handle, $headers, $delimiter, '"', '\\');
    foreach ($rows as $row) {
        $line = [];
        foreach ($headers as $header) {
            $line[] = $row[$header] ?? '';
        }
        fputcsv($handle, $line, $delimiter, '"', '\\');
    }

    fclose($handle);
}

function value(array $row, string $key): string
{
    return trim((string) ($row[$key] ?? ''));
}

function attribute_map(array $row): array
{
    $attributes = [];

    for ($index = 1; $index <= 30; $index++) {
        $name = value($row, "Attribute{$index}_name");
        if ($name === '') {
            continue;
        }

        $attributes[$name] = value($row, "Attribute{$index}_value");
    }

    return $attributes;
}

[$controlHeaders, $controlRows] = read_csv_assoc($controlFile, ';');
[$cdmHeaders, $cdmRows] = read_csv_assoc($cdmFile, ',');
[$frsHeaders, $frsRows] = read_csv_assoc($frsFile, ';');

if (! file_exists($controlBackupFile)) {
    copy($controlFile, $controlBackupFile);
}

$frsByRef = [];
foreach ($frsRows as $row) {
    $ref = value($row, 'Ref');
    if ($ref !== '') {
        $frsByRef[$ref] = $row;
    }
}

$resolvedMatches = [
    'CDM-F9C607' => 'ACCCEPI41',
    'CDM-EBB978' => 'ACCCDOPRO41',
    'CDM-AE9BF6' => 'ACCCESP3ª12',
    'CDM-581C57' => 'ACCCPPERP4ª44',
    'CDM-9DC927' => 'ACCCESP3ª34',
    'CDM-1A1FB6' => 'ACCCESP4ª34',
    'CDM-0E34B6' => 'ACCCBJA1ª',
    'CDM-1E24E9' => 'ACCCBJA2ª',
    'CDM-98892F' => 'ACCCBJA3ª',
    'CDM-C4134C' => 'ACCCBJA4ª',
    'CDM-52F454' => 'ACCCBJAJ',
    'CDM-C5A37E' => 'ACCCBSP5ºOR',
    'CDM-EDBCAE' => 'ACCCBSP5ªSO',
    'CDM-91B8D2' => 'ACCVLGPB1ªL27',
    'CDM-5F68E4' => 'ACCVLGPB1ªB27',
    'CDM-89FE33' => 'ACCVTO2ª116',
    'CDM-93AB7D' => 'ACCVTO3ª116',
    'CDM-CB2F0D' => 'ACCVWO3ª4103',
    'CDM-09F2FB' => 'ACCVWO4ª4104',
    'CDM-92AFE0' => 'ACCCBHEHYJL',
    'CDM-9A564E' => 'ACCCDOPROJ44',
    'CDM-7DBFA4' => 'ACCCEPI400J',
    'CDM-32D9F0' => 'ACCVIDY34J',
    'CDM-32D9F02' => 'ACCVIDY44J',
];

$droppedSkus = [
    'CDM-AE3A53' => 'Doublon CDM de Thomastik Spirocore S787 Sol 1/2, garder CDM-AE9BF6.',
    'CDM-6BF831' => 'Doublon CDM de Pirastro Perpetual Do 4/4, garder CDM-581C57.',
];

$nameCorrections = [
    'CDM-32D9F0' => 'Thomastik Dynamo – jeu – Medium – boule – 3/4',
    'CDM-32D9F02' => 'Thomastik Dynamo – jeu – Medium – boule – 4/4',
];

function build_name_from_attributes(array $attributes): string
{
    $brand = value($attributes, 'Marque');
    $model = value($attributes, 'Modèle');
    $string = value($attributes, 'Corde');
    $tension = value($attributes, 'Tension');
    $attachment = value($attributes, 'Attache');
    $size = value($attributes, 'Taille');

    $head = trim("{$brand} {$model}");
    $parts = array_filter([$head, $string, $tension, $attachment, $size]);

    return implode(' – ', $parts);
}

$correctedControlRows = [];
foreach ($resolvedMatches as $sku => $ref) {
    $sourceRow = null;
    foreach ($controlRows as $row) {
        if (value($row, 'cdm_sku') === $sku && value($row, 'frs_ref') === $ref) {
            $sourceRow = $row;
            break;
        }
    }

    if ($sourceRow === null) {
        $sourceRow = [];
        foreach ($controlHeaders as $header) {
            $sourceRow[$header] = '';
        }
        $sourceRow['cdm_sku'] = $sku;
        $sourceRow['frs_ref'] = $ref;
    }

    $frsRow = $frsByRef[$ref] ?? [];
    $sourceRow['frs_ref'] = $ref;
    $sourceRow['frs_shop_code'] = value($frsRow, 'Shop_code');
    $sourceRow['frs_name'] = value($frsRow, 'Name');
    $sourceRow['frs_stock'] = value($frsRow, 'Stock');
    $sourceRow['frs_purchase_price'] = value($frsRow, 'P_price');
    $sourceRow['frs_regular_price'] = value($frsRow, 'R_price');
    $sourceRow['frs_regular_price_tva'] = value($frsRow, 'R_price_TVA');
    $sourceRow['frs_ean'] = value($frsRow, 'EAN');
    $sourceRow['frs_brand'] = value($frsRow, 'Brand');
    $sourceRow['reason'] = 'Corrigé par correspondance nom espagnol';

    $correctedControlRows[] = $sourceRow;
}

write_csv_assoc($correctedControlFile, $controlHeaders, $correctedControlRows, ';');
write_csv_assoc($controlFile, $controlHeaders, $correctedControlRows, ';');

$commercialAttributes = [
    'Marque',
    'Modèle',
    'Instrument',
    'Corde',
    'Taille',
    'Tension',
    'Attache',
    'Âme',
    'Filage',
    'Type produit',
    'Type pack',
];

$baseHeaders = [
    'Type',
    'SKU',
    'Name',
    'Published',
    'Short description',
    'Description',
    'Regular price',
    'Stock',
    'Categories',
    'Images',
    'Slug',
    'Parent',
];

$wooHeaders = $baseHeaders;
foreach (array_values($commercialAttributes) as $index => $attributeName) {
    $number = $index + 1;
    $wooHeaders[] = "Attribute {$number} name";
    $wooHeaders[] = "Attribute {$number} value(s)";
    $wooHeaders[] = "Attribute {$number} visible";
    $wooHeaders[] = "Attribute {$number} global";
}
$wooHeaders[] = 'Meta: purchase_price';
$wooHeaders[] = 'Meta: _ean';
$wooHeaders[] = 'Meta: _frs_ref';
$wooHeaders[] = 'Meta: _external_image_url';

$wooRows = [];
$seenVariableParentSkus = [];
$skippedRows = [];
$resolvedApplied = [];

foreach ($cdmRows as $row) {
    $sku = value($row, 'SKU');
    $type = value($row, 'Type');

    if (isset($droppedSkus[$sku])) {
        $skippedRows[] = [
            'sku' => $sku,
            'name' => value($row, 'Name'),
            'reason' => $droppedSkus[$sku],
        ];
        continue;
    }

    if ($type === 'variable' && $sku !== '') {
        if (isset($seenVariableParentSkus[$sku])) {
            $skippedRows[] = [
                'sku' => $sku,
                'name' => value($row, 'Name'),
                'reason' => 'Parent variable CDM dupliqué, parent déjà conservé.',
            ];
            continue;
        }
        $seenVariableParentSkus[$sku] = true;
    }

    $attributes = attribute_map($row);
    $output = [];
    foreach ($baseHeaders as $header) {
        $output[$header] = $row[$header] ?? '';
    }

    if (isset($nameCorrections[$sku])) {
        $output['Name'] = $nameCorrections[$sku];
    } elseif (value($output, 'Name') === '') {
        $output['Name'] = build_name_from_attributes($attributes);
    }

    foreach (array_values($commercialAttributes) as $index => $attributeName) {
        $number = $index + 1;
        $attributeValue = $attributes[$attributeName] ?? '';

        if ($sku === 'CDM-52F454' && $attributeName === 'Corde') {
            $attributeValue = 'jeu';
        }

        $output["Attribute {$number} name"] = $attributeName;
        $output["Attribute {$number} value(s)"] = $attributeValue;
        $output["Attribute {$number} visible"] = $attributeValue === '' ? '' : '1';
        $output["Attribute {$number} global"] = $attributeValue === '' ? '' : '1';
    }

    $frsRef = value($row, 'Meta: _frs_ref');
    $purchasePrice = value($row, 'Meta: purchase_price');

    if (isset($resolvedMatches[$sku])) {
        $frsRef = $resolvedMatches[$sku];
        $frsRow = $frsByRef[$frsRef] ?? [];
        $output['Stock'] = value($frsRow, 'Stock');
        $output['Regular price'] = value($frsRow, 'R_price');
        $purchasePrice = value($frsRow, 'P_price');
        $resolvedApplied[] = [
            'sku' => $sku,
            'frs_ref' => $frsRef,
            'frs_name' => value($frsRow, 'Name'),
        ];
    }

    $output['Meta: purchase_price'] = $purchasePrice;
    $output['Meta: _ean'] = value($row, 'Meta: _ean');
    $output['Meta: _frs_ref'] = $frsRef;
    $output['Meta: _external_image_url'] = value($row, 'Images');

    $wooRows[] = $output;
}

write_csv_assoc($wooImportFile, $wooHeaders, $wooRows, ',');

$report = [
    'source_cdm_file' => $cdmFile,
    'source_frs_file' => $frsFile,
    'control_backup_file' => $controlBackupFile,
    'corrected_control_file' => $correctedControlFile,
    'woo_import_file' => $wooImportFile,
    'rows' => [
        'cdm_source' => count($cdmRows),
        'corrected_control' => count($correctedControlRows),
        'woo_import' => count($wooRows),
        'skipped' => count($skippedRows),
        'resolved_ambiguous_matches' => count($resolvedApplied),
    ],
    'skipped_rows' => $skippedRows,
    'resolved_ambiguous_matches' => $resolvedApplied,
];

file_put_contents(
    $reportFile,
    json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL
);

echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
