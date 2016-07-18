<?php
/*
	Copyright 2014-2016, Mhd Sulhan (ms@kilabit.info)
*/

session_start ();

if (! isset ($_SESSION["you"])) {
	$host = $_SERVER["HTTP_HOST"];
	$uri = rtrim(dirname($_SERVER["PHP_SELF"]), "/\\");
	$extra	= "index.php";

	header ("Location: http://$host$uri/$extra");
	exit;
}

define ("APP_PATH", realpath (dirname (__FILE__) ."/../"));

require_once ("../generate_wui_menu.php");

$wui["journal_dir"] = "journal";
$wui["journal_name"] = "Journal";

function create_node ($path, $title)
{
	if (file_exists ($path)) {
		return;
	}

	mkdir ($path);

	$contents = <<<EOF
<meta name="title" content="$title"/>
EOF;

	file_put_contents ($path."/content.html", $contents);
}

// create path
function make_path ($date)
{
	global $wui;

	$months = [
		"01"	=> "Jan"
	,	"02"	=> "Feb"
	,	"03"	=> "Mar"
	,	"04"	=> "Apr"
	,	"05"	=> "May"
	,	"06"	=> "Jun"
	,	"07"	=> "Jul"
	,	"08"	=> "Aug"
	,	"09"	=> "Sep"
	,	"10"	=> "Oct"
	,	"11"	=> "Nov"
	,	"12"	=> "Dec"
	];

	$d = explode ("-", $date);

	$p = $wui["journal_dir"];

	// create /journal
	create_node (APP_PATH ."/". $p, $wui["journal_name"]);

	// create /journal/year
	$p .= "/". $d[0];
	create_node (APP_PATH . $p, $d[0]);

	// create /journal/year/month
	$p .= "/". $d[1];
	create_node (APP_PATH . $p, $months[$d[1]]);

	return $p;
}

try {
	$node_parent	= $_POST["e_node_parent"];
	$node_name		= $_POST["e_node_name"];
	$e_title		= $_POST["e_title"];
	$e_pub_date		= $_POST["e_publish_date"];
	$e_pub_time		= $_POST["e_publish_time"];
	$e_author		= $_POST["e_author"];
	$e_comment		= $_POST["e_comment"];
	$e_content		= $_POST["e_content"];

	$path = make_path ($e_pub_date);

	if (null === $node_parent || "" === $node_parent) {
		$node_parent = $path;
	}

	// check node name, if empty use date + title
	if (null === $node_name || "" === $node_name) {
		$node_name = trim ( preg_replace ("/[^a-zA-Z0-9]/", "_", $e_title) , "_" );
	}

	if (null === $e_pub_time || "" === $e_pub_time) {
		$e_pub_time = "00:00:00";
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
<meta name="title" content="$e_title">
<meta name="publish_date" content="$e_pub_date $e_pub_time">
<meta name="author" content="$e_author">
$e_content
EOF;

	file_put_contents ($node ."/content.html", $contents);

	// check for comments
	$fcomment = $node ."/comment.json";
	$fcomment_bak = $node ."/comment.json.bak";

	if ($e_comment === "true") {
		// if comment allow and bak file exist, rename bak to comment back.
		if (file_exists ($fcomment_bak)) {
			rename ($fcomment_bak, $fcomment);
		// or create new comment file.
		} else if (! file_exists ($fcomment)) {
			file_put_contents ($fcomment, "[]");
		}
	} else {
		// if comment is not allowed check for existing comment file
		// and rename it to .bak.
		if (file_exists ($fcomment)) {
			rename ($fcomment, $fcomment_bak);
		}
	}

	// reindex
	$wui["contents_dir"] = "..";

	generate_menu ("..");

	$r["success"] = true;
	$r["msg"] = "Data has been saved.";
} catch (Exception $e) {
	$r["success"] = false;
	$r["msg"] = addslashes ($e->getMessage ());
}

header('Content-Type: application/json');
echo json_encode ($r);
