#!/bin/sh

lftp -e "mirror -R --verbose=3 --delete; exit;" -p 22 -u kilatinf sftp://ftp.kilabit.info/home/kilatinf/public_html/
