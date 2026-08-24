<?php
/**
 * Boodoo Security Helpers
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Disable pingbacks / xmlrpc trackbacks for security
add_filter( 'xmlrpc_enabled', '__return_false' );

// Sanitize user inputs and escaped output helper wrappers
function boodoo_sanitize_text( $string ) {
	return sanitize_text_field( $string );
}
