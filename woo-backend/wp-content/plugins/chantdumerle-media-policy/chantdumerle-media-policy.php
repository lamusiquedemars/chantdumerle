<?php
/**
 * Plugin Name: Chant du Merle - Media Policy
 * Description: Limits generated image sizes during catalogue imports for the headless storefront.
 * Version: 1.0.0
 * Author: Chant du Merle
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Keep the image variants that are useful for the catalogue:
 * - medium: WordPress/admin/API compatibility around 300px.
 * - woocommerce_thumbnail: product listing image around 300px.
 * - woocommerce_single: product page image around 600px.
 */
function cdm_media_policy_allowed_sizes(): array
{
    return [
        'medium',
        'woocommerce_thumbnail',
        'woocommerce_single',
    ];
}

add_filter('intermediate_image_sizes_advanced', function (array $sizes): array {
    $allowed = array_flip(cdm_media_policy_allowed_sizes());

    return array_intersect_key($sizes, $allowed);
}, 100);

add_filter('intermediate_image_sizes', function (array $sizes): array {
    return array_values(array_intersect($sizes, cdm_media_policy_allowed_sizes()));
}, 100);

add_filter('big_image_size_threshold', '__return_false', 100);

register_activation_hook(__FILE__, function (): void {
    update_option('thumbnail_size_w', 0);
    update_option('thumbnail_size_h', 0);
    update_option('thumbnail_crop', 0);

    update_option('medium_size_w', 300);
    update_option('medium_size_h', 300);

    update_option('medium_large_size_w', 0);
    update_option('medium_large_size_h', 0);

    update_option('large_size_w', 0);
    update_option('large_size_h', 0);

    update_option('woocommerce_thumbnail_image_width', 300);
    update_option('woocommerce_thumbnail_cropping', '1:1');
    update_option('woocommerce_single_image_width', 600);
});
