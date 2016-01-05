#!/bin/sh

node=${1-"."}
user=kilatinf
url=sftp://kilabit.info/home/kilatinf/public_html/

if [ -d $node ]; then
	echo "update directory $node"
	lftp -e "mkdir -pf $node; cd $node; lcd $node; mirror -R --verbose=3 -X '.git/*' --delete; exit;" -p 22 -u ${user} --env-password ${url}
else
	dir=`dirname $node`
	echo "update file $node on $dir"
	lftp -e "mkdir -pf $dir; cd $dir; put $node; exit;" -p 22 -u ${user} --env-password ${url}
fi
