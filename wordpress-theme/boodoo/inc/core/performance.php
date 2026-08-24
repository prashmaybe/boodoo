<?php
/**
 * Boodoo Performance Optimizations
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Clean head output for performance and speed
function boodoo_clean_head() {
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'start_post_rel_link' );
	remove_action( 'wp_head', 'index_rel_link' );
	remove_action( 'wp_head', 'adjacent_posts_rel_link' );
}
add_action( 'init', 'boodoo_clean_head' );

// Add font preloads to head
function boodoo_preload_assets() {
	echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>' . "\n";
	echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
}
add_action( 'wp_head', 'boodoo_preload_assets', 1 );
