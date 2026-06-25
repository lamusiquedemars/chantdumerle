<?php
/**
 * Plugin Name: Chant du Merle - Commerce Bridge
 * Description: Exposes a small WooCommerce cart API for the Next storefront.
 * Version: 1.0.0
 * Author: Chant du Merle
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const CDM_COMMERCE_REST_NAMESPACE = 'cdm/v1';

function cdm_commerce_boot_cart(): ?WP_Error
{
    if (! function_exists('WC') || ! function_exists('wc_load_cart')) {
        return new WP_Error(
            'cdm_woocommerce_unavailable',
            'WooCommerce is not available.',
            ['status' => 503]
        );
    }

    /*
     * The Next storefront must write into the canonical Woo session, not into a
     * parallel token cart. Loading the Woo cart here gives REST requests the
     * same session/cookie lifecycle as native cart and checkout pages.
     */
    wc_load_cart();

    if (! WC()->cart || ! WC()->session) {
        return new WP_Error(
            'cdm_cart_unavailable',
            'WooCommerce cart session is not available.',
            ['status' => 503]
        );
    }

    return null;
}

function cdm_commerce_cart_payload(): array
{
    $cart = WC()->cart;
    $item_count = $cart ? (int) $cart->get_cart_contents_count() : 0;

    return [
        'itemCount' => $item_count,
        'cartUrl' => cdm_commerce_relative_url(
            function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/cart/')
        ),
        'checkoutUrl' => cdm_commerce_relative_url(
            function_exists('wc_get_checkout_url') ? wc_get_checkout_url() : home_url('/checkout/')
        ),
        'totalHtml' => $cart && $item_count > 0 ? $cart->get_cart_total() : null,
    ];
}

function cdm_commerce_relative_url(string $url): string
{
    $path = wp_parse_url($url, PHP_URL_PATH) ?: '/';
    $query = wp_parse_url($url, PHP_URL_QUERY);

    return $query ? "{$path}?{$query}" : $path;
}

function cdm_commerce_persist_cart_session(): void
{
    if (! WC()->cart || ! WC()->session) {
        return;
    }

    WC()->cart->calculate_totals();
    WC()->cart->set_session();
    WC()->session->set_customer_session_cookie(true);
    WC()->session->save_data();
}

function cdm_commerce_product_is_buyable(WC_Product $product, int $quantity): bool
{
    return $product->exists()
        && $product->get_status() === 'publish'
        && $product->is_purchasable()
        && $product->is_in_stock()
        && $product->has_enough_stock($quantity);
}

function cdm_commerce_resolve_cart_product(WC_Product $product, int $quantity)
{
    if ($product instanceof WC_Product_Variation) {
        if (! cdm_commerce_product_is_buyable($product, $quantity)) {
            return new WP_Error(
                'cdm_product_not_purchasable',
                'Ce produit ne peut pas être ajouté au panier.',
                ['status' => 400]
            );
        }

        return [
            'product_id' => $product->get_parent_id(),
            'variation_id' => $product->get_id(),
            'variation' => $product->get_variation_attributes(),
        ];
    }

    if ($product instanceof WC_Product_Variable) {
        $available_variations = [];

        foreach ($product->get_children() as $variation_id) {
            $variation = wc_get_product($variation_id);

            if ($variation instanceof WC_Product_Variation && cdm_commerce_product_is_buyable($variation, $quantity)) {
                $available_variations[] = $variation;
            }
        }

        if (count($available_variations) === 1) {
            $variation = $available_variations[0];

            return [
                'product_id' => $product->get_id(),
                'variation_id' => $variation->get_id(),
                'variation' => $variation->get_variation_attributes(),
            ];
        }

        return new WP_Error(
            'cdm_variable_product_requires_selection',
            'Ce produit existe en plusieurs variantes. Ouvrez la fiche WooCommerce pour choisir la bonne option.',
            ['status' => 400]
        );
    }

    if (! cdm_commerce_product_is_buyable($product, $quantity)) {
        return new WP_Error(
            'cdm_product_not_purchasable',
            'Ce produit ne peut pas être ajouté au panier.',
            ['status' => 400]
        );
    }

    return [
        'product_id' => $product->get_id(),
        'variation_id' => 0,
        'variation' => [],
    ];
}

