<?php
/**
 * Theme setup for the Chant du Merle WooCommerce area.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function cdm_theme_setup(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );

	register_nav_menus(
		array(
			'footer' => __( 'Footer', 'chantdumerle' ),
		)
	);
}
add_action( 'after_setup_theme', 'cdm_theme_setup' );

function cdm_enqueue_assets(): void {
	$theme = wp_get_theme();
	$style_path = get_stylesheet_directory() . '/style.css';
	$style_version = file_exists( $style_path ) ? (string) md5_file( $style_path ) : $theme->get( 'Version' );
	$navigation_path = get_template_directory() . '/assets/navigation.js';
	$navigation_version = file_exists( $navigation_path )
		? (string) md5_file( $navigation_path )
		: $theme->get( 'Version' );

	wp_enqueue_style(
		'chantdumerle-style',
		get_stylesheet_uri(),
		array(),
		$style_version
	);

	wp_enqueue_script(
		'chantdumerle-navigation',
		get_template_directory_uri() . '/assets/navigation.js',
		array(),
		$navigation_version,
		true
	);

	if (
		class_exists( 'WC_AJAX' )
		&& (
			( function_exists( 'is_cart' ) && is_cart() )
			|| ( function_exists( 'is_checkout' ) && is_checkout() )
		)
	) {
		$cart_shipping_path = get_template_directory() . '/assets/cart-shipping.js';
		$cart_shipping_version = file_exists( $cart_shipping_path )
			? (string) md5_file( $cart_shipping_path )
			: $theme->get( 'Version' );

		wp_enqueue_script(
			'chantdumerle-cart-shipping',
			get_template_directory_uri() . '/assets/cart-shipping.js',
			array( 'jquery' ),
			$cart_shipping_version,
			true
		);

		wp_localize_script(
			'chantdumerle-cart-shipping',
			'cdmCartShipping',
			array(
				'wcAjaxUrl'                 => WC_AJAX::get_endpoint( '%%endpoint%%' ),
				'updateShippingMethodNonce' => wp_create_nonce( 'update-shipping-method' ),
			)
		);
	}
}
add_action( 'wp_enqueue_scripts', 'cdm_enqueue_assets' );

function cdm_nav_icon( string $icon ): void {
	if ( $icon === 'user' ) {
		?>
		<svg class="site-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M17.925 20.056a6 6 0 0 0-11.851.001"></path>
			<circle cx="12" cy="11" r="4"></circle>
			<circle cx="12" cy="12" r="10"></circle>
		</svg>
		<?php
		return;
	}

	if ( $icon === 'cart' ) {
		?>
		<svg class="site-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="8" cy="21" r="1"></circle>
			<circle cx="19" cy="21" r="1"></circle>
			<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
		</svg>
		<?php
	}
}

function cdm_front_base_url(): string {
	$env_url = getenv( 'NEXT_PUBLIC_SITE_URL' );
	$url     = is_string( $env_url ) && $env_url !== '' ? $env_url : 'http://chantdumerle.local';

	return untrailingslashit( $url );
}

function cdm_front_url( string $path = '' ): string {
	return esc_url( '/' . ltrim( $path, '/' ) );
}

function cdm_account_url(): string {
	if ( function_exists( 'wc_get_page_permalink' ) ) {
		return esc_url( wc_get_page_permalink( 'myaccount' ) );
	}

	return esc_url( home_url( '/my-account/' ) );
}

function cdm_cart_url(): string {
	if ( function_exists( 'wc_get_cart_url' ) ) {
		return esc_url( wc_get_cart_url() );
	}

	return esc_url( home_url( '/cart/' ) );
}

function cdm_checkout_url(): string {
	if ( function_exists( 'wc_get_checkout_url' ) ) {
		return esc_url( wc_get_checkout_url() );
	}

	return esc_url( home_url( '/checkout/' ) );
}

function cdm_cart_item_count(): int {
	if ( function_exists( 'WC' ) && WC()->cart ) {
		$count = (int) WC()->cart->get_cart_contents_count();

		if ( $count > 0 ) {
			return $count;
		}
	}

	// Woo pose ce cookie des l'ajout, avant meme que le theme rende son header.
	return isset( $_COOKIE['woocommerce_items_in_cart'] )
		? max( 0, absint( wp_unslash( $_COOKIE['woocommerce_items_in_cart'] ) ) )
		: 0;
}

function cdm_cart_remove_redundant_view_cart_link( string $message ): string {
	$request_path = wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );

	if ( untrailingslashit( (string) $request_path ) !== '/panier' ) {
		return $message;
	}

	$filtered_message = preg_replace(
		'/\s*<a\b[^>]*class="[^"]*\bwc-forward\b[^"]*"[^>]*>.*?<\/a>\s*$/s',
		'',
		$message
	);

	return is_string( $filtered_message ) ? $filtered_message : $message;
}
add_filter( 'wc_add_to_cart_message_html', 'cdm_cart_remove_redundant_view_cart_link' );

function cdm_primary_nav_items(): array {
	return array(
		array(
			'label' => 'Cordes',
			'url'   => cdm_front_url( 'fr/cordes' ),
		),
		array(
			'label' => 'Archets',
			'url'   => cdm_front_url( 'fr/archets' ),
		),
		array(
			'label' => 'Accessoires',
			'url'   => cdm_front_url( 'fr/accessoires' ),
		),
		array(
			'label' => 'Sélections',
			'url'   => cdm_front_url( 'fr/selections' ),
		),
		array(
			'label' => 'Guides',
			'url'   => cdm_front_url( 'fr/guides' ),
		),
		array(
			'label' => 'Espace client',
			'url'   => cdm_account_url(),
			'icon'  => 'user',
			'icon_only' => true,
			'active' => function_exists( 'is_account_page' ) && is_account_page(),
		),
		array(
			'label' => 'Panier',
			'url'   => cdm_cart_url(),
			'icon'  => 'cart',
			'count' => cdm_cart_item_count(),
			'icon_only' => true,
			'active' => function_exists( 'is_cart' ) && is_cart(),
		),
	);
}

function cdm_footer_links(): array {
	return array(
		array(
			'label' => 'Contact',
			'url'   => cdm_front_url( 'fr/contact' ),
		),
		array(
			'label' => 'Mentions légales',
			'url'   => cdm_front_url( 'fr/mentions-legales' ),
		),
		array(
			'label' => 'Confidentialité',
			'url'   => cdm_front_url( 'fr/politique-confidentialite' ),
		),
		array(
			'label' => 'CGV',
			'url'   => cdm_front_url( 'fr/cgv' ),
		),
	);
}

function cdm_account_menu_items( array $items ): array {
	$labels = array(
		'dashboard'       => 'Tableau de bord',
		'orders'          => 'Commandes',
		'downloads'       => 'Téléchargements',
		'edit-address'    => 'Adresses',
		'payment-methods' => 'Moyens de paiement',
		'edit-account'    => 'Détails du compte',
		'customer-logout' => 'Déconnexion',
	);

	foreach ( $labels as $key => $label ) {
		if ( isset( $items[ $key ] ) ) {
			$items[ $key ] = $label;
		}
	}

	return $items;
}
add_filter( 'woocommerce_account_menu_items', 'cdm_account_menu_items', 20 );

function cdm_return_to_shop_redirect(): string {
	return cdm_front_url( 'fr/cordes' );
}
add_filter( 'woocommerce_return_to_shop_redirect', 'cdm_return_to_shop_redirect' );

function cdm_zero_local_pickup_shipping_rates( array $rates, array $package ): array {
	unset( $package );

	foreach ( $rates as $rate ) {
		if ( ! $rate instanceof WC_Shipping_Rate ) {
			continue;
		}

		if ( ! in_array( $rate->get_method_id(), array( 'local_pickup', 'pickup_location' ), true ) ) {
			continue;
		}

		$rate->set_cost( 0 );
		$rate->set_taxes( array_map( static fn () => 0, $rate->get_taxes() ) );
	}

	return $rates;
}
add_filter( 'woocommerce_package_rates', 'cdm_zero_local_pickup_shipping_rates', 100, 2 );
