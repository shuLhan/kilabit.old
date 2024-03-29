<?php
/*
	This feed generated using format based on
	http://atomenabled.org/developers/syndication/
 */

if (! defined ("APP_PATH")) {
	define ("APP_PATH", realpath (dirname (__FILE__)));
}

require_once(APP_PATH ."/is_cli.php");

if (is_cli()) {
	generate_feed();
}

function generate_feed()
{
	// find all content.html in all directories
	$feed_src		= APP_PATH ."/journal";
	$feed_src_cut	= APP_PATH;
	$feed_url		= "http://kilabit.info/";

	$dir	= new RecursiveDirectoryIterator ($feed_src);
	$nodes	= new RecursiveIteratorIterator ($dir);
	$findex	= [];

	foreach ($nodes as $name => $node) {
		if ($node->getFilename() !== 'content.html') {
			continue;
		}

		// check if index contain body.
		$html = new DOMDocument ();
		@$s = $html->loadHTMLFile ($node->getPathname ());

		if (! $s) {
			continue;
		}

		$body = $html->getElementsByTagName ("body");
		if ($body->length <= 0) {
			continue;
		}

		$i			= [];
		$i["path"]	= $node->getPathname ();
		$i["mtime"]	= $node->getMTime ();

		$findex[] = $i;
	}

	// sort index by modified time.
	foreach ($findex as $k => $v) {
		$path[$k]	= $v["path"];
		$mtime[$k]	= $v["mtime"];
	}

	array_multisort ($mtime, SORT_DESC, $path, SORT_ASC, $findex);

	// take only ten of them.
	$findex = array_slice ($findex, 0, 10);

	// built atom
	$atom = new SimpleXMLElement ("<feed xmlns=\"http://www.w3.org/2005/Atom\"></feed>");

	$atom->addChild ("id", $feed_url);
	$atom->addChild ("title","Kilabit | Journal");
	$link = $atom->addChild ("link");
	$link->addAttribute ("type", "text/html");
	$link->addAttribute ("rel", "alternate");
	$link->addAttribute ("href", $feed_url);
	$link = $atom->addChild ("link");
	$link->addAttribute ("rel", "self");
	$link->addAttribute ("href", $feed_url."feed/");
	$link->addAttribute ("type", "application/atom+xml");
	$atom->addChild ("author")->addChild ("name", "Mhd Sulhan");
	$atom->addChild ("updated", date ("c", $mtime[0]));

	$html = new DOMDocument ();

	foreach ($findex as $k => $fin) {
		$entry = $atom->addChild ("entry");

		@$html->loadHTMLFile ($fin["path"]);
		$xpath = new DOMXPath ($html);

		// get title from html meta,
		$titles = $xpath->query ("head/meta[@name='title']");

		if ($titles->length <= 0) {
			// or from html title tag,
			$title = $html->getElementsByTagName ("title");

			if ($title->length <= 0) {
				// or from index path
				$title = $fin["path"];
			}
		} else {
			$title = $titles->item(0)->getAttribute ("content");
		}

		// get link by cutting index path.
		$link = $feed_url . ltrim ($fin["path"], $feed_src_cut);
		$link = str_replace ("/content.html", "", $link);

		// get update time.
		$updated = date ("c", $fin["mtime"]);

		// fix image src in content.
		$imgs = $xpath->query ("img");

		foreach ($imgs as $img) {
			$img->setAttribute ("src", rtrim ($link, "content.html") . ltrim ($img["src"], "./"));
		}

		$body = $html->getElementsByTagName ("body")->item (0);

		$content = $html->saveHTML ($body);
		$content = str_replace (["<body>","</body>"], "", $content);

		$entry->addChild ("id", $link);

		$entry_link = $entry->addChild ("link");
		$entry_link->addAttribute ("rel", "alternate");
		$entry_link->addAttribute ("href", $link);

		$entry->addChild ("title", $title);
		$entry->addChild ("published", $updated);
		$entry->addChild ("updated", $updated);
		$entry->addChild ("content", $content)->addAttribute ("type", "html");
	}

	$fatom = fopen(APP_PATH ."/feed.atom", "wb");

	fwrite($fatom, $atom->asXML());

	fclose($fatom);
}
