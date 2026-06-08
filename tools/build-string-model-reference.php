<?php

declare(strict_types=1);

$baseDir = dirname(__DIR__);
$importDir = $baseDir . '/woo-backend/wp-content/uploads/wc-imports';

$sourceFile = $importDir . '/cordes_attributs.csv';
$referenceFile = $importDir . '/cordes_modeles_referentiel.csv';
$missingFile = $importDir . '/cordes_modeles_a_completer.csv';
$reportFile = $importDir . '/cordes_modeles_referentiel-report.json';
$typescriptFile = $baseDir . '/next-frontend/mvc/src/sites/chantdumerle/content/stringModelAttributes.generated.ts';

$pdo = new PDO(
    'mysql:host=127.0.0.1;port=3306;dbname=chantdumerle_wp;charset=utf8mb4',
    'root',
    'root',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

function read_csv_assoc(string $file): array
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

    $rows = [];
    while (($data = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
        if (count($data) === 1 && trim((string) $data[0]) === '') {
            continue;
        }

        $row = [];
        foreach ($headers as $index => $header) {
            $row[(string) $header] = trim((string) ($data[$index] ?? ''));
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

function normalize_text(string $value): string
{
    $value = strtr($value, [
        'à' => 'a', 'â' => 'a', 'ä' => 'a', 'À' => 'a', 'Â' => 'a', 'Ä' => 'a',
        'ç' => 'c', 'Ç' => 'c',
        'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e', 'É' => 'e', 'È' => 'e', 'Ê' => 'e', 'Ë' => 'e',
        'î' => 'i', 'ï' => 'i', 'Î' => 'i', 'Ï' => 'i',
        'ô' => 'o', 'ö' => 'o', 'Ô' => 'o', 'Ö' => 'o',
        'ù' => 'u', 'û' => 'u', 'ü' => 'u', 'Ù' => 'u', 'Û' => 'u', 'Ü' => 'u',
        '’' => "'", '–' => '-', '—' => '-',
    ]);
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', ' ', $value) ?: '';
    $value = trim(preg_replace('/\s+/', ' ', $value) ?: '');

    $aliases = [
        'chorme' => 'chrome',
        'azul' => 'bleu',
        'roja' => 'rouge',
        'rojo' => 'rouge',
    ];

    $words = explode(' ', $value);
    $words = array_map(
        static fn (string $word): string => $aliases[$word] ?? $word,
        $words
    );

    return implode(' ', $words);
}

function model_key(string $brand, string $model): string
{
    return normalize_text($brand) . '|' . normalize_text($model);
}

function attr_value(array $row, string $key): string
{
    return trim((string) ($row[$key] ?? ''));
}

function has_any_attribute(array $row, array $attributeHeaders): bool
{
    foreach ($attributeHeaders as $header) {
        if (attr_value($row, $header) !== '') {
            return true;
        }
    }

    return false;
}

function split_multi_value(string $value): array
{
    if ($value === '') {
        return [];
    }

    $parts = preg_split('/\s*\|\s*/', $value) ?: [];
    $parts = array_map(static fn (string $part): string => trim($part), $parts);
    $parts = array_filter($parts, static fn (string $part): bool => $part !== '');

    return array_values(array_unique($parts));
}

function optional_string(array $row, string $key): ?string
{
    $value = attr_value($row, $key);

    return $value === '' ? null : $value;
}

function write_typescript_reference(string $file, array $referenceRows): void
{
    $items = [];

    foreach ($referenceRows as $row) {
        $items[] = [
            'status' => $row['status'],
            'brand' => $row['Marque'],
            'model' => $row['Modèle'],
            'key' => $row['model_key'],
            'productCount' => (int) $row['produits_woo'],
            'soundProfile' => optional_string($row, 'Profil sonore'),
            'complexity' => optional_string($row, 'Complexité sonore'),
            'power' => optional_string($row, 'Puissance sonore'),
            'response' => optional_string($row, 'Réponse'),
            'musicianUsage' => split_multi_value(attr_value($row, 'Usage musicien')),
            'pricePositioning' => optional_string($row, 'Positionnement prix'),
            'durability' => optional_string($row, 'Durabilité'),
            'tuningStability' => optional_string($row, "Stabilité d'accord"),
            'breakInTime' => optional_string($row, 'Temps de rodage'),
        ];
    }

    $json = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        throw new RuntimeException('Cannot encode TypeScript model reference');
    }

    $content = <<<TS
export type StringModelAttributeReference = {
  status: "complete" | "partial" | "empty" | "missing";
  brand: string;
  model: string;
  key: string;
  productCount: number;
  soundProfile: string | null;
  complexity: string | null;
  power: string | null;
  response: string | null;
  musicianUsage: string[];
  pricePositioning: string | null;
  durability: string | null;
  tuningStability: string | null;
  breakInTime: string | null;
};

export const chantDuMerleStringModelAttributes = {$json} satisfies StringModelAttributeReference[];

TS;

    file_put_contents($file, $content);
}

function missing_attributes(array $row, array $attributeHeaders): array
{
    return array_values(array_filter(
        $attributeHeaders,
        static fn (string $header): bool => attr_value($row, $header) === ''
    ));
}

[$sourceHeaders, $sourceRows] = read_csv_assoc($sourceFile);

$attributeHeaders = [
    'Profil sonore',
    'Complexité sonore',
    'Puissance sonore',
    'Réponse',
    'Usage musicien',
    'Positionnement prix',
    'Durabilité',
    "Stabilité d'accord",
    'Temps de rodage',
];

$sourceByKey = [];
$sourceDuplicateIdentical = [];
$sourceDuplicateConflicts = [];
foreach ($sourceRows as $row) {
    $brand = attr_value($row, 'Marque');
    $model = attr_value($row, 'Modèle');
    if ($brand === '' || $model === '') {
        continue;
    }

    $key = model_key($brand, $model);
    if (isset($sourceByKey[$key])) {
        $isIdentical = true;
        foreach ($attributeHeaders as $header) {
            if (attr_value($sourceByKey[$key], $header) !== attr_value($row, $header)) {
                $isIdentical = false;
                break;
            }
        }

        $duplicate = [
            'marque' => $brand,
            'modele' => $model,
            'model_key' => $key,
        ];

        if ($isIdentical) {
            $sourceDuplicateIdentical[] = $duplicate;
        } else {
            $sourceDuplicateConflicts[] = $duplicate;
        }
        continue;
    }

    $sourceByKey[$key] = $row;
}

$wooRows = $pdo->query(
    "SELECT brand.name AS marque, model.name AS modele, COUNT(DISTINCT p.ID) AS products
     FROM wp_posts p
     JOIN wp_term_relationships trb ON trb.object_id = p.ID
     JOIN wp_term_taxonomy ttb ON ttb.term_taxonomy_id = trb.term_taxonomy_id AND ttb.taxonomy = 'pa_marque'
     JOIN wp_terms brand ON brand.term_id = ttb.term_id
     JOIN wp_term_relationships trm ON trm.object_id = p.ID
     JOIN wp_term_taxonomy ttm ON ttm.term_taxonomy_id = trm.term_taxonomy_id AND ttm.taxonomy = 'pa_modele'
     JOIN wp_terms model ON model.term_id = ttm.term_id
     WHERE p.post_type = 'product' AND p.post_status = 'publish'
       AND NOT EXISTS (
           SELECT 1
           FROM wp_term_relationships trt
           JOIN wp_term_taxonomy ttt ON ttt.term_taxonomy_id = trt.term_taxonomy_id AND ttt.taxonomy = 'pa_type_produit'
           JOIN wp_terms type_term ON type_term.term_id = ttt.term_id
           WHERE trt.object_id = p.ID AND type_term.slug = 'colophane'
       )
     GROUP BY brand.name, model.name
     ORDER BY brand.name, model.name"
)->fetchAll();

$wooKeys = [];
$referenceRows = [];
$missingRows = [];
$matched = 0;
$complete = 0;
$partial = 0;
$missing = 0;

foreach ($wooRows as $wooRow) {
    $brand = (string) $wooRow['marque'];
    $model = (string) $wooRow['modele'];
    $key = model_key($brand, $model);
    $wooKeys[$key] = true;
    $sourceRow = $sourceByKey[$key] ?? null;

    $output = [
        'status' => 'missing',
        'Marque' => $brand,
        'Modèle' => $model,
        'model_key' => $key,
        'produits_woo' => (string) $wooRow['products'],
        'source' => $sourceRow === null ? 'woo_only' : 'cordes_attributs.csv',
    ];

    foreach ($attributeHeaders as $header) {
        $output[$header] = $sourceRow === null ? '' : attr_value($sourceRow, $header);
    }

    if ($sourceRow !== null) {
        $matched++;
        $missingAttrs = missing_attributes($output, $attributeHeaders);
        if ($missingAttrs === []) {
            $output['status'] = 'complete';
            $complete++;
        } elseif (has_any_attribute($output, $attributeHeaders)) {
            $output['status'] = 'partial';
            $partial++;
        } else {
            $output['status'] = 'empty';
            $missing++;
        }
    } else {
        $missing++;
    }

    $referenceRows[] = $output;

    if ($output['status'] !== 'complete') {
        $missingRows[] = $output + [
            'attributs_a_completer' => implode(' | ', missing_attributes($output, $attributeHeaders)),
        ];
    }
}

$csvOnlyRows = [];
foreach ($sourceByKey as $key => $sourceRow) {
    if (isset($wooKeys[$key])) {
        continue;
    }

    $csvOnlyRows[] = [
        'status' => 'csv_only',
        'Marque' => attr_value($sourceRow, 'Marque'),
        'Modèle' => attr_value($sourceRow, 'Modèle'),
        'model_key' => $key,
        'produits_woo' => '0',
        'source' => 'cordes_attributs.csv',
    ] + array_intersect_key($sourceRow, array_flip($attributeHeaders));
}

$headers = array_merge(
    ['status', 'Marque', 'Modèle', 'model_key', 'produits_woo', 'source'],
    $attributeHeaders
);
$missingHeaders = array_merge($headers, ['attributs_a_completer']);

write_csv_assoc($referenceFile, $headers, $referenceRows);
write_csv_assoc($missingFile, $missingHeaders, $missingRows);
write_typescript_reference($typescriptFile, $referenceRows);

$report = [
    'source_file' => $sourceFile,
    'reference_file' => $referenceFile,
    'missing_file' => $missingFile,
    'typescript_file' => $typescriptFile,
    'woo_brand_models' => count($wooRows),
    'source_rows' => count($sourceRows),
    'source_unique_brand_models' => count($sourceByKey),
    'matched_brand_models' => $matched,
    'complete_brand_models' => $complete,
    'partial_brand_models' => $partial,
    'missing_or_empty_brand_models' => $missing,
    'csv_only_brand_models' => count($csvOnlyRows),
    'source_duplicate_identical' => $sourceDuplicateIdentical,
    'source_duplicate_conflicts' => $sourceDuplicateConflicts,
    'csv_only_rows' => $csvOnlyRows,
];

file_put_contents(
    $reportFile,
    json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL
);

echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