function cdm_commerce_get_cart()
{
    $boot_error = cdm_commerce_boot_cart();

    if ($boot_error instanceof WP_Error) {
        return $boot_error;
    }

    return rest_ensure_response(cdm_commerce_cart_payload());
}

function cdm_commerce_add_to_cart(WP_REST_Request $request)
{
    $boot_error = cdm_commerce_boot_cart();

    if ($boot_error instanceof WP_Error) {
        return $boot_error;
    }

    $product_id = absint($request->get_param('productId'));
    $quantity = max(1, absint($request->get_param('quantity')));

    if ($product_id <= 0) {
        return new WP_Error(
            'cdm_invalid_product',
            'Produit invalide.',
            ['status' => 400]
        );
    }

    $product = wc_get_product($product_id);

    if (! $product || ! $product->exists() || $product->get_status() !== 'publish') {
        return new WP_Error(
            'cdm_product_not_found',
            'Ce produit n’est pas disponible.',
            ['status' => 404]
        );
    }

    $cart_product = cdm_commerce_resolve_cart_product($product, $quantity);

    if ($cart_product instanceof WP_Error) {
        return $cart_product;
    }

    $cart_item_key = WC()->cart->add_to_cart(
        $cart_product['product_id'],
        $quantity,
        $cart_product['variation_id'],
        $cart_product['variation']
    );

    if (! $cart_item_key) {
        return new WP_Error(
            'cdm_add_to_cart_failed',
            'Impossible d’ajouter ce produit au panier.',
            ['status' => 500]
        );
    }

    cdm_commerce_persist_cart_session();

    $payload = cdm_commerce_cart_payload();
    $payload['message'] = 'Produit ajouté au panier.';

    return rest_ensure_response($payload);
}

