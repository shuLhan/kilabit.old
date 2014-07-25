<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	require_once "wui.php";

	run ($wui);

	if (isset ($_GET["open"])) {
		$open = str_replace ("/index.html", "", $_GET["open"]);
		$open = rtrim ($open, "/");
	} else {
		$open = "";
	}

	if ("" === $open) {
		$link = $wui["homepage"];
	} else {
		$link = $open;
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="/css/bootstrap.min.css"/>
	<link rel="stylesheet" href="/css/wui.css"/>
	<link rel="shortcut icon" href="favicon.ico"/>
	<title><?= $wui["title"] ?></title>
</head>

<body>
	<div class="container">
		<div class="row">
			<div id="wui_header" class="col-sm-12">
				<div class="row">
					<div id="wui_header_left" class="col-sm-6 text-left">
						<div class="title"><?= $wui["title"] ?></div>
						<div class="subtitle"><?= $wui["subtitle"] ?></div>
					</div>
					<div id="wui_header_right" class="col-sm-6 text-right">
						<div id="wui_social_icon">
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div id="wui_menu" class="col-sm-12">
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12">
				<div id="wui_content"></div>
				<table
					id="wui_content_meta"
					class="table table-condensed"
				>
				</table>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12">
				<div class="row">
					<div id="wui_footer">
						<div id="wui_footer_left" class="col-sm-6 text-left">
						</div>
						<div id="wui_footer_right" class="col-sm-6 text-right">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="/js/jquery.min.js"></script>
	<script src="/js/bootstrap.min.js"></script>
	<script src="/js/wui_menu.js"></script>
	<script src="/js/wui.js"></script>
	<script>
		WUI.homepage = "<?= $link ?>";
		WUI.contents_exclude = <?php
				echo json_encode ($wui["contents_exclude"]
							, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
			?>;
		WUI.social_icon	= <?php
				echo json_encode ($wui["social_icon"]
							, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
			?>;
		WUI.run ();
	</script>
</body>
</html>
