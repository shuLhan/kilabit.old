<?php
/*
	Copyright 2016 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

if (! defined("APP_PATH")) {
	define("APP_PATH", realpath(dirname(__FILE__)));
}

require_once APP_PATH . "/config.php";

if (is_cli()) {
	generate_sitemap_txt($argv[1]);
}

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

function generate_sitemap_txt($dir)
{
	$indices = list_dir($dir, "");

	array_multisort($indices);

	$fmenu = fopen($dir. "/sitemap.txt", "wb");

	fwrite($fmenu, implode("\n", $indices));

	fclose ($fmenu);
}

/*
 * List all files in directory $dir recursively.
 */
function list_dir($dir)
{
	$idx = 0;
	$indices = [];
	$files = scandir($dir);
	$sitename = "http://kilabit.info/";

	foreach ($files as $f) {
		if ($f === ".") {
			continue;
		}
		if ($f === "..") {
			continue;
		}
		if ($f === "home") {
			continue;
		}


		$p = $dir."/".$f;

		if (! is_dir ($p)) {
			continue;
		}

		// skip directory with .ignore file
		$fignore = $p ."/.ignore";

		if (file_exists($fignore)) {
			continue;
		}

		$findex = $p ."/index.html";

		if (! file_exists($findex)) {
			continue;
		}

		// remove "./"
		$findex = substr($p."/", 2);

		$indices[$idx] = $sitename . $findex;

		$subdir = list_dir($p);

		$indices = array_merge($indices, $subdir);

		$idx = sizeof($indices);
	}

	return $indices;
}

