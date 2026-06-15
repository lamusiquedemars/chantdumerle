<?php
/**
 * WooCommerce wrapper template.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main class="site-main">
	<header class="page-header">
		<h1 class="page-title"><?php woocommerce_page_title(); ?></h1>
	</header>
	<?php woocommerce_content(); ?>
</main>
<?php
get_footer();
