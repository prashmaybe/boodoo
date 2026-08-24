<?php
/**
 * Boodoo Theme Setup
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function boodoo_setup() {
	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	// Let WordPress manage the document title.
	add_theme_support( 'title-tag' );

	// Enable support for Post Thumbnails on posts and pages.
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 1200, 675, true );

	// Switch default core markup to output valid HTML5.
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
			'navigation-widgets',
		)
	);

	// Add theme support for block editor features.
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );

	// Enqueue editor styles.
	add_editor_style( 'assets/css/boodoo-editor.css' );

	// Register Navigation Menus.
	register_nav_menus(
		array(
			'primary' => __( 'Primary Navigation', 'boodoo' ),
			'footer'  => __( 'Footer Navigation', 'boodoo' ),
			'mobile'  => __( 'Mobile Offcanvas Navigation', 'boodoo' ),
		)
	);
}
add_action( 'after_setup_theme', 'boodoo_setup' );
