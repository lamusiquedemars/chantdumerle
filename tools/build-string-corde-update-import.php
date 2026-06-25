<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$outputPath = $root . '/next-frontend/mvc/exports/woo-cordes-pa-corde-jeu-update.csv';
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

$products = $pdo->query(
    "SELECT p.ID, sku.meta_value AS sku, p.post_title AS name
     FROM (
        SELECT DISTINCT p.ID
        FROM {$prefix}posts p
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
     ) string_products
     JOIN {$prefix}posts p ON p.ID = string_products.ID
     LEFT JOIN (
        SELECT DISTINCT tr.object_id AS product_id
        FROM {$prefix}term_relationships tr
        JOIN {$prefix}term_taxonomy tt
          ON tt.term_taxonomy_id = tr.term_taxonomy_id
         AND tt.taxonomy = 'pa_corde'
     ) corde_products ON corde_products.product_id = p.ID
     LEFT JOIN {$prefix}postmeta sku
       ON sku.post_id = p.ID
      AND sku.meta_key = '_sku'
     WHERE corde_products.product_id IS NULL
     ORDER BY p.post_title"
)->fetchAll();

$attributeRows = $pdo->query(
    "SELECT tr.object_id AS product_id, tt.taxonomy, t.name
     FROM {$prefix}term_relationships tr
     JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
     JOIN {$prefix}terms t ON t.term_id = tt.term_id
     WHERE tt.taxonomy LIKE 'pa\_%'
     ORDER BY tr.object_id, tt.taxonomy, t.name"
)->fetchAll();

$attributesByProduct = [];
foreach ($attributeRows as $row) {
    $productId = (int) $row['product_id'];
    $taxonomy = (string) $row['taxonomy'];

    $attributesByProduct[$productId][$taxonomy][] = (string) $row['name'];
}

$attributeLabels = [
    'pa_marque' => 'Marque',
    'pa_modele' => 'Modèle',
    'pa_instrument' => 'Instrument',
    'pa_corde' => 'Corde',
    'pa_taille' => 'Taille',
    'pa_tension' => 'Tension',
    'pa_attache' => 'Attache',
    'pa_ame' => 'Âme',
    'pa_filage' => 'Filage',
    'pa_type_produit' => 'Type produit',
    'pa_type_pack' => 'Type pack',
    'pa_profil_sonore' => 'Profil sonore',
    'pa_complexite' => 'Complexité',
    'pa_puissance' => 'Puissance',
    'pa_reponse' => 'Réponse',
    'pa_usage' => 'Usage',
    'pa_positionnement' => 'Positionnement',
    'pa_durabilite' => 'Durabilité',
    'pa_stabilite' => 'Stabilité',
    'pa_temps_rodage' => 'Temps de rodage',
];

$headers = ['ID', 'SKU', 'Name'];
for ($index = 1; $index <= 20; $index += 1) {
    $headers[] = "Attribute {$index} name";
    $headers[] = "Attribute {$index} value(s)";
    $headers[] = "Attribute {$index} visible";
    $headers[] = "Attribute {$index} global";
}

$output = fopen($outputPath, 'wb');
if ($output === false) {
    throw new RuntimeException("Unable to open {$outputPath}");
}

write_csv_row($output, $headers);

foreach ($products as $product) {
    $productId = (int) $product['ID'];
    $attributes = $attributesByProduct[$productId] ?? [];
    $attributes['pa_corde'] = ['jeu'];

    $row = [
        (string) $productId,
        (string) ($product['sku'] ?? ''),
        (string) $product['name'],
    ];

    $attributeCount = 0;
    foreach ($attributeLabels as $taxonomy => $label) {
        if (!isset($attributes[$taxonomy])) {
            continue;
        }

        $values = array_values(array_unique(array_filter($attributes[$taxonomy], 'strlen')));
        if ($values === []) {
            continue;
        }

        $attributeCount += 1;
        $row[] = $label;
        $row[] = implode(', ', $values);
        $row[] = '1';
        $row[] = '1';
        unset($attributes[$taxonomy]);
    }

    foreach ($attributes as $taxonomy => $values) {
        if ($attributeCount >= 20) {
            break;
        }

        $values = array_values(array_unique(array_filter($values, 'strlen')));
        if ($values === []) {
            continue;
        }

        $attributeCount += 1;
        $row[] = preg_replace('/^pa_/', '', $taxonomy);
        $row[] = implode(', ', $values);
        $row[] = '1';
        $row[] = '1';
    }

    while (count($row) < count($headers)) {
        $row[] = '';
    }

    write_csv_row($output, $row);
}

fclose($output);

echo json_encode(
    [
        'output' => $outputPath,
        'rows' => count($products),
    ],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
) . PHP_EOL;

/**
 * @param resource $handle
 * @param list<string> $row
 */
function write_csv_row($handle, array $row): void
{
    fputcsv($handle, $row, ',', '"', '\\', "\n");
}
