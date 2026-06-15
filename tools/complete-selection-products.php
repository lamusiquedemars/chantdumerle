<?php

declare(strict_types=1);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$root = dirname(__DIR__);
$csvPath = $root . '/woo-backend/wp-content/uploads/wc-imports/propositions_selections_jeux_composes.csv';

if (!is_file($csvPath)) {
    fwrite(STDERR, "CSV introuvable: {$csvPath}\n");
    exit(1);
}

$db = new mysqli('127.0.0.1', 'root', 'root', 'chantdumerle_wp', 3306);
$db->set_charset('utf8mb4');

$stats = [
    'rows' => 0,
    'existingLinked' => 0,
    'created' => 0,
    'updated' => 0,
    'thumbnailsSet' => 0,
    'missingImages' => 0,
    'missingComponents' => 0,
];

$rows = readCsv($csvPath);
$headers = $rows['headers'];
$records = $rows['records'];

foreach (['slug_jeu_complet', 'image_jeu_complet'] as $column) {
    if (!in_array($column, $headers, true)) {
        $headers[] = $column;
        foreach ($records as &$record) {
            $record[$column] = '';
        }
        unset($record);
    }
}

$termMap = loadTermMap($db);
$products = loadProductsBySku($db);

foreach ($records as &$record) {
    $stats['rows']++;

    $oldCode = trim((string) ($record['code'] ?? ''));
    $directSku = trim((string) ($record['sku_jeu_complet'] ?? ''));
    $targetSku = $directSku !== ''
        ? $directSku
        : (str_starts_with($oldCode, 'CDM-') ? $oldCode : 'CDM-SET-' . $oldCode);

    $componentSkus = componentSkus($record);
    $componentProducts = [];
    foreach ($componentSkus as $sku) {
        if (isset($products[strtoupper($sku)])) {
            $componentProducts[] = $products[strtoupper($sku)];
        } else {
            $stats['missingComponents']++;
        }
    }

    $firstImageProduct = firstProductWithImage($componentProducts);
    $modelProduct = findModelProduct($products, $record, $targetSku);
    $sourceImageProduct = (!empty($modelProduct['thumb_id']) && !productImageLooksWrong($modelProduct))
        ? $modelProduct
        : $firstImageProduct;

    $product = $products[strtoupper($targetSku)] ?? null;
    $created = false;

    if (!$product) {
        $product = createSelectionProduct($db, $record, $targetSku, $componentProducts, $sourceImageProduct, $termMap);
        $products[strtoupper($targetSku)] = $product;
        $created = true;
        $stats['created']++;
    } else {
        $stats['existingLinked']++;
    }

    $updatedThumbnail = ensureThumbnail(
        $db,
        (int) $product['ID'],
        $product['thumb_id'] ?? null,
        $sourceImageProduct['thumb_id'] ?? null,
        $product['image_url'] ?? ''
    );
    if ($updatedThumbnail) {
        $product['thumb_id'] = $sourceImageProduct['thumb_id'];
        $product['image_url'] = $sourceImageProduct['image_url'] ?? '';
        $products[strtoupper($targetSku)] = $product;
        $stats['thumbnailsSet']++;
    }

    updateSelectionProduct($db, (int) $product['ID'], $record, $targetSku, $componentProducts, $termMap);

    $product = reloadProductBySku($db, $targetSku);
    $products[strtoupper($targetSku)] = $product;

    $record['code'] = $targetSku;
    $record['sku_jeu_complet'] = $targetSku;
    $record['stock_jeu_complet'] = stockForSelection($record, $componentProducts);
    $record['prix_jeu_complet'] = priceForSelection($record, $componentProducts);
    $record['slug_jeu_complet'] = (string) $product['post_name'];
    $record['image_jeu_complet'] = (string) ($product['image_url'] ?? '');

    if ($record['image_jeu_complet'] === '') {
        $stats['missingImages']++;
    }

    if (!$created) {
        $stats['updated']++;
    }
}
unset($record);

writeCsv($csvPath, $headers, $records);
refreshTermCounts($db);

echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;

