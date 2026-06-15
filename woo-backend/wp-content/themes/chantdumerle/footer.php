<?php
/**
 * Site footer.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<footer class="site-footer">
	<div class="site-footer__inner">
		<p class="site-footer__brand"><?php esc_html_e( 'Le Chant du Merle', 'chantdumerle' ); ?></p>

		<ul class="site-footer__links">
			<?php foreach ( cdm_footer_links() as $link ) : ?>
				<li>
					<a href="<?php echo esc_url( $link['url'] ); ?>"><?php echo esc_html( $link['label'] ); ?></a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
