#!/bin/sh

lftp -e "mirror -X '.git/*' -X '_kemxtri/*' -X '_sima/*' -R --verbose=3 --delete; exit;" -p 22 -u kilatinf sftp://ftp.kilabit.info/home/kilatinf/public_html/
