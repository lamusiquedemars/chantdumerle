<?php

declare(strict_types=1);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$root = dirname(__DIR__);
$outputDir = $root . '/next-frontend/mvc/exports';
$outputPath = $outputDir . '/woo-jeux-reconstitues-doublons.csv';

if (!is_dir($outputDir)) {
    mkdir($outputDir, 0775, true);
}

$db = new mysqli('127.0.0.1', 'root', 'root', 'chantdumerle_wp', 3306);
$db->set_charset('utf8mb4');

$products = loadProducts($db);
$productsBySku = [];
foreach ($products as $product) {
    $productsBySku[strtoupper($product['sku'])] = $product;
}

$gameProducts = array_values(array_filter(
    $products,
    static fn (array $product): bool => !str_starts_with(strtoupper($product['sku']), 'CDM-SET-')
        && in_array('jeu', $product['terms']['pa_corde'] ?? [], true)
));

$headers = [
    'statut',
    'raison',
    'set_id',
    'set_sku',
    'set_titre',
    'set_prix',
    'set_stock',
    'instrument',
    'modele_reconstitue',
    'cordes',
    'candidat_id',
    'candidat_sku',
    'candidat_titre',
    'candidat_prix',
    'candidat_stock',
    'ecart_prix',
    'action_recommandee',
];

$rows = [];
$stats = [
    'sets' => 0,
    'same_model' => 0,
    'duplicates' => 0,
    'mixed_models' => 0,
    'no_candidate' => 0,
];

foreach ($products as $set) {
    $sku = strtoupper($set['sku']);
    if (!str_starts_with($sku, 'CDM-SET-')) {
        continue;
    }

    $stats['sets']++;
    $composition = readComposition($set, $productsBySku);
    $strings = $composition['strings'];
    $models = uniqueNonEmpty(array_map(static fn (array $string): string => normalizeModel($string['model'] ?? ''), $strings));

    if (count($models) !== 1) {
        $stats['mixed_models']++;
        continue;
    }

    $stats['same_model']++;
    $model = $models[0];
    $instrument = normalizeSlug($composition['instrument'] ?: firstTerm($set, 'pa_instrument'));
    $candidates = findCandidates($set, $model, $instrument, $gameProducts);

    if ($candidates === []) {
        $stats['no_candidate']++;
        $rows[] = auditRow(
            'a_controler',
            'Jeu reconstitué depuis des cordes seules du même modèle, sans jeu non-SET trouvé automatiquement.',
            $set,
            $instrument,
            $model,
            $strings,
            null
        );
        continue;
    }

    foreach ($candidates as $candidate) {
        $isExact = candidateLooksExact($candidate, $model);
        if ($isExact) {
            $stats['duplicates']++;
        }

        $rows[] = auditRow(
            $isExact ? 'doublon_probable' : 'variante_possible',
            $isExact
                ? 'Jeu reconstitué depuis des cordes seules du même modèle avec jeu Woo non-SET correspondant.'
                : 'Jeu reconstitué depuis des cordes seules du même modèle, rapproché d’une variante non-SET à préciser.',
            $set,
            $instrument,
            $model,
            $strings,
            $candidate
        );
    }
}

writeCsv($outputPath, $headers, $rows);