function readCsv(string $path): array
{
    $handle = fopen($path, 'rb');
    if (!$handle) {
        throw new RuntimeException("Impossible de lire {$path}");
    }

    $headers = fgetcsv($handle, 0, ',', '"', '\\');
    if (!$headers) {
        throw new RuntimeException('CSV vide');
    }
    $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', (string) $headers[0]);

    $records = [];
    while (($row = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
        if ($row === [null] || count(array_filter($row, static fn ($value) => trim((string) $value) !== '')) === 0) {
            continue;
        }

        $record = [];
        foreach ($headers as $index => $header) {
            $record[(string) $header] = (string) ($row[$index] ?? '');
        }
        $records[] = $record;
    }

    fclose($handle);

    return ['headers' => $headers, 'records' => $records];
}

function writeCsv(string $path, array $headers, array $records): void
{
    $handle = fopen($path, 'wb');
    if (!$handle) {
        throw new RuntimeException("Impossible d'écrire {$path}");
    }

    fwrite($handle, "\xEF\xBB\xBF");
    fputcsv($handle, $headers, ',', '"', '\\');
    foreach ($records as $record) {
        $row = [];
        foreach ($headers as $header) {
            $row[] = $record[$header] ?? '';
        }
        fputcsv($handle, $row, ',', '"', '\\');
    }

    fclose($handle);
}

function loadProductsBySku(mysqli $db): array
{
    $sql = "SELECT sku.meta_value sku, p.ID, p.post_name, p.post_title,
                   price.meta_value price, stock.meta_value stock,
                   thumb.meta_value thumb_id, attachment.guid image_url
            FROM wp_posts p
            JOIN wp_postmeta sku ON sku.post_id = p.ID AND sku.meta_key = '_sku'
            LEFT JOIN wp_postmeta price ON price.post_id = p.ID AND price.meta_key = '_price'
            LEFT JOIN wp_postmeta stock ON stock.post_id = p.ID AND stock.meta_key = '_stock'
            LEFT JOIN wp_postmeta thumb ON thumb.post_id = p.ID AND thumb.meta_key = '_thumbnail_id'
            LEFT JOIN wp_posts attachment ON attachment.ID = thumb.meta_value
            WHERE p.post_type = 'product' AND p.post_status NOT IN ('trash', 'auto-draft')";

    $result = $db->query($sql);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[strtoupper((string) $row['sku'])] = $row;
    }

    return $products;
}

