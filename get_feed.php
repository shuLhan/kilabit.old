<?php
/*
 * Get data from other domains.
 */
$xml = @file_get_contents ($_GET["url"]);

if (FALSE === $xml) {
	return "";
}

echo $xml;