function cdm_commerce_register_routes(): void
{
    register_rest_route(CDM_COMMERCE_REST_NAMESPACE, '/cart', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'cdm_commerce_get_cart',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route(CDM_COMMERCE_REST_NAMESPACE, '/cart/add', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'cdm_commerce_add_to_cart',
        'permission_callback' => '__return_true',
        'args' => [
            'productId' => [
                'required' => true,
                'sanitize_callback' => 'absint',
            ],
            'quantity' => [
                'default' => 1,
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);
}
add_action('rest_api_init', 'cdm_commerce_register_routes');

function cdm_commerce_front_product_url(string $permalink, WP_Post $post): string
{
    if ($post->post_type !== 'product' || $post->post_name === '') {
        return $permalink;
    }

    $front_url = getenv('NEXT_PUBLIC_SITE_URL') ?: 'http://chantdumerle.local';

    return untrailingslashit($front_url) . '/fr/produits/' . $post->post_name . '/';
}
add_filter('post_type_link', 'cdm_commerce_front_product_url', 10, 2);

function cdm_commerce_front_wc_product_url(string $permalink, WC_Product $product): string
{
    $slug = $product->get_slug();

    if ($slug === '') {
        return $permalink;
    }

    $front_url = getenv('NEXT_PUBLIC_SITE_URL') ?: 'http://chantdumerle.local';

    return untrailingslashit($front_url) . '/fr/produits/' . $slug . '/';
}
add_filter('woocommerce_product_get_permalink', 'cdm_commerce_front_wc_product_url', 10, 2);

function cdm_commerce_front_url(string $path): string
{
    $front_url = getenv('NEXT_PUBLIC_SITE_URL') ?: 'http://chantdumerle.local';

    return untrailingslashit($front_url) . '/' . ltrim($path, '/');
}

function cdm_commerce_front_cart_url(): string
{
    return cdm_commerce_front_url('/panier');
}
add_filter('woocommerce_get_cart_url', 'cdm_commerce_front_cart_url');

function cdm_commerce_front_checkout_url(): string
{
    return cdm_commerce_front_url('/commande');
}
add_filter('woocommerce_get_checkout_url', 'cdm_commerce_front_checkout_url');

function cdm_commerce_front_account_url(): string
{
    return cdm_commerce_front_url('/mon-compte');
}
add_filter('woocommerce_get_myaccount_page_permalink', 'cdm_commerce_front_account_url');

function cdm_commerce_front_transactional_page_url(string $link, int $post_id): string
{
    $privacy_policy_page_id = (int) get_option('wp_page_for_privacy_policy');

    if ($privacy_policy_page_id > 0 && $post_id === $privacy_policy_page_id) {
        return cdm_commerce_front_url('/fr/politique-confidentialite');
    }

    $path = wp_parse_url($link, PHP_URL_PATH) ?: '';

    if (cdm_commerce_is_transactional_path($path)) {
        return cdm_commerce_front_url($path);
    }

    return $link;
}
add_filter('page_link', 'cdm_commerce_front_transactional_page_url', 10, 2);

function cdm_commerce_front_ajax_endpoint(string $url, string $request): string
{
    return add_query_arg('wc-ajax', $request, cdm_commerce_front_url('/'));
}
add_filter('woocommerce_ajax_get_endpoint', 'cdm_commerce_front_ajax_endpoint', 10, 2);

function cdm_commerce_use_classic_transactional_content(string $content): string
{
    static $rendering_classic_content = false;

    if ($rendering_classic_content) {
        return $content;
    }

    if (is_admin() || ! is_singular()) {
        return $content;
    }

    if (function_exists('is_cart') && is_cart()) {
        $rendering_classic_content = true;
        $classic_content = do_shortcode('[woocommerce_cart]');
        $rendering_classic_content = false;

        return $classic_content;
    }

    if (function_exists('is_checkout') && is_checkout() && ! is_wc_endpoint_url('order-received')) {
        $rendering_classic_content = true;
        $classic_content = do_shortcode('[woocommerce_checkout]');
        $rendering_classic_content = false;

        return $classic_content;
    }

    return $content;
}
add_filter('the_content', 'cdm_commerce_use_classic_transactional_content', 1);

function cdm_commerce_dequeue_block_cart_assets(): void
{
    if (! function_exists('is_cart') || ! is_cart()) {
        return;
    }

    $handles = [
        'wc-blocks-style',
        'wc-blocks-style-cart',
        'wc-blocks-style-all-products',
        'wc-blocks-packages-style',
        'wc-cart-block',
        'wc-cart-block-frontend',
        'wc-blocks-data-store',
        'wc-blocks-middleware',
        'wc-blocks-components',
        'wc-blocks-checkout',
    ];

    foreach ($handles as $handle) {
        wp_dequeue_style($handle);
        wp_dequeue_script($handle);
    }
}
add_action('wp_enqueue_scripts', 'cdm_commerce_dequeue_block_cart_assets', 100);

function cdm_commerce_is_transactional_path(string $path): bool
{
    $normalized_path = '/' . trim($path, '/');

    return in_array($normalized_path, ['/panier', '/commande', '/mon-compte'], true)
        || str_starts_with($normalized_path, '/panier/')
        || str_starts_with($normalized_path, '/commande/')
        || str_starts_with($normalized_path, '/mon-compte/');
}

function cdm_commerce_disable_proxy_canonical_redirect($redirect_url, string $requested_url)
{
    $path = wp_parse_url($_SERVER['REQUEST_URI'] ?? $requested_url, PHP_URL_PATH) ?: '/';

    if (cdm_commerce_is_transactional_path($path)) {
        return false;
    }

    return $redirect_url;
}
add_filter('redirect_canonical', 'cdm_commerce_disable_proxy_canonical_redirect', 10, 2);

function cdm_commerce_allow_storefront_origin(): void
{
    $origin = get_http_origin();
    $front_url = getenv('NEXT_PUBLIC_SITE_URL') ?: 'http://chantdumerle.local';
    $allowed_origins = array_filter([
        untrailingslashit($front_url),
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]);

    if (! $origin || ! in_array(untrailingslashit($origin), $allowed_origins, true)) {
        return;
    }

    header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin', false);
}
add_action('rest_api_init', 'cdm_commerce_allow_storefront_origin', 9);
