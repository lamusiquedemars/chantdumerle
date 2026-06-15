<?php
/**
 * Site header.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
	<div class="site-header__inner">
		<a class="site-brand" href="<?php echo esc_url( cdm_front_url( 'fr' ) ); ?>">
			<img
				class="site-brand__logo"
				src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/logo-cdm.png' ); ?>"
				alt="<?php echo esc_attr__( 'Le Chant du Merle', 'chantdumerle' ); ?>"
				width="604"
				height="652"
			>
			<span class="site-brand__label"><?php esc_html_e( 'Le Chant du Merle', 'chantdumerle' ); ?></span>
		</a>

		<button
			class="menu-toggle"
			type="button"
			aria-controls="site-navigation"
			aria-expanded="false"
		>
			<span><?php esc_html_e( 'Menu', 'chantdumerle' ); ?></span>
			<span class="menu-toggle__icon" aria-hidden="true">
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>

		<nav id="site-navigation" class="site-nav" aria-label="<?php echo esc_attr__( 'Navigation principale', 'chantdumerle' ); ?>">
			<ul class="site-nav__list">
				<?php foreach ( cdm_primary_nav_items() as $item ) : ?>
					<li class="site-nav__item">
						<a
							class="site-nav__link <?php echo ! empty( $item['icon_only'] ) ? 'site-nav__link--icon' : ''; ?>"
							href="<?php echo esc_url( $item['url'] ); ?>"
							<?php echo ! empty( $item['active'] ) ? 'aria-current="page"' : ''; ?>
							<?php echo ! empty( $item['icon_only'] ) ? 'aria-label="' . esc_attr( $item['label'] ) . '" title="' . esc_attr( $item['label'] ) . '"' : ''; ?>
						>
							<?php if ( isset( $item['icon'] ) ) : ?>
								<?php cdm_nav_icon( $item['icon'] ); ?>
							<?php endif; ?>
							<span class="<?php echo ! empty( $item['icon_only'] ) ? 'screen-reader-text' : ''; ?>">
								<?php echo esc_html( $item['label'] ); ?>
							</span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</nav>
	</div>
</header>
