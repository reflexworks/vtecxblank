#!/bin/bash

a=()
while read line; do
  a+=("$line")
done < auth.txt

service=${a[0]}
apikey=${a[1]}
id=${a[2]}
pass=${a[3]}

function rxid() {
    local id=$(echo -n $1":"$service)
    local now=`date "+%Y-%m-%dT%H:%M:%S"`
    local now2=$(echo -n ${now//[-:T]/}"P09") 
    local now=$(echo -n $now"+09:00")
    local nonce=`printf "%03x%03x" $RANDOM $RANDOM`
    local idstr=$(echo -n $id|tr '[a-m][n-z][A-M][N-Z][@][!][/][~][+][*]' '[n-z][a-m][N-Z][A-M][!][@][~][/][*][+]')
    local passstr=$(echo -n $2|openssl dgst -sha256 -binary|openssl enc -base64)
    local noncestr=$(echo -n $nonce|openssl enc -base64|tr '[a-m][n-z][A-M][N-Z][@][!][/][~][+][*]' '[n-z][a-m][N-Z][A-M][!][@][~][/][*][+]')
    local PasswordDigest=$(echo -n $apikey$nonce$now$passstr|openssl dgst -sha256 -binary|openssl enc -base64|tr '[a-m][n-z][A-M][N-Z][@][!][/][~][+][*]' '[n-z][a-m][N-Z][A-M][!][@][~][/][*][+]')


    if [ -d $4 ]; then
        echo "$4 is a directory."
        curl -H "Authorization: Token "$now2-$noncestr-$PasswordDigest-$idstr -H "Content-Type:"$5 -H "X-Requested-With: XMLHttpRequest" -H "Content-Length: 0" -X PUT $3$6?_content
    else
        curl -H "Authorization: Token "$now2-$noncestr-$PasswordDigest-$idstr -H "Content-Type:"$5 -H "X-Requested-With: XMLHttpRequest" -T $4 $3$6$7
        fi
    echo -e '\n'
}

for file in `find $1`
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

tgt=${file#$1}
echo -n $2$tgt'   '

opt=""
if [ -n "$3" ]; then
   opt=?_$3
fi

# $1:local(directory) $2:target(path)
# ./rxcp.sh directory http://localhost:8080/d/1/test
rxid $id $pass $2 $file $type $tgt $opt
done

