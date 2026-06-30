<?php

declare(strict_types=1);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$root = dirname(__DIR__);
$outputDir = $root . '/next-frontend/mvc/exports';
$outputPath = $outputDir . '/woo-jeux-variantes-prix-a-rediger.csv';

if (!is_dir($outputDir)) {
    mkdir($outputDir, 0775, true);
}

$db = new mysqli('127.0.0.1', 'root', 'root', 'chantdumerle_wp', 3306);
$db->set_charset('utf8mb4');

$products = array_values(array_filter(
    loadProducts($db),
    static fn (array $product): bool => !str_starts_with(strtoupper($product['sku']), 'CDM-SET-')
        && in_array('jeu', termSlugs($product, 'pa_corde'), true)
));

$groups = [];
foreach ($products as $product) {
    $key = familyKey($product);
    if ($key === '') {
        continue;
    }

    $groups[$key][] = $product;
}

$headers = [
    'statut',
    'famille',
    'id',
    'sku',
    'titre_actuel',
    'prix',
    'stock',
    'instrument',
    'marque',
    'tension',
    'taille',
    'ame',
    'filage',
    'attache',
    'signature_technique',
    'titre_propose',
    'phrase_description_proposee',
    'raison',
];

$rows = [];
$stats = [
    'game_products' => count($products),
    'groups' => count($groups),
    'price_variant_groups' => 0,
    'rows' => 0,
];

foreach ($groups as $family => $items) {
    if (count($items) < 2 || count(uniquePrices($items)) < 2) {
        continue;
    }

    $stats['price_variant_groups']++;
    usort($items, static fn (array $a, array $b): int => moneyValue($a['price'] ?? '') <=> moneyValue($b['price'] ?? ''));

    $defaultSignature = technicalSignature($items[0]);
    foreach ($items as $index => $product) {
        $signature = technicalSignature($product);
        $isDefault = $index === 0;
        $hasActionableDifference = hasActionableDifference($signature);
        $hasDistinctiveTitle = titleContainsSignature((string) $product['post_title'], $signature);
        $needsTitle = !$isDefault && $hasActionableDifference && !$hasDistinctiveTitle;
        $needsDescription = !descriptionContainsSignature((string) $product['post_content'], $signature);
        $status = $needsTitle || $needsDescription ? 'a_rediger' : 'ok';
        if (!$isDefault && !$hasActionableDifference) {
            $status = 'prix_a_controler';
        }

        $rows[] = [
            'statut' => $status,
            'famille' => $family,
            'id' => (string) $product['ID'],
            'sku' => (string) $product['sku'],
            'titre_actuel' => (string) $product['post_title'],
            'prix' => (string) ($product['price'] ?? ''),
            'stock' => (string) ($product['stock'] ?? ''),
            'instrument' => termNamesText($product, 'pa_instrument'),
            'marque' => termNamesText($product, 'product_brand'),
            'tension' => termNamesText($product, 'pa_tension'),
            'taille' => termNamesText($product, 'pa_taille'),
            'ame' => termNamesText($product, 'pa_ame'),
            'filage' => termNamesText($product, 'pa_filage'),
            'attache' => termNamesText($product, 'pa_attache'),
            'signature_technique' => $signature,
            'titre_propose' => proposedTitle($product, $signature, $isDefault),
            'phrase_description_proposee' => proposedDescriptionSentence($product, $signature, $isDefault, $defaultSignature),
            'raison' => reason($isDefault, $needsTitle, $needsDescription, $hasActionableDifference),
        ];
    }
}

$stats['rows'] = count($rows);
writeCsv($outputPath, $headers, $rows);

