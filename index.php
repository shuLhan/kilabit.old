<?php
	require_once "wui.php"
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="css/bootstrap.min.css"/>
	<link rel="stylesheet" href="css/wui.css"/>
	<link rel="shortcut icon" href="favicon.ico"/>
	<title> WUI! </title>
</head>

<body>
	<div class="container">
		<div class="row">
			<div id="wui_header" class="col-sm-12">
				<div class="row">
					<div id="wui_header_left" class="col-sm-6 text-left">
						<div class="title"> kilabit.info </div>
						<div class="subtitle"> Simple | Small | Stable | Secure </div>
					</div>
					<div id="wui_header_right" class="col-sm-6 text-right">
						<div id="wui_social_icon">
						</div>
					</div>
				</div>
			</div>
		</div>
		<hr/>

		<div class="row">
			<div id="wui_menu" class="col-md-12">
			</div>
		</div>

		<div class="row">
			<div id="wui_content" class="col-md-12">
			</div>
		</div>

		<div class="row">
			<div id="wui_footer" class="col-sm-12">
				<div class="row">
					<div id="wui_footer_left" class="col-sm-6 text-left">
					</div>
					<div id="wui_footer_right" class="col-sm-6 text-right">
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="js/jquery.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/wui_menu.js"></script>
	<script src="js/wui.js"></script>
	<script>
		WUI.homepage = "<?= $wui["homepage"] ?>";
		WUI.social_icon	= <?php
				echo json_encode ($wui["social_icon"]
							, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
			?>;
		WUI.run ();
	</script>
</body>
</html>
