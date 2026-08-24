<?php
/**
 * Boodoo WordPress Theme Bootstrap
 *
 * @package Boodoo
 * @version 1.0.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define Theme Constants
define( 'BOODOO_VERSION', '1.0.2' );
define( 'BOODOO_DIR', get_template_directory() );
define( 'BOODOO_URI', get_template_directory_uri() );

// Core System Modules
require_once BOODOO_DIR . '/inc/core/setup.php';
require_once BOODOO_DIR . '/inc/core/assets.php';
require_once BOODOO_DIR . '/inc/core/performance.php';
require_once BOODOO_DIR . '/inc/core/accessibility.php';
require_once BOODOO_DIR . '/inc/core/security.php';

// Admin Modules
if ( is_admin() ) {
	require_once BOODOO_DIR . '/inc/admin/dashboard.php';
}

// Integrations & Features
require_once BOODOO_DIR . '/inc/integrations/woocommerce.php';
require_once BOODOO_DIR . '/inc/integrations/schema.php';
require_once BOODOO_DIR . '/inc/features/breadcrumbs.php';
require_once BOODOO_DIR . '/inc/features/social.php';
require_once BOODOO_DIR . '/inc/features/search.php';

// Register Custom Block Pattern Categories
function boodoo_register_pattern_categories() {
	if ( function_exists( 'register_block_pattern_category' ) ) {
		register_block_pattern_category(
			'boodoo-marketing',
			array( 'label' => __( 'Boodoo Marketing', 'boodoo' ) )
		);
		register_block_pattern_category(
			'boodoo-headers',
			array( 'label' => __( 'Boodoo Headers', 'boodoo' ) )
		);
		register_block_pattern_category(
			'boodoo-footers',
			array( 'label' => __( 'Boodoo Footers', 'boodoo' ) )
		);
	}
}
add_action( 'init', 'boodoo_register_pattern_categories' );
