<?php
/**
 * Header Template for Budu WordPress Themes
 */
?>
<!doctype html>
<html <?php language_attributes(); ?> data-boodoo-theme="light">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'bg-light text-dark' ); ?>>
<?php wp_body_open(); ?>

<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
	<div class="container">
		<a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary fs-4" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<span>⚡ <?php bloginfo( 'name' ); ?></span>
		</a>
		<button class="navbar-toggler border-0" type="button" data-boodoo-toggle="collapse" data-boodoo-target="#buduWpNav" aria-controls="buduWpNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="buduWpNav">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'navbar-nav ms-auto mb-2 mb-lg-0 fw-medium',
					'fallback_cb'    => false,
				)
			);
			?>
		</div>
	</div>
</nav>
