<?php
/**
 * Plugin Name: Chant du Merle - Editorial Content
 * Description: Registers editorial content models for the headless storefront.
 * Version: 1.0.0
 * Author: Chant du Merle
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const CDM_GUIDE_POST_TYPE = 'guide';
const CDM_GUIDE_TAXONOMY = 'guide_category';

function cdm_editorial_register_guide_post_type(): void
{
    register_post_type(CDM_GUIDE_POST_TYPE, [
        'labels' => [
            'name' => 'Guides',
            'singular_name' => 'Guide',
            'menu_name' => 'Guides',
            'add_new_item' => 'Ajouter un guide',
            'edit_item' => 'Modifier le guide',
            'new_item' => 'Nouveau guide',
            'view_item' => 'Voir le guide',
            'search_items' => 'Rechercher des guides',
            'not_found' => 'Aucun guide trouve',
        ],
        'public' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'Guide',
        'graphql_plural_name' => 'Guides',
        'menu_icon' => 'dashicons-welcome-learn-more',
        'has_archive' => false,
        'rewrite' => [
            'slug' => 'guides',
            'with_front' => false,
        ],
        'supports' => [
            'title',
            'editor',
            'excerpt',
            'thumbnail',
            'revisions',
            'page-attributes',
        ],
    ]);
}

function cdm_editorial_register_guide_taxonomy(): void
{
    register_taxonomy(CDM_GUIDE_TAXONOMY, [CDM_GUIDE_POST_TYPE], [
        'labels' => [
            'name' => 'Categories de guides',
            'singular_name' => 'Categorie de guide',
            'menu_name' => 'Categories',
            'add_new_item' => 'Ajouter une categorie',
            'edit_item' => 'Modifier la categorie',
        ],
        'public' => true,
        'hierarchical' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'GuideCategory',
        'graphql_plural_name' => 'GuideCategories',
        'rewrite' => [
            'slug' => 'guide-category',
            'with_front' => false,
        ],
    ]);
}

function cdm_editorial_register_guide_meta(): void
{
    $fields = [
        'cdm_guide_subtitle',
        'cdm_guide_card_label',
        'cdm_guide_cta_title',
        'cdm_guide_cta_text',
        'cdm_guide_cta_primary_label',
        'cdm_guide_cta_primary_url',
        'cdm_guide_cta_secondary_label',
        'cdm_guide_cta_secondary_url',
    ];

    foreach ($fields as $field) {
        register_post_meta(CDM_GUIDE_POST_TYPE, $field, [
            'single' => true,
            'type' => 'string',
            'show_in_rest' => true,
            'auth_callback' => static fn (): bool => current_user_can('edit_posts'),
            'sanitize_callback' => 'sanitize_text_field',
        ]);
    }
}

function cdm_editorial_register_graphql_guide_fields(): void
{
    if (! function_exists('register_graphql_field')) {
        return;
    }

    $fields = [
        'guideSubtitle' => 'cdm_guide_subtitle',
        'guideCardLabel' => 'cdm_guide_card_label',
        'guideCtaTitle' => 'cdm_guide_cta_title',
        'guideCtaText' => 'cdm_guide_cta_text',
        'guideCtaPrimaryLabel' => 'cdm_guide_cta_primary_label',
        'guideCtaPrimaryUrl' => 'cdm_guide_cta_primary_url',
        'guideCtaSecondaryLabel' => 'cdm_guide_cta_secondary_label',
        'guideCtaSecondaryUrl' => 'cdm_guide_cta_secondary_url',
    ];

    foreach ($fields as $graphql_field => $meta_key) {
        register_graphql_field('Guide', $graphql_field, [
            'type' => 'String',
            'description' => sprintf('Guide meta field %s.', $meta_key),
            'resolve' => static function ($post) use ($meta_key): ?string {
                $value = get_post_meta((int) $post->ID, $meta_key, true);

                return is_string($value) && $value !== '' ? $value : null;
            },
        ]);
    }
}

function cdm_editorial_register_acf_guide_fields(): void
{
    if (! function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_cdm_guide_editorial',
        'title' => 'Guide - informations editoriales',
        'fields' => [
            [
                'key' => 'field_cdm_guide_subtitle',
                'label' => 'Sous-titre',
                'name' => 'cdm_guide_subtitle',
                'type' => 'textarea',
                'rows' => 2,
            ],
            [
                'key' => 'field_cdm_guide_card_label',
                'label' => 'Libelle de carte',
                'name' => 'cdm_guide_card_label',
                'type' => 'text',
                'instructions' => 'Court libelle affiche sur les cartes, par exemple Choix ou Violon.',
            ],
            [
                'key' => 'field_cdm_guide_cta_title',
                'label' => 'Titre du CTA',
                'name' => 'cdm_guide_cta_title',
                'type' => 'text',
            ],
            [
                'key' => 'field_cdm_guide_cta_text',
                'label' => 'Texte du CTA',
                'name' => 'cdm_guide_cta_text',
                'type' => 'textarea',
                'rows' => 3,
            ],
            [
                'key' => 'field_cdm_guide_cta_primary_label',
                'label' => 'Libelle bouton principal',
                'name' => 'cdm_guide_cta_primary_label',
                'type' => 'text',
            ],
            [
                'key' => 'field_cdm_guide_cta_primary_url',
                'label' => 'URL bouton principal',
                'name' => 'cdm_guide_cta_primary_url',
                'type' => 'text',
            ],
            [
                'key' => 'field_cdm_guide_cta_secondary_label',
                'label' => 'Libelle bouton secondaire',
                'name' => 'cdm_guide_cta_secondary_label',
                'type' => 'text',
            ],
            [
                'key' => 'field_cdm_guide_cta_secondary_url',
                'label' => 'URL bouton secondaire',
                'name' => 'cdm_guide_cta_secondary_url',
                'type' => 'text',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => CDM_GUIDE_POST_TYPE,
                ],
            ],
        ],
        'position' => 'normal',
        'style' => 'default',
        'active' => true,
        'show_in_rest' => true,
    ]);
}

add_action('init', 'cdm_editorial_register_guide_post_type');
add_action('init', 'cdm_editorial_register_guide_taxonomy');
add_action('init', 'cdm_editorial_register_guide_meta');
add_action('graphql_register_types', 'cdm_editorial_register_graphql_guide_fields');
add_action('acf/init', 'cdm_editorial_register_acf_guide_fields');

register_activation_hook(__FILE__, function (): void {
    cdm_editorial_register_guide_post_type();
    cdm_editorial_register_guide_taxonomy();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function (): void {
    flush_rewrite_rules();
});
