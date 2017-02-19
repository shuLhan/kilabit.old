.PHONY: all upload journal

DIR=${DIR}

all: build

build:
	php ./generate_wui_menu.php ./
	php ./generate_feed.php
	php ./generate_sitemap_txt.php .

upload: build
	./lftp-update.sh js/wui_menu.js
	./lftp-update.sh feed.atom
	./lftp-update.sh sitemap.txt

journal:
	@echo ">>> Updating $(DIR) ..."
	./lftp-update.sh $(DIR)
