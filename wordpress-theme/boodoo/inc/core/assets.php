<?php
/**
 * Boodoo Asset Enqueueing
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function boodoo_enqueue_assets() {
	// Google Fonts Inter and JetBrains Mono
	wp_enqueue_style(
		'boodoo-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
		array(),
		null
	);

	// Boodoo Framework Minified CSS
	wp_enqueue_style(
		'boodoo-framework-css',
		'https://boodoo.dihadiwala.com/dist/css/boodoo.min.css',
		array(),
		BOODOO_VERSION
	);

	// Theme Main Stylesheet
	wp_enqueue_style(
		'boodoo-theme-style',
		get_stylesheet_uri(),
		array( 'boodoo-framework-css' ),
		BOODOO_VERSION
	);

	// Boodoo Framework Minified JS
	wp_enqueue_script(
		'boodoo-framework-js',
		'https://boodoo.dihadiwala.com/dist/js/boodoo.js',
		array(),
		BOODOO_VERSION,
		true
	);

	// Comment Reply JS
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'boodoo_enqueue_assets' );
