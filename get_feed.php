<?php
/*
 * Get data from other domains.
 */
$xml = file_get_contents ($_GET["url"]);

if (! $xml) {
	return "";
}

echo $xml;
