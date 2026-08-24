<?php
/**
 * Boodoo Social Helper Module
 *
 * @package Boodoo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function boodoo_social_share_links() {
	$url   = urlencode( get_permalink() );
	$title = urlencode( get_the_title() );

	return array(
		'facebook' => "https://www.facebook.com/sharer/sharer.php?u={$url}",
		'twitter'  => "https://twitter.com/intent/tweet?text={$title}&url={$url}",
		'linkedin' => "https://www.linkedin.com/shareArticle?mini=true&url={$url}&title={$title}",
	);
}
