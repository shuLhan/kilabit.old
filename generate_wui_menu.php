<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

if (! defined ("APP_PATH")) {
	define ("APP_PATH", realpath (dirname (__FILE__)));
}

require_once("is_cli.php");

if (is_cli()) {
	generate_menu ($argv[1]);
}

function get_meta (&$m, $base, $p, $id)
{
	$doc	= new DOMDocument ();
	$title	= null;
	$perma	= null;
	$body	= null;
	$head	= null;

	// load html file and suppress warning messages.
	@$doc->loadHTMLFile ($p);

	$metas = $doc->getElementsByTagName ("meta");

	foreach ($metas as $meta) {
		switch ($meta->getAttribute ("name")) {
		case "title":
			$title = $meta->getAttribute ("content");
			break;
		case "permalink":
			$perma = $meta->getAttribute ("content");
			break;
		}
	}

	// if body exist mark as loaded.
	$body = $doc->getElementsByTagName ("body");

	if ($body->length > 0) {
		$m["load"] = true;
	} else {
		$m["load"] = false;
	}

	if (null === $title) {
		// get title from title
		$title = $doc->getElementsByTagName ("title");
		$m["title"] = null === $title ? $id : $title->item(0)->nodeValue;
	} else {
		$m["title"] = $title;
	}

	if (null === $body) {
		$m["base"] = "";
		$m["link"] = "";
	} else {
		$m["base"] = substr ($base, 2);
		$m["link"] = substr ($p, 2);
	}

	if (null === $perma) {
		$head = $doc->getElementsByTagName ("head")->item (0);

		$meta = $doc->createElement ("meta");

		$meta->setAttribute ("name", "permalink");
		$meta->setAttribute ("content", $p);

		$head->appendChild ($meta);
	}
}

/*
 * List all files in directory $dir recursively.
 */
function list_dir ($dir, $pid)
{
	$idx	= 0;
	$menu	= [];
	$files	= scandir ($dir);

	foreach ($files as $f) {
		if ($f === ".") {
			continue;
		}
		if ($f === "..") {
			continue;
		}

		$p = $dir."/".$f;

		if (! is_dir ($p)) {
			continue;
		}

		// skip directory with .ignore file
		$fignore = $p ."/.ignore";

		if (file_exists ($fignore)) {
			continue;
		}

		$findex = $p."/content.html";

		if (! file_exists ($findex)) {
			continue;
		}

		$id = $pid."-".$f;

		$menu[$idx]			= [];
		$menu[$idx]["id"]	= $id;
		$menu[$idx]["pid"]	= $pid;

		$fcomment = $p."/comment.json";

		if (file_exists ($fcomment)) {
			$menu[$idx]["comment"] = true;
		} else {
			$menu[$idx]["comment"] = false;
		}

		get_meta ($menu[$idx], $p, $findex, $id);

		$submenu = list_dir ($p, $id);

		$menu[$idx]["submenu"] = $submenu;

		$idx++;
	}

	return $menu;
}

function generate_menu ($dir)
{
	$menu = list_dir ($dir, "");

	array_multisort ($menu);

	$fmenu = fopen ($dir. "/js/wui_menu.js", "wb");

	fwrite ($fmenu, "var wui_menu = "
					. json_encode ($menu, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
					. ";");

	fclose ($fmenu);
}
