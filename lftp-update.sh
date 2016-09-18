#!/bin/sh

node=${1-"."}
url=sftp://kilabit.info/home/kilabiti/public_html/

if [ -d $node ]; then
	echo "update directory $node"
	lftp -e "mkdir -pf $node; cd $node; lcd $node; mirror -R --verbose=1 -X '.git/*' -X 'manage/*' --delete; exit;" -d ${url}
else
	dir=`dirname $node`
	echo "update file $node on $dir"
	lftp -e "mkdir -pf $dir; cd $dir; put $node; exit;" -d ${url}
fi
