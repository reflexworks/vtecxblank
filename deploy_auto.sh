#!/bin/bash

OTHER="0" 
COMPONENTS="0" 

while read LINE
do
 if [ -z "$LINE" ]; then
  break
 fi
 if [[ $LINE == *server* ]]; then 
  npx webpack --env.entry=/server/${LINE##*/} --mode=production --env.externals=false
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
  npx webpack --env.entry=/components/index.tsx --mode=production --env.externals=false
fi
if [[ $OTHER == "1" ]]; then
  npx vtecxutil upload 
fi
