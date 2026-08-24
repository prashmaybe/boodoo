<?php
/**
 * Main Template Fallback for Boodoo Theme
 *
 * @package Boodoo
 */

// Block themes rely on templates/index.html for FSE.
// This PHP file serves as a fallback for older environments.
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<main id="primary" class="site-main container py-5">
	<?php
	if ( have_posts() ) :
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'mb-4 p-4 card border-0 shadow-sm rounded-4' ); ?>>
				<h1 class="entry-title fw-bold text-dark mb-3"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
				<div class="entry-content text-secondary">
					<?php the_content(); ?>
				</div>
			</article>
			<?php
		endwhile;
		the_posts_pagination();
	else :
		echo '<p class="alert alert-info rounded-3">' . esc_html__( 'No content found.', 'boodoo' ) . '</p>';
	endif;
	?>
</main>

<?php wp_footer(); ?>
</body>
</html>
