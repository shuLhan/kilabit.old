<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once ("../wui.php");

define ("APP_PATH", realpath (dirname (__FILE__) ."/../"));

try {
	$node_parent = $_POST["e_node_parent"];
	$node_name = $_POST["e_node_name"];
	$e_title = $_POST["e_title"];
	$e_pub_date = $_POST["e_publish-date"];
	$e_author = $_POST["e_author"];
	$e_content = $_POST["e_content"];

	// check node name, if empty use date + title
	if (null === $node_name || "" === $node_name) {
		$node_name = str_replace ("-", "_", $e_title);
		$node_name = str_replace (":", "_", $e_title);
		$node_name = str_replace (" ", "_", $node_name);
	}

	// replace '-' with '/'
	$node_parent = str_replace ("-", "/", $node_parent);

	if ("" === $node_parent) {
		$node_parent = "/";
	}

	$node = APP_PATH . $node_parent ."/". $node_name;

	// check if directory is not exist
	if (! file_exists ($node)) {
		mkdir ($node);
	}

	$contents = <<<EOF
<html>
<head>
<meta name="title" content="$e_title"/>
<meta name="publish-date" content="$e_pub_date"/>
<meta name="author" content="$e_author"/>
</head>
<body>
$e_content
</body>
</html>
EOF;

	file_put_contents ($node ."/index.html", $contents);

	// reindex
	$wui["contents_dir"] = "..";
	run ($wui);

	$r["success"] = true;
	$r["msg"] = "Data has been saved.";
} catch (Exception $e) {
	$r["success"] = false;
	$r["msg"] = addslashes ($e->getMessage ());
}

header('Content-Type: application/json');
echo json_encode ($r);
