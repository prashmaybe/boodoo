<?php
/**
 * Boodoo Breadcrumbs Feature
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function boodoo_breadcrumbs() {
	if ( is_front_page() ) {
		return;
	}

	echo '<nav aria-label="breadcrumb" class="my-3">';
	echo '<ol class="breadcrumb bg-light p-2 rounded-3">';
	echo '<li class="breadcrumb-item"><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'boodoo' ) . '</a></li>';

	if ( is_category() || is_single() ) {
		echo '<li class="breadcrumb-item">';
		the_category( ' / ' );
		echo '</li>';
		if ( is_single() ) {
			echo '<li class="breadcrumb-item active" aria-current="page">' . esc_html( get_the_title() ) . '</li>';
		}
	} elseif ( is_page() ) {
		echo '<li class="breadcrumb-item active" aria-current="page">' . esc_html( get_the_title() ) . '</li>';
	}

	echo '</ol>';
	echo '</nav>';
}
