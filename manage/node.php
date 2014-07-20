<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
define ("APP_PATH", realpath (dirname (__FILE__) ."/../"));

$node_parent = $_POST["node_parent"];
$node_name = $_POST["node_name"];
$node_title = $_POST["node_title"];

// replace '-' with '/'
$node_parent = str_replace ("-", "/", $node_parent);

if ("" === $node_parent) {
	$node_parent = "/";
}

$node = APP_PATH . $node_parent ."/". $node_name;

// check if directory is exist
if (! file_exists ($node)) {
	mkdir ($node);
}

$content = <<<EOF
<html>
<head>
<meta name="title" content="$node_title"/>
</head>
</html>
EOF;

file_put_contents ($node ."/index.html", $content);

$r["success"] = true;

header('Content-Type: application/json');
echo json_encode ($r);
