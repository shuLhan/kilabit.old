<?php
/*
	This feed generated using format based on
	http://atomenabled.org/developers/syndication/
 */

// find all index.html in all directories
$feed_src		= "../journal";
$feed_src_cut	= ".";
$feed_url		= "http://kilabit.info";

$dir	= new RecursiveDirectoryIterator ($feed_src);
$nodes	= new RecursiveIteratorIterator ($dir);
$findex	= [];

foreach ($nodes as $name => $node) {
	if ($node->getFilename() !== 'index.html') {
		continue;
	}

	// check if index contain body.
	$html = simplexml_load_file ($node->getPathname ());

	if (! $html) {
		continue;
	}

	if (count ($html->body) <= 0) {
		continue;
	}

	$i			= [];
	$i["path"]	= $node->getPathname ();
	$i["mtime"]	= $node->getMTime ();

	$findex[] = $i;
}

// sort index by modified time.
array_multisort ($findex[1], SORT_DESC, SORT_NUMERIC
				,$findex[0], SORT_ASC, SORT_STRING);

// take only ten of them.
$findex = array_slice ($findex, 0, 10);

// built atom
$atom = new SimpleXMLElement ("<feed xmlns=\"http://www.w3.org/2005/Atom\"></feed>");

$atom->addChild ("id", $feed_url);
$atom->addChild ("title","Kilabit | Journal");
$atom->addChild ("link")->addAttribute ("href", $feed_url);
$atom->addChild ("author")->addChild ("name", "Mhd Sulhan");

foreach ($findex as $k => $fin) {
	$entry = $atom->addChild ("entry");

	$html = simplexml_load_file ($fin["path"]);

	// get title from html meta,
	$title = $html->xpath ("head/meta[@name='title']");

	if (count ($title) <= 0) {
		// or from html title tag,
		$title = $html->title;

		if (count ($title) <= 0) {
			// or from index path
			$title = $fin["path"];
		}
	} else {
		$title = $title[0]["content"];
	}

	// get link by cutting index path.
	$link = $feed_url . ltrim ($fin["path"], $feed_src_cut);

	// get update time.
	$updated = date ("c", $fin["mtime"]);

	// use the first entry as the feed update time.
	if ($k === 0) {
		$atom->addChild ("updated", $updated);
	}

	// fix image src in content.
	$imgs = $html->body->xpath ("img");

	foreach ($imgs as &$img) {
		$img["src"]= rtrim ($link, "index.html") . ltrim ($img["src"], "./");
	}

	$content = ltrim ($html->body->asXML (), "<body>");
	$content = rtrim ($content, "</body>");

	

	$entry->addChild ("id", $link);

	$entry_link = $entry->addChild ("link");
	$entry_link->addAttribute ("ref", "alternate");
	$entry_link->addAttribute ("href", $link);

	$entry->addChild ("title", $title);
	$entry->addChild ("published", $updated);
	$entry->addChild ("updated", $updated);
	$entry->addChild ("content", $content)->addAttribute ("type", "html");
}

header ("Content-type: application/atom+xml");
echo $atom->asXML ();
