#!/bin/bash

OTHER="0"
COMPONENTS="0"

while read LINE
do
 if [ -z "$LINE" ]; then
  break
 fi
 if [[ $LINE == *server* ]]; then
  npx rspack --env.entry=/server/${LINE##*/} --mode=production
 echo $LINE
 else
  if [[ $LINE == *components* ]]; then
   COMPONENTS="1"
  else
   OTHER="1"
  fi
 fi
done
if [[ $COMPONENTS == "1" ]]; then
  npx rspack --env.entry=/components/index.tsx --mode=production
fi
if [[ $OTHER == "1" ]]; then
  npx vtecxutil upload
fi
