<?php
/**
 * Boodoo Theme Admin Dashboard Page
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function boodoo_add_admin_menu() {
	add_theme_page(
		__( 'Boodoo Framework', 'boodoo' ),
		__( 'Boodoo Theme', 'boodoo' ),
		'manage_options',
		'boodoo-dashboard',
		'boodoo_render_admin_dashboard'
	);
}
add_action( 'admin_menu', 'boodoo_add_admin_menu' );

function boodoo_render_admin_dashboard() {
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Boodoo WordPress Theme Platform', 'boodoo' ); ?></h1>
		<p><?php esc_html_e( 'Welcome to Boodoo — the modular, mobile-first design system for WordPress.', 'boodoo' ); ?></p>
		<div style="background:#fff; padding:20px; border-radius:12px; max-width:800px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
			<h3><?php esc_html_e( 'Theme Status & System Information', 'boodoo' ); ?></h3>
			<ul>
				<li><strong><?php esc_html_e( 'Theme Version:', 'boodoo' ); ?></strong> <?php echo esc_html( BOODOO_VERSION ); ?></li>
				<li><strong><?php esc_html_e( 'Full Site Editing:', 'boodoo' ); ?></strong> <?php esc_html_e( 'Active (theme.json enabled)', 'boodoo' ); ?></li>
				<li><strong><?php esc_html_e( 'Framework CDN Status:', 'boodoo' ); ?></strong> <span style="color:green;">✓ Connected</span></li>
			</ul>
			<a href="<?php echo esc_url( admin_url( 'site-editor.php' ) ); ?>" class="button button-primary"><?php esc_html_e( 'Open Site Editor (FSE)', 'boodoo' ); ?></a>
			<a href="https://boodoo.dihadiwala.com/docs/wordpress/overview.html" target="_blank" class="button"><?php esc_html_e( 'View Documentation', 'boodoo' ); ?></a>
		</div>
	</div>
	<?php
}
