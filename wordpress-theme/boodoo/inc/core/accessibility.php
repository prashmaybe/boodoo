<?php
/**
 * Boodoo Accessibility Helpers
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Add skip-to-content link right after body open tag
function boodoo_skip_link() {
	echo '<a class="visually-hidden-focusable btn btn-primary position-absolute top-0 start-0 z-50 p-2" href="#primary">' . esc_html__( 'Skip to content', 'boodoo' ) . '</a>';
}
add_action( 'wp_body_open', 'boodoo_skip_link', 5 );
