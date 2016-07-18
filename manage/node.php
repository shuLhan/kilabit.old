<?php
/*
	Copyright 2014-2016, Mhd Sulhan (ms@kilabit.info)
*/

session_start ();

if (! isset ($_SESSION["you"])) {
	$host = $_SERVER["HTTP_HOST"];
	$uri = rtrim(dirname($_SERVER["PHP_SELF"]), "/\\");
	$extra	= "index.html";

	header ("Location: http://$host$uri/$extra");
	exit;
}

define ("APP_PATH", realpath (dirname (__FILE__) ."/../"));

require_once ("../generate_wui_menu.php");

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
<meta name="title" content="$node_title"/>
<title>$node_title</title>
EOF;

file_put_contents ($node ."/content.html", $content);

// reindex
$wui["contents_dir"] = "..";

generate_menu("..");

$r["success"] = true;

header('Content-Type: application/json');
echo json_encode ($r);
