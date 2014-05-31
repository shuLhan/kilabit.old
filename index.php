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
		<div id="wui_header" class="col-md-12">
			<span class="title"> kilabit.info </span>
			<span class="subtitle"> Simple | Small | Stable | Secure </span>
		</div>

		<div id="wui_menu" class="col-md-12">
		</div>

		<div id="wui_content" class="col-md-12">
		</div>

		<div id="wui_footer" class="col-md-12">
			<hr/>
			<span class="footer"> 2014 - kilabit.info </span>
		</div>
	</div>

	<script src="js/jquery.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/wui_menu.js"></script>
	<script src="js/wui.js"></script>
	<script>
		WUI.homepage = "<?= $wui["homepage"] ?>";
		WUI.run ();
	</script>
</body>
</html>
