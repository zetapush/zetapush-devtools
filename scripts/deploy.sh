#!/bin/bash

set -e

revision=$(git rev-parse --verify HEAD)
artifact="devtools.zpush.io--$revision.tar.gz"
file=./archives/$artifact
project=zetapush-devtools

if [ -f $file ]; then
   echo "[LOG] Artifact already exists"
else
  mkdir -p ./archives
  echo "[LOG] Build application"
  yarn run build --prod --base-href=/
  echo "[LOG] Inject revision in built ouput"
  echo $revision > ./dist/$project/revision.txt
  echo "[LOG] Package application"
  cd ./dist/$project
  echo "[LOG] Generate artifact $artifact"
  tar cvfz ../.$file ./**
  echo "[LOG] Deploy application on webserver"
  rsync -azv ./** ubuntu@devtools.zpush.io:/var/www/devtools.zpush.io/
fi
