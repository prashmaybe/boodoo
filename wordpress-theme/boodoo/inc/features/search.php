<?php
/**
 * Boodoo Search Module
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function boodoo_custom_search_form( $form ) {
	$form = '
	<form role="search" method="get" class="d-flex gap-2 my-2" action="' . esc_url( home_url( '/' ) ) . '">
		<input type="search" class="form-control rounded-pill px-3" placeholder="' . esc_attr__( 'Search site...', 'boodoo' ) . '" value="' . get_search_query() . '" name="s" />
		<button type="submit" class="btn btn-primary rounded-pill px-4">' . esc_html__( 'Search', 'boodoo' ) . '</button>
	</form>';
	return $form;
}
add_filter( 'get_search_form', 'boodoo_custom_search_form' );