function reloadProductBySku(mysqli $db, string $sku): array
{
    $stmt = $db->prepare("SELECT sku.meta_value sku, p.ID, p.post_name, p.post_title,
                                 price.meta_value price, stock.meta_value stock,
                                 thumb.meta_value thumb_id, attachment.guid image_url
                          FROM wp_posts p
                          JOIN wp_postmeta sku ON sku.post_id = p.ID AND sku.meta_key = '_sku'
                          LEFT JOIN wp_postmeta price ON price.post_id = p.ID AND price.meta_key = '_price'
                          LEFT JOIN wp_postmeta stock ON stock.post_id = p.ID AND stock.meta_key = '_stock'
                          LEFT JOIN wp_postmeta thumb ON thumb.post_id = p.ID AND thumb.meta_key = '_thumbnail_id'
                          LEFT JOIN wp_posts attachment ON attachment.ID = thumb.meta_value
                          WHERE p.post_type = 'product' AND sku.meta_value = ?
                          LIMIT 1");
    $stmt->bind_param('s', $sku);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    if (!$row) {
        throw new RuntimeException("Produit introuvable après écriture: {$sku}");
    }

    return $row;
}

function loadTermMap(mysqli $db): array
{
    $result = $db->query("SELECT tx.taxonomy, t.slug, tx.term_taxonomy_id
                          FROM wp_terms t
                          JOIN wp_term_taxonomy tx ON tx.term_id = t.term_id
                          WHERE tx.taxonomy IN ('product_type','product_cat','pa_instrument','pa_corde','pa_taille','pa_profil_sonore','pa_usage')");
    $terms = [];
    while ($row = $result->fetch_assoc()) {
        $terms[$row['taxonomy']][$row['slug']] = (int) $row['term_taxonomy_id'];
    }

    return $terms;
}

function componentSkus(array $record): array
{
    $skus = [];
    foreach (['Mi', 'La', 'Ré', 'Sol', 'Do'] as $prefix) {
        $sku = trim((string) ($record[$prefix . '_sku'] ?? ''));
        if ($sku !== '') {
            $skus[] = $sku;
        }
    }

    return $skus;
}

function firstProductWithImage(array $products): array
{
    foreach ($products as $product) {
        if (!empty($product['thumb_id']) && !empty($product['image_url']) && !productImageLooksWrong($product)) {
            return $product;
        }
    }

    return [];
}

function findModelProduct(array $products, array $record, string $targetSku): array
{
    if (
        isset($products[strtoupper($targetSku)])
        && !empty($products[strtoupper($targetSku)]['thumb_id'])
        && !productImageLooksWrong($products[strtoupper($targetSku)])
    ) {
        return $products[strtoupper($targetSku)];
    }

    $model = normalize((string) ($record['modele_jeu_complet'] ?? ''));
    $instrument = normalize((string) ($record['instrument'] ?? ''));

    if ($model === '' || $instrument === '') {
        return [];
    }

    foreach ($products as $sku => $product) {
        if (str_starts_with($sku, 'CDM-SET-')) {
            continue;
        }

        $title = normalize((string) $product['post_title']);
        if (
            $title !== ''
            && str_contains($title, $model)
            && str_contains($title, $instrument)
            && !empty($product['thumb_id'])
            && !productImageLooksWrong($product)
        ) {
            return $product;
        }
    }

    return [];
}

function productImageLooksWrong(array $product): bool
{
    return imageUrlLooksWrong((string) ($product['image_url'] ?? ''))
        || titleLooksLikeAccessory((string) ($product['post_title'] ?? ''));
}

function imageUrlLooksWrong(string $imageUrl): bool
{
    return (bool) preg_match('/resina|rosin|colophane|epauliere|etui|sourdine|support/i', $imageUrl);
}

function titleLooksLikeAccessory(string $title): bool
{
    return (bool) preg_match('/colophane|rosin|résine|resina|épaulière|epauliere|étui|etui|sourdine|support/i', $title);
}

function createSelectionProduct(mysqli $db, array $record, string $sku, array $components, array $imageProduct, array $termMap): array
{
    $title = trim((string) ($record['titre'] ?? $sku));
    $slug = uniqueSlug($db, slugify($title));
    $now = date('Y-m-d H:i:s');
    $nowGmt = gmdate('Y-m-d H:i:s');
    $content = productDescription($record, $components);
    $excerpt = trim((string) ($record['objectif'] ?? ''));

    $stmt = $db->prepare("INSERT INTO wp_posts
        (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)
        VALUES (1, ?, ?, ?, ?, ?, 'publish', 'open', 'closed', '', ?, '', '', ?, ?, '', 0, '', 0, 'product', '', 0)");
    $stmt->bind_param('ssssssss', $now, $nowGmt, $content, $title, $excerpt, $slug, $now, $nowGmt);
    $stmt->execute();
    $postId = (int) $db->insert_id;

    $guid = 'http://chantdumerle-wp.local/?post_type=product&#038;p=' . $postId;
    $stmt = $db->prepare("UPDATE wp_posts SET guid = ? WHERE ID = ?");
    $stmt->bind_param('si', $guid, $postId);
    $stmt->execute();

    upsertMeta($db, $postId, '_sku', $sku);
    updateSelectionProduct($db, $postId, $record, $sku, $components, $termMap);
    ensureThumbnail($db, $postId, null, $imageProduct['thumb_id'] ?? null);

    return reloadProductBySku($db, $sku);
}

function updateSelectionProduct(mysqli $db, int $postId, array $record, string $sku, array $components, array $termMap): void
{
    $price = priceForSelection($record, $components);
    $stock = stockForSelection($record, $components);
    $stockStatus = ((float) str_replace(',', '.', $stock)) > 0 ? 'instock' : 'outofstock';

    upsertMeta($db, $postId, '_sku', $sku);
    upsertMeta($db, $postId, '_regular_price', $price);
    upsertMeta($db, $postId, '_price', $price);
    upsertMeta($db, $postId, '_manage_stock', 'yes');
    upsertMeta($db, $postId, '_stock', $stock);
    upsertMeta($db, $postId, '_stock_status', $stockStatus);
    upsertMeta($db, $postId, '_virtual', 'no');
    upsertMeta($db, $postId, '_downloadable', 'no');
    upsertMeta($db, $postId, '_sold_individually', 'no');
    upsertMeta($db, $postId, '_tax_status', 'taxable');
    upsertMeta($db, $postId, '_product_version', '10.8.1');
    upsertMeta($db, $postId, 'total_sales', '0');
    upsertMeta($db, $postId, 'cdm_editorial_code', preg_replace('/^CDM-SET-/', '', $sku));
    upsertMeta($db, $postId, 'cdm_component_skus', componentSummary($record));
    upsertMeta($db, $postId, '_set_composition', json_encode(compositionData($record, $components), JSON_UNESCAPED_UNICODE));
    upsertMeta($db, $postId, '_product_attributes', serialize(productAttributes($record)));

    assignTerms($db, $postId, termsForRecord($record, $termMap));
}

function upsertMeta(mysqli $db, int $postId, string $key, string $value): void
{
    $stmt = $db->prepare("SELECT meta_id FROM wp_postmeta WHERE post_id = ? AND meta_key = ? LIMIT 1");
    $stmt->bind_param('is', $postId, $key);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();

    if ($existing) {
        $stmt = $db->prepare("UPDATE wp_postmeta SET meta_value = ? WHERE meta_id = ?");
        $metaId = (int) $existing['meta_id'];
        $stmt->bind_param('si', $value, $metaId);
        $stmt->execute();
        return;
    }

    $stmt = $db->prepare("INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (?, ?, ?)");
    $stmt->bind_param('iss', $postId, $key, $value);
    $stmt->execute();
}

function ensureThumbnail(
    mysqli $db,
    int $postId,
    mixed $currentThumbId,
    mixed $sourceThumbId,
    string $currentImageUrl = ''
): bool
{
    $thumbId = trim((string) $sourceThumbId);
    $hasUsableThumbnail = trim((string) $currentThumbId) !== '' && !imageUrlLooksWrong($currentImageUrl);

    if ($thumbId === '' || $hasUsableThumbnail) {
        return false;
    }

    upsertMeta($db, $postId, '_thumbnail_id', $thumbId);
    return true;
}

function assignTerms(mysqli $db, int $postId, array $termTaxonomyIds): void
{
    foreach (array_unique(array_filter($termTaxonomyIds)) as $termTaxonomyId) {
        $stmt = $db->prepare("INSERT IGNORE INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) VALUES (?, ?, 0)");
        $stmt->bind_param('ii', $postId, $termTaxonomyId);
        $stmt->execute();
    }
}

function termsForRecord(array $record, array $termMap): array
{
    $instrument = slugify((string) ($record['instrument'] ?? ''));
    $sound = slugify((string) ($record['profil_sonore_cible'] ?? ''));
    $usageValues = array_filter(array_map('slugify', explode('/', (string) ($record['usage_cible'] ?? ''))));

    $terms = [
        $termMap['product_type']['simple'] ?? null,
        $termMap['product_cat'][$instrument] ?? null,
        $termMap['pa_instrument'][$instrument] ?? null,
        $termMap['pa_corde']['jeu'] ?? null,
        $termMap['pa_taille']['4-4'] ?? null,
        $termMap['pa_profil_sonore'][$sound] ?? null,
    ];

    foreach ($usageValues as $usage) {
        $terms[] = $termMap['pa_usage'][$usage] ?? null;
    }

    return $terms;
}

function productAttributes(array $record): array
{
    return [
        'pa_instrument' => taxonomyAttribute('pa_instrument', 0),
        'pa_corde' => taxonomyAttribute('pa_corde', 1),
        'pa_taille' => taxonomyAttribute('pa_taille', 2),
        'pa_usage' => taxonomyAttribute('pa_usage', 3),
        'pa_profil_sonore' => taxonomyAttribute('pa_profil_sonore', 4),
        'modele' => textAttribute('Modèle', trim((string) ($record['modele_jeu_complet'] ?? componentModels($record))), 5),
        'type-produit' => textAttribute('Type produit', selectionTypeLabel($record), 6),
        'type-pack' => textAttribute('Type pack', selectionTypeLabel($record), 7),
    ];
}

function taxonomyAttribute(string $name, int $position): array
{
    return [
        'name' => $name,
        'value' => '',
        'position' => $position,
        'is_visible' => 1,
        'is_variation' => 0,
        'is_taxonomy' => 1,
    ];
}

function textAttribute(string $name, string $value, int $position): array
{
    return [
        'name' => $name,
        'value' => $value,
        'position' => $position,
        'is_visible' => 1,
        'is_variation' => 0,
        'is_taxonomy' => 0,
    ];
}

function selectionTypeLabel(array $record): string
{
    return slugify((string) ($record['type_selection'] ?? '')) === 'jeu-compose' ? 'jeu composé' : 'jeu complet';
}

function componentModels(array $record): string
{
    $models = [];
    foreach (['Mi', 'La', 'Ré', 'Sol', 'Do'] as $prefix) {
        $model = trim((string) ($record[$prefix . '_modele'] ?? ''));
        if ($model !== '') {
            $models[] = $model;
        }
    }

    return implode(' | ', array_unique($models));
}

function productDescription(array $record, array $components): string
{
    $lines = [];
    $lines[] = trim((string) ($record['objectif'] ?? ''));
    $note = trim((string) ($record['note'] ?? ''));
    if ($note !== '') {
        $lines[] = $note;
    }

    $composition = componentSummary($record);
    if ($composition !== '') {
        $lines[] = 'Composition : ' . $composition;
    }

    return implode("\n\n", array_filter($lines));
}

function componentSummary(array $record): string
{
    $parts = [];
    foreach (['Mi', 'La', 'Ré', 'Sol', 'Do'] as $prefix) {
        $sku = trim((string) ($record[$prefix . '_sku'] ?? ''));
        if ($sku === '') {
            continue;
        }

        $model = trim((string) ($record[$prefix . '_modele'] ?? ''));
        $parts[] = "{$prefix}:{$sku}" . ($model !== '' ? " ({$model})" : '');
    }

    return implode(' | ', $parts);
}

function compositionData(array $record, array $components): array
{
    $bySku = [];
    foreach ($components as $component) {
        $bySku[strtoupper((string) $component['sku'])] = $component;
    }

    $strings = [];
    foreach (['Mi' => 'mi', 'La' => 'la', 'Ré' => 're', 'Sol' => 'sol', 'Do' => 'do'] as $prefix => $key) {
        $sku = trim((string) ($record[$prefix . '_sku'] ?? ''));
        if ($sku === '') {
            continue;
        }

        $strings[$key] = [
            'sku' => $sku,
            'name' => $bySku[strtoupper($sku)]['post_title'] ?? '',
            'model' => trim((string) ($record[$prefix . '_modele'] ?? '')),
            'string' => $prefix,
        ];
    }

    return [
        'instrument' => slugify((string) ($record['instrument'] ?? '')),
        'strings' => $strings,
    ];
}

function priceForSelection(array $record, array $components): string
{
    foreach (['prix_jeu_complet', 'prix_total_estime_cordes'] as $field) {
        $value = trim((string) ($record[$field] ?? ''));
        if ($value !== '') {
            return money($value);
        }
    }

    $sum = 0.0;
    foreach ($components as $component) {
        $sum += (float) str_replace(',', '.', (string) ($component['price'] ?? '0'));
    }

    return money((string) $sum);
}

function stockForSelection(array $record, array $components): string
{
    $direct = trim((string) ($record['stock_jeu_complet'] ?? ''));
    if ($direct !== '') {
        return (string) max(0, (int) floor((float) str_replace(',', '.', $direct)));
    }

    $stocks = [];
    foreach ($components as $component) {
        $stock = trim((string) ($component['stock'] ?? ''));
        if ($stock !== '') {
            $stocks[] = (int) floor((float) str_replace(',', '.', $stock));
        }
    }

    return $stocks ? (string) max(0, min($stocks)) : '0';
}

function money(string $value): string
{
    $number = (float) str_replace(',', '.', $value);
    return number_format($number, 2, '.', '');
}

function uniqueSlug(mysqli $db, string $base): string
{
    $base = $base !== '' ? $base : 'selection-cordes';
    $slug = $base;
    $index = 2;

    while (slugExists($db, $slug)) {
        $slug = $base . '-' . $index;
        $index++;
    }

    return $slug;
}

function slugExists(mysqli $db, string $slug): bool
{
    $stmt = $db->prepare("SELECT ID FROM wp_posts WHERE post_name = ? LIMIT 1");
    $stmt->bind_param('s', $slug);
    $stmt->execute();

    return (bool) $stmt->get_result()->fetch_assoc();
}

function refreshTermCounts(mysqli $db): void
{
    $db->query("UPDATE wp_term_taxonomy tx
                SET count = (
                    SELECT COUNT(*)
                    FROM wp_term_relationships tr
                    JOIN wp_posts p ON p.ID = tr.object_id
                    WHERE tr.term_taxonomy_id = tx.term_taxonomy_id
                      AND p.post_status = 'publish'
                )
                WHERE tx.taxonomy IN ('product_type','product_cat','pa_instrument','pa_corde','pa_taille','pa_profil_sonore','pa_usage')");
}

function slugify(string $value): string
{
    $value = normalize($value);
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    return trim($value, '-');
}

function normalize(string $value): string
{
    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $value = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $value) ?: strtolower($value);
    return trim($value);
}
