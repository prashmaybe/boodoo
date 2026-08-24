<?php
/**
 * Footer Template for Budu WordPress Themes
 */
?>
<footer class="bg-dark text-white pt-5 pb-4 mt-5">
	<div class="container">
		<div class="row g-4 mb-4">
			<div class="col-md-6">
				<h5 class="text-white fw-bold mb-3"><?php bloginfo( 'name' ); ?></h5>
				<p class="text-muted small"><?php bloginfo( 'description' ); ?></p>
			</div>
			<div class="col-md-6 text-md-end">
				<p class="text-muted small mb-0">Powered by <a href="https://boodoo.dihadiwala.com" class="text-white text-decoration-underline" target="_blank">Budu Framework</a> & WordPress</p>
			</div>
		</div>
		<hr class="border-secondary opacity-25">
		<div class="text-center text-muted small">
			&copy; <?php echo date( 'Y' ); ?> <?php bloginfo( 'name' ); ?>. All rights reserved.
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
<!-- Live Budu WordPress Theme Interactive Layout Component -->
