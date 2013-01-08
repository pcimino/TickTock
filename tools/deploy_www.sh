#!/bin/bash

TARGET_DIR=TopWatch

BASE=`pwd`
rm -f -R $BASE/deploy
rm -f -R $BASE/build

$BASE/tools/deploy.sh

cp -f -R $BASE/www/* $BASE/deploy/$TARGET_DIR

