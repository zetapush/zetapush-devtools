#!/bin/bash

set -e

hash=$(git rev-parse --verify HEAD)
artifact="devtools.zpush.io--$hash.tar.gz"
file=./archives/$artifact

if [ -f $file ]; then
   echo "[LOG] Artifact already exists"
else
  echo "[LOG] Build application"
  yarn run build:optimized --base-href=/
  echo "[LOG] Clean previous packaged applications"
  rm -f $file
  echo "[LOG] Package application"
  cd ./dist
  echo "[LOG] Generate artifact $artifact"
  tar cvfz .$file ./**
  echo "[LOG] Deploy application on webserver"
  rsync -azv ./** ubuntu@devtools.zpush.io:/var/www/devtools.zpush.io/
fi
