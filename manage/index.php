<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
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
	<title>WUI! | Manage</title>
</head>
<body>
	<div class="container">
		<form
			class="form-manage"
			role="form"
			action="login.php"
			method="post"
		>
			<h2>Manage Your Wui!</h2>
			<input
				name="u"
				type="text"
				class="form-control"
				placeholder="Username"
				required
				autofocus>
			<input
				name="p"
				type="password"
				class="form-control"
				placeholder="Password"
				required>
			<button
				type="submit"
				class="btn btn-primary btn-block"
			>Manage
			</button>
		</form>
	</div>
	<script src="/js/jquery.min.js"></script>
	<script src="/js/bootstrap.min.js"></script>
</body>
</html>
