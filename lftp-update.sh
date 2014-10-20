#!/bin/sh

node=${1-"."}

if [ -d $node ]; then
	echo "update directory $node"
	lftp -e "lcd $node; mirror -R --verbose=3 -X '.git/*' --delete; exit;" -p 22 -u kilatinf sftp://ftp.kilabit.info/home/kilatinf/public_html/$node
else
	dir=`dirname $node`
	echo "update file $node on $dir"
	lftp -e "put $node; exit;" -p 22 -u kilatinf sftp://ftp.kilabit.info/home/kilatinf/public_html/$dir/
fi
