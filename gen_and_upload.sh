#!/bin/sh

php ./generate_wui_menu.php ./
php ./generate_feed.php
php ./generate_sitemap_txt.php .

./lftp-update.sh js/wui_menu.js
./lftp-update.sh feed.atom
./lftp-update.sh sitemap.txt
