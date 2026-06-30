<?php

declare(strict_types=1);

$root = dirname(__DIR__);

require_once $root . '/woo-backend/wp-load.php';

$accessoryCategorySlugs = [
    'colophanes-accessoires',
    'epaulieres',
    'sourdines',
    'violon-etuis-housses',
    'alto-etuis-housses',
    'violoncelle-etuis-housses',
    'contrebasse-etuis-housses',
    'etuis-pour-archets',
    'entretien',
    'supports-de-pique',
];

$attributeTaxonomies = [
    'instrument' => 'pa_instrument',
    'marque' => 'pa_marque',
    'modele' => 'pa_modele',
    'type-de-produit' => 'pa_type_produit',
    'taille' => 'pa_taille',
];

function repair_split_attribute_values(string $value): array
{
    $parts = preg_split('/\s*\|\s*/', $value) ?: [];

    return array_values(array_filter(array_map('trim', $parts)));
}

function repair_get_or_create_term_id(string $taxonomy, string $name): int
{
    $existing = term_exists($name, $taxonomy);

    if (is_array($existing) && isset($existing['term_id'])) {
        return (int) $existing['term_id'];
    }

    if (is_int($existing)) {
        return $existing;
    }

    $created = wp_insert_term($name, $taxonomy);

    if (is_wp_error($created)) {
        throw new RuntimeException(
            sprintf(
                'Unable to create term "%s" in %s: %s',
                $name,
                $taxonomy,
                $created->get_error_message()
            )
        );
    }

    return (int) $created['term_id'];
}

$productIds = get_posts([
    'fields' => 'ids',
    'post_type' => 'product',
    'post_status' => ['publish', 'private'],
    'posts_per_page' => -1,
    'tax_query' => [
        [
            'taxonomy' => 'product_cat',
            'field' => 'slug',
            'terms' => $accessoryCategorySlugs,
        ],
    ],
]);

$updatedProducts = 0;
$setTerms = 0;
$convertedAttributes = 0;

foreach ($productIds as $productId) {
    $attributes = get_post_meta($productId, '_product_attributes', true);

    if (!is_array($attributes)) {
        continue;
    }

    $nextAttributes = $attributes;
    $changed = false;

    foreach ($attributeTaxonomies as $localKey => $taxonomy) {
        if (!taxonomy_exists($taxonomy) || !isset($attributes[$localKey])) {
            continue;
        }

        $attribute = $attributes[$localKey];
        $rawValue = is_array($attribute) ? (string) ($attribute['value'] ?? '') : '';
        $values = repair_split_attribute_values($rawValue);

        if ($values === []) {
            continue;
        }

        $termIds = [];

        foreach ($values as $value) {
            $termIds[] = repair_get_or_create_term_id($taxonomy, $value);
        }

        $result = wp_set_object_terms($productId, $termIds, $taxonomy, false);

        if (is_wp_error($result)) {
            throw new RuntimeException(
                sprintf(
                    'Unable to set %s on product %d: %s',
                    $taxonomy,
                    $productId,
                    $result->get_error_message()
                )
            );
        }

        $setTerms += count($termIds);
        unset($nextAttributes[$localKey]);
        $nextAttributes[$taxonomy] = [
            'name' => $taxonomy,
            'value' => '',
            'position' => (int) ($attribute['position'] ?? 0),
            'is_visible' => (int) ($attribute['is_visible'] ?? 1),
            'is_variation' => (int) ($attribute['is_variation'] ?? 0),
            'is_taxonomy' => 1,
        ];
        $convertedAttributes += 1;
        $changed = true;
    }

    if ($changed) {
        update_post_meta($productId, '_product_attributes', $nextAttributes);
        wc_delete_product_transients($productId);
        $updatedProducts += 1;
    }
}

wp_cache_flush();

printf(
    "Updated products: %d\nSet terms: %d\nConverted attributes: %d\n",
    $updatedProducts,
    $setTerms,
    $convertedAttributes
);

