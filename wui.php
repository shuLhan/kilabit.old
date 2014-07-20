<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "config.php";

function is_cli()
{
	if (defined('STDIN'))
	{
		return true;
	}

	if (empty($_SERVER['REMOTE_ADDR'])
	&& !isset($_SERVER['HTTP_USER_AGENT'])
	&& count($_SERVER['argv']) > 0)
	{
		return true;
	}

	return false;
}

function get_meta (&$m, $p, $id)
{
	$xml	= simplexml_load_file ($p);
	$title	= null;
	$perma	= null;
	$body	= null;
	$head	= null;

	foreach ($xml->head[0]->meta as $meta) {
		switch ((string) $meta["name"]) {
		case "title":
			$title = (string) $meta["content"];
			break;
		case "permalink":
			$perma = (string) $meta["content"];
			break;
		}
	}

	// if body exist mark as loaded.
	if (count ($xml->body) > 0) {
		$m["load"] = true;
	} else {
		$m["load"] = false;
	}

	if (null === $title) {
		$m["title"] = $id;
	} else {
		$m["title"] = $title;
	}

	if (null === $xml->body) {
		$m["link"] = "";
	} else {
		$m["link"] = substr ($p, 2);
	}

	if (null === $perma) {
		$meta = $xml->head->addChild ("meta");
		$meta->addAttribute ("name", "permalink");
		$meta->addAttribute ("content", $p);
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
	global $wui;

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

		if (in_array (substr ($p, 2), $wui["contents_exclude"])) {
			continue;
		}

		$findex = $p."/index.html";

		if (! file_exists ($findex)) {
			continue;
		}

		$id = $pid."-".$f;

		$menu[$idx]			= [];
		$menu[$idx]["id"]	= $id;
		$menu[$idx]["pid"]	= $pid;

		get_meta ($menu[$idx], $findex, $id);

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

	$fmenu = fopen ("js/wui_menu.js", "wb");

	fwrite ($fmenu, "var wui_menu = ");
	fwrite ($fmenu, json_encode ($menu, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
	fwrite ($fmenu, ";");

	fclose ($fmenu);
}

if (is_cli ()) {
	generate_menu ($argv[1]);
} else {
	generate_menu ($wui["contents_dir"]);
}
