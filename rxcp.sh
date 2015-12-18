#!/bin/bash

function send() {
    if [ -d $3 ]; then
        echo "$3 is a directory."
        curl -H "Authorization: Token "$1 -H "Content-Type:"$4 -H "Content-Length: 0" -X PUT $2$5?_content
    else
        curl -H "Authorization: Token "$1 -H "Content-Type:"$4 -T $3 $2$5$6
        fi
    echo -e '\n'
}

for file in `find $2`
do
echo -n $file' --> '

type="application/octet-stream"

case ${file##*/*.} in
  "json" ) type="application/json" ;;
  "xml" ) type="text/xml" ;;
  "html" ) type="text/html;charset=UTF-8" ;;
  "js" ) type="text/javascript;charset=UTF-8" ;;
  "css" ) type="text/css;charset=UTF-8" ;;
  "png" ) type="image/png" ;;
  "gif" ) type="image/gif" ;;
  "jpeg" ) type="image/jpeg" ;;
  "jpg" ) type="image/jpeg" ;;
esac

tgt=${file#$2}
echo -n $3$tgt'   '

opt=""
if [ -n "$4" ]; then
   opt=?_$4
fi

send $1 $3 $file $type $tgt $opt
done

