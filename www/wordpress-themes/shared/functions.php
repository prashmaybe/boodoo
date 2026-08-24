<?php
/**
 * Budu Theme Framework Functions & Definitions
 *
 * @package Budu
 * @version 1.0.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! function_exists( 'budu_theme_setup' ) ) :
	function budu_theme_setup() {
		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		// Let WordPress manage the document title.
		add_theme_support( 'title-tag' );

		// Enable support for Post Thumbnails on posts and pages.
		add_theme_support( 'post-thumbnails' );

		// Add support for Block Styles.
		add_theme_support( 'wp-block-styles' );

		// Add support for full and wide align images.
		add_theme_support( 'align-wide' );

		// Add support for responsive embeds.
		add_theme_support( 'responsive-embeds' );

		// Add support for editor styles.
		add_theme_support( 'editor-styles' );
		add_editor_style( 'https://boodoo.dihadiwala.com/dist/css/boodoo.min.css' );

		// Register Navigation Menus
		register_nav_menus(
			array(
				'primary' => __( 'Primary Menu', 'budu' ),
				'footer'  => __( 'Footer Menu', 'budu' ),
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'budu_theme_setup' );

/**
 * Enqueue scripts and styles.
 */
function budu_theme_scripts() {
	// Budu Framework Core CSS
	wp_enqueue_style( 'budu-core', 'https://boodoo.dihadiwala.com/dist/css/boodoo.min.css', array(), '1.0.2' );

	// Theme Main Stylesheet
	wp_enqueue_style( 'budu-style', get_stylesheet_uri(), array( 'budu-core' ), '1.0.2' );

	// Budu Framework JS
	wp_enqueue_script( 'budu-js', 'https://boodoo.dihadiwala.com/dist/js/boodoo.js', array(), '1.0.2', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'budu_theme_scripts' );

/**
 * Register widget areas.
 */
function budu_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'Sidebar Widget Area', 'budu' ),
			'id'            => 'sidebar-main',
			'description'   => __( 'Add widgets here to appear in your sidebar.', 'budu' ),
			'before_widget' => '<div id="%1$s" class="card mb-4 shadow-sm widget %2$s"><div class="card-body">',
			'after_widget'  => '</div></div>',
			'before_title'  => '<h5 class="card-title fw-bold border-bottom pb-2 mb-3">',
			'after_title'   => '</h5>',
		)
	);

	register_sidebar(
		array(
			'name'          => __( 'Footer Column 1', 'budu' ),
			'id'            => 'footer-1',
			'before_widget' => '<div id="%1$s" class="widget %2$s mb-3">',
			'after_widget'  => '</div>',
			'before_title'  => '<h6 class="fw-bold mb-3 text-uppercase text-muted">',
			'after_title'   => '</h6>',
		)
	);
}
add_action( 'widgets_init', 'budu_widgets_init' );
