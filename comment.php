<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
try {
	define ("APP_PATH", realpath (dirname (__FILE__)));

	$c_link		= APP_PATH . $_POST["c_link"];
	$c_content	= $_POST["c_content"];

	$c = [];
	$c["author"] = "";
	$c["email"] = "";
	$c["time"] = time ();
	$c["v"] = $c_content;

	if (! file_exists ($c_link)) {
		$comment = [];
	} else {
		$comment = json_decode (file_get_contents ($c_link));
	}

	array_push ($comment, $c);

	file_put_contents ($c_link
					, json_encode ($comment, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));

	$r["success"] = true;
	$r["msg"] = "Comment has been saved.";
} catch (Exception $e) {
	$r["success"] = false;
	$r["msg"] = addslashes ($e->getMessage ());
}

header('Content-Type: application/json');
echo json_encode ($r);
