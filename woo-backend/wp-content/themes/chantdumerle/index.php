<?php
/**
 * Fallback template.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main class="site-main">
	<?php if ( have_posts() ) : ?>
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<header class="page-header">
					<h1 class="page-title"><?php the_title(); ?></h1>
				</header>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
			</article>
		<?php endwhile; ?>
	<?php else : ?>
		<header class="page-header">
			<h1 class="page-title"><?php esc_html_e( 'Page introuvable', 'chantdumerle' ); ?></h1>
		</header>
	<?php endif; ?>
</main>
<?php
get_footer();