echo json_encode([
    'output' => $outputPath,
    'stats' => $stats,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;

function loadProducts(mysqli $db): array
{
    $sql = "SELECT p.ID, p.post_title, p.post_content, p.post_excerpt, p.post_status,
                   sku.meta_value sku, price.meta_value price, stock.meta_value stock
            FROM wp_posts p
            JOIN wp_postmeta sku ON sku.post_id = p.ID AND sku.meta_key = '_sku'
            LEFT JOIN wp_postmeta price ON price.post_id = p.ID AND price.meta_key = '_price'
            LEFT JOIN wp_postmeta stock ON stock.post_id = p.ID AND stock.meta_key = '_stock'
            WHERE p.post_type = 'product'
              AND p.post_status NOT IN ('trash', 'auto-draft')";

    $result = $db->query($sql);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $id = (int) $row['ID'];
        $row['ID'] = $id;
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
        $products[$id]['terms'][$taxonomy][] = [
            'slug' => (string) $term['slug'],
            'name' => (string) $term['name'],
        ];
    }

    return array_values($products);
}

function familyKey(array $product): string
{
    $instrument = firstTermSlug($product, 'pa_instrument');
    $brand = firstTermSlug($product, 'product_brand') ?: firstTermSlug($product, 'pa_marque');
    $title = normalizeText((string) $product['post_title']);

    $remove = array_filter(array_merge(
        [$brand, $instrument],
        termSlugs($product, 'pa_tension'),
        termSlugs($product, 'pa_taille'),
        termSlugs($product, 'pa_attache'),
        termSlugs($product, 'pa_filage'),
        termSlugs($product, 'pa_ame'),
        ['medium', 'light', 'heavy', 'boule', 'boucle', 'loop', 'ball', '4 4', '3 4', '1 2']
    ));

    foreach ($remove as $token) {
        $token = normalizeText(str_replace('-', ' ', $token));
        if ($token === '') {
            continue;
        }
        $title = preg_replace('/\b' . preg_quote($token, '/') . '\b/', ' ', $title) ?? $title;
    }

    $title = trim(preg_replace('/\s+/', ' ', $title) ?? $title);

    return trim($instrument . '|' . $brand . '|' . $title, '|');
}

function technicalSignature(array $product): string
{
    $parts = [];

    foreach ([
        'pa_ame' => 'âme',
        'pa_filage' => 'filage',
        'pa_attache' => 'attache',
        'pa_tension' => 'tension',
        'pa_taille' => 'taille',
    ] as $taxonomy => $label) {
        $value = termNamesText($product, $taxonomy);
        if ($value !== '') {
            $parts[] = $label . ' ' . $value;
        }
    }

    return implode(', ', $parts);
}

function titleContainsSignature(string $title, string $signature): bool
{
    if ($signature === '') {
        return true;
    }

    $normalizedTitle = normalizeText($title);
    foreach (signatureKeywords($signature) as $keyword) {
        if (!str_contains($normalizedTitle, $keyword)) {
            return false;
        }
    }

    return true;
}

function descriptionContainsSignature(string $description, string $signature): bool
{
    if ($signature === '') {
        return true;
    }

    $normalizedDescription = normalizeText(strip_tags($description));
    foreach (signatureKeywords($signature) as $keyword) {
        if (str_contains($normalizedDescription, $keyword)) {
            return true;
        }
    }

    return false;
}

function signatureKeywords(string $signature): array
{
    $keywords = [];
    foreach (explode(',', $signature) as $part) {
        $part = normalizeText(preg_replace('/^(ame|filage|attache|tension|taille)\s+/u', '', trim($part)) ?? $part);
        if ($part !== '' && !in_array($part, ['medium', '4 4'], true)) {
            $keywords[] = $part;
        }
    }

    return $keywords;
}

function hasActionableDifference(string $signature): bool
{
    foreach (signatureKeywords($signature) as $keyword) {
        if (!in_array($keyword, ['medium', 'moyenne', '4 4', '3 4'], true)) {
            return true;
        }
    }

    return false;
}

function proposedTitle(array $product, string $signature, bool $isDefault): string
{
    $title = trim((string) $product['post_title']);
    if ($isDefault || $signature === '') {
        return $title;
    }

    $suffixParts = [];
    foreach (['pa_filage', 'pa_ame', 'pa_attache', 'pa_tension'] as $taxonomy) {
        foreach ($product['terms'][$taxonomy] ?? [] as $term) {
            $value = (string) $term['name'];
            $slug = (string) $term['slug'];
            if ($value === '' || titleContainsTerm($title, $term) || isDefaultTitleTerm($taxonomy, $slug, $value)) {
                continue;
            }

            $suffixParts[] = $value;
        }
    }

    if ($suffixParts === []) {
        return $title;
    }

    return $title . ' - ' . implode(' / ', array_unique($suffixParts));
}

function proposedDescriptionSentence(array $product, string $signature, bool $isDefault, string $defaultSignature): string
{
    $title = (string) $product['post_title'];
    if ($signature === '') {
        return '';
    }

    if (!$isDefault && !hasActionableDifference($signature)) {
        return "Aucune différence technique suffisante n’est lisible dans les attributs actuels pour expliquer cet écart de prix.";
    }

    if ($isDefault) {
        return "Version par défaut du jeu {$title}. Composition technique : {$signature}.";
    }

    $comparison = $defaultSignature !== '' && $defaultSignature !== $signature
        ? " Elle se distingue de la version par défaut par : {$signature}."
        : '';

    return "Cette variante du jeu {$title} présente la configuration suivante : {$signature}.{$comparison}";
}

function reason(bool $isDefault, bool $needsTitle, bool $needsDescription, bool $hasActionableDifference): string
{
    if (!$isDefault && !$hasActionableDifference) {
        return 'Prix différent sans attribut distinctif exploitable : contrôler le tarif, les variantes ou les attributs manquants.';
    }

    if (!$needsTitle && !$needsDescription) {
        return 'Titre et description déjà suffisamment distinctifs selon les attributs disponibles.';
    }

    if ($isDefault) {
        return 'Prix/famille avec variantes : garder le titre sobre, mais expliciter la composition dans la description.';
    }

    return 'Variante de prix : rendre la différence visible dans le titre si absente, et l’expliquer dans la description.';
}

function uniquePrices(array $products): array
{
    return array_values(array_unique(array_map(
        static fn (array $product): string => number_format(moneyValue($product['price'] ?? ''), 2, '.', ''),
        $products
    )));
}

function termSlugs(array $product, string $taxonomy): array
{
    return array_values(array_map(static fn (array $term): string => $term['slug'], $product['terms'][$taxonomy] ?? []));
}

function termNamesText(array $product, string $taxonomy): string
{
    return implode(' / ', array_values(array_unique(array_map(
        static fn (array $term): string => $term['name'],
        $product['terms'][$taxonomy] ?? []
    ))));
}

function firstTermSlug(array $product, string $taxonomy): string
{
    return (string) (($product['terms'][$taxonomy][0]['slug'] ?? '') ?: '');
}

function titleContainsTerm(string $title, array $term): bool
{
    $normalizedTitle = normalizeText($title);
    foreach ([(string) ($term['name'] ?? ''), (string) ($term['slug'] ?? '')] as $value) {
        $normalizedValue = normalizeText(str_replace('-', ' ', $value));
        if ($normalizedValue !== '' && str_contains($normalizedTitle, $normalizedValue)) {
            return true;
        }
    }

    return false;
}

function isDefaultTitleTerm(string $taxonomy, string $slug, string $name): bool
{
    $value = normalizeText($slug . ' ' . $name);

    if ($taxonomy === 'pa_tension' && preg_match('/\b(medium|moyenne)\b/', $value)) {
        return true;
    }

    if ($taxonomy === 'pa_ame' && preg_match('/\b(acier|steel)\b/', $value)) {
        return true;
    }

    if ($taxonomy === 'pa_taille' && preg_match('/\b4 4\b/', $value)) {
        return true;
    }

    return false;
}

function normalizeText(string $value): string
{
    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $value = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $value) ?: strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', ' ', $value) ?? '';
    return trim(preg_replace('/\s+/', ' ', $value) ?? $value);
}

function moneyValue(mixed $value): float
{
    $value = trim((string) $value);
    return $value === '' ? 0.0 : (float) str_replace(',', '.', $value);
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