echo json_encode([
    'output' => $outputPath,
    'rows' => count($rows),
    'stats' => $stats,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;

function loadProducts(mysqli $db): array
{
    $sql = "SELECT p.ID, p.post_title, p.post_content, p.post_excerpt, p.post_status,
                   sku.meta_value sku, price.meta_value price, stock.meta_value stock,
                   stock_status.meta_value stock_status, composition.meta_value set_composition,
                   components.meta_value component_skus
            FROM wp_posts p
            JOIN wp_postmeta sku ON sku.post_id = p.ID AND sku.meta_key = '_sku'
            LEFT JOIN wp_postmeta price ON price.post_id = p.ID AND price.meta_key = '_price'
            LEFT JOIN wp_postmeta stock ON stock.post_id = p.ID AND stock.meta_key = '_stock'
            LEFT JOIN wp_postmeta stock_status ON stock_status.post_id = p.ID AND stock_status.meta_key = '_stock_status'
            LEFT JOIN wp_postmeta composition ON composition.post_id = p.ID AND composition.meta_key = '_set_composition'
            LEFT JOIN wp_postmeta components ON components.post_id = p.ID AND components.meta_key = 'cdm_component_skus'
            WHERE p.post_type = 'product'
              AND p.post_status NOT IN ('trash', 'auto-draft')";

    $result = $db->query($sql);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $id = (int) $row['ID'];
        $row['ID'] = $id;
        $row['sku'] = (string) $row['sku'];
        $row['terms'] = [];
        $products[$id] = $row;
    }

    $termSql = "SELECT tr.object_id, tx.taxonomy, t.slug, t.name
                FROM wp_term_relationships tr
                JOIN wp_term_taxonomy tx ON tx.term_taxonomy_id = tr.term_taxonomy_id
                JOIN wp_terms t ON t.term_id = tx.term_id
                WHERE tr.object_id IN (" . implode(',', array_map('intval', array_keys($products))) . ")";
    $termResult = $db->query($termSql);
    while ($term = $termResult->fetch_assoc()) {
        $id = (int) $term['object_id'];
        $taxonomy = (string) $term['taxonomy'];
        $products[$id]['terms'][$taxonomy][] = (string) $term['slug'];
    }

    return array_values($products);
}

function readComposition(array $set, array $productsBySku): array
{
    $composition = json_decode((string) ($set['set_composition'] ?? ''), true);
    if (is_array($composition) && isset($composition['strings']) && is_array($composition['strings'])) {
        return [
            'instrument' => (string) ($composition['instrument'] ?? ''),
            'strings' => array_values($composition['strings']),
        ];
    }

    $strings = [];
    if (preg_match_all('/(Mi|La|Ré|Re|Sol|Do):\s*(CDM-[A-Z0-9]+)/u', (string) ($set['component_skus'] ?? ''), $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $sku = strtoupper($match[2]);
            $product = $productsBySku[$sku] ?? [];
            $strings[] = [
                'sku' => $sku,
                'name' => (string) ($product['post_title'] ?? ''),
                'model' => modelFromProduct($product),
                'string' => $match[1],
            ];
        }
    }

    return [
        'instrument' => firstTerm($set, 'pa_instrument'),
        'strings' => $strings,
    ];
}

function modelFromProduct(array $product): string
{
    $model = firstTerm($product, 'pa_modele');
    if ($model !== '') {
        return str_replace('-', ' ', $model);
    }

    return (string) ($product['post_title'] ?? '');
}

function findCandidates(array $set, string $model, string $instrument, array $gameProducts): array
{
    $setSku = strtoupper($set['sku']);
    $modelNeedle = modelNeedle($model);
    $candidates = [];

    foreach ($gameProducts as $candidate) {
        if (strtoupper($candidate['sku']) === $setSku) {
            continue;
        }

        $candidateInstrument = normalizeSlug(firstTerm($candidate, 'pa_instrument'));
        if ($instrument !== '' && $candidateInstrument !== '' && $candidateInstrument !== $instrument) {
            continue;
        }

        $title = normalizeText((string) $candidate['post_title']);
        $candidateModel = normalizeModel(firstTerm($candidate, 'pa_modele'));
        if (
            ($candidateModel !== '' && ($candidateModel === $model || str_contains($candidateModel, $modelNeedle)))
            || ($modelNeedle !== '' && str_contains($title, $modelNeedle))
        ) {
            $candidates[] = $candidate;
        }
    }

    usort($candidates, static function (array $a, array $b) use ($modelNeedle): int {
        $aTitle = normalizeText((string) $a['post_title']);
        $bTitle = normalizeText((string) $b['post_title']);
        $aExact = $aTitle === $modelNeedle ? 0 : 1;
        $bExact = $bTitle === $modelNeedle ? 0 : 1;
        return $aExact <=> $bExact ?: strcmp((string) $a['sku'], (string) $b['sku']);
    });

    return array_slice($candidates, 0, 5);
}

function auditRow(
    string $status,
    string $reason,
    array $set,
    string $instrument,
    string $model,
    array $strings,
    ?array $candidate
): array {
    $setPrice = moneyValue($set['price'] ?? '');
    $candidatePrice = $candidate ? moneyValue($candidate['price'] ?? '') : null;

    return [
        'statut' => $status,
        'raison' => $reason,
        'set_id' => (string) $set['ID'],
        'set_sku' => (string) $set['sku'],
        'set_titre' => (string) $set['post_title'],
        'set_prix' => (string) ($set['price'] ?? ''),
        'set_stock' => (string) ($set['stock'] ?? ''),
        'instrument' => $instrument,
        'modele_reconstitue' => $model,
        'cordes' => stringsSummary($strings),
        'candidat_id' => $candidate ? (string) $candidate['ID'] : '',
        'candidat_sku' => $candidate ? (string) $candidate['sku'] : '',
        'candidat_titre' => $candidate ? (string) $candidate['post_title'] : '',
        'candidat_prix' => $candidate ? (string) ($candidate['price'] ?? '') : '',
        'candidat_stock' => $candidate ? (string) ($candidate['stock'] ?? '') : '',
        'ecart_prix' => $candidatePrice === null || $setPrice === null ? '' : number_format($setPrice - $candidatePrice, 2, '.', ''),
        'action_recommandee' => $candidate
            ? ($status === 'doublon_probable'
                ? 'Masquer/dépublier le CDM-SET reconstitué et reporter ses attributs éditoriaux sur le candidat.'
                : 'Comparer les matériaux/tension/attache avant action ; préciser le titre et la description si variante réelle.')
            : 'Vérifier manuellement si un jeu fabricant existe avec un titre atypique ou une variante à préciser.',
    ];
}

function candidateLooksExact(array $candidate, string $model): bool
{
    $modelText = normalizeText($model);
    $title = normalizeText((string) $candidate['post_title']);
    $variantTokens = [
        'gold',
        'or',
        'silver',
        'argent',
        'argente',
        'soloist',
        'pro',
        'superior',
        'platine',
        'platinum',
        'diamant',
        'diamond',
    ];

    foreach ($variantTokens as $token) {
        if (!str_contains($modelText, $token) && preg_match('/\b' . preg_quote($token, '/') . '\b/', $title)) {
            return false;
        }
    }

    return true;
}

function stringsSummary(array $strings): string
{
    $parts = [];
    foreach ($strings as $string) {
        $parts[] = trim((string) ($string['string'] ?? '') . ':' . (string) ($string['sku'] ?? '') . ' ' . (string) ($string['name'] ?? ''));
    }

    return implode(' | ', array_filter($parts));
}

function firstTerm(array $product, string $taxonomy): string
{
    return (string) (($product['terms'][$taxonomy][0] ?? '') ?: '');
}

function uniqueNonEmpty(array $values): array
{
    return array_values(array_unique(array_filter($values, static fn (string $value): bool => $value !== '')));
}

function modelNeedle(string $model): string
{
    $text = normalizeText($model);
    $text = preg_replace('/\b(pirastro|thomastik|larsen|jargar|daddario|addario|optima|dogal|warchal|corelli|savarez)\b/', '', $text) ?? $text;
    return trim(preg_replace('/\s+/', ' ', $text) ?? $text);
}

function normalizeModel(string $value): string
{
    return modelNeedle($value);
}

function normalizeSlug(string $value): string
{
    return str_replace('-', '', normalizeText($value));
}

function normalizeText(string $value): string
{
    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $value = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $value) ?: strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', ' ', $value) ?? '';
    return trim(preg_replace('/\s+/', ' ', $value) ?? $value);
}

function moneyValue(mixed $value): ?float
{
    $value = trim((string) $value);
    return $value === '' ? null : (float) str_replace(',', '.', $value);
}

function writeCsv(string $path, array $headers, array $rows): void
{
    $handle = fopen($path, 'wb');
    if ($handle === false) {
        throw new RuntimeException("Impossible d'écrire {$path}");
    }

    fwrite($handle, "\xEF\xBB\xBF");
    fputcsv($handle, $headers, ',', '"', '\\');
    foreach ($rows as $row) {
        fputcsv($handle, array_map(static fn (string $header): string => $row[$header] ?? '', $headers), ',', '"', '\\');
    }

    fclose($handle);
}
