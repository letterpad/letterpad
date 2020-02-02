#!/bin/bash

mkdir vendor-zip
cp .env vendor-zip/.env
cp package.json vendor-zip/package.json
cp -rf data vendor-zip/data