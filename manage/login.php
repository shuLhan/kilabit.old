<?php
/*
	Copyright 2015 - Mhd Sulhan (ms@kilabit.info)
*/

$u = $_POST["u"];
$p = $_POST["p"];
$go = false;

$shadow = ".login";

$lines	= file ($shadow, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$accs	= [];

foreach ($lines as $k => $v) {
	$w = explode ('=', $v);

	if (($u === trim ($w[0]))
	&& ($p === trim ($w[1]))) {
		$go = true;
		break;
	}
}

$host = $_SERVER['HTTP_HOST'];
$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');

if (! $go) {
	// if no user matched, go back to index
	$extra	= "index.php";
} else {
	session_start ();
	$_SESSION["you"] = $u;
	$_SESSION["email"] = $w[2];
	$extra = "manage.php";
}

header ("Location: http://$host$uri/$extra");
exit;
