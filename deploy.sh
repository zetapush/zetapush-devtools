#!/bin/bash

set -e

echo '[LOG] Build application'
yarn run build:optimized --base-href=/
echo '[LOG] Clean previous packaged applications'
rm -f devtools.zpush.io.tar.gz
echo '[LOG] Package application'
cd ./dist
tar cvfz ../devtools.zpush.io.tar.gz ./**
echo '[LOG] Deploy application on webserver'
rsync -azv ./** ubuntu@devtools.zpush.io:/var/www/devtools.zpush.io/
