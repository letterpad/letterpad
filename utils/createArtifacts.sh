#!/bin/bash



for dir in ./src/client/themes/*/;do
    if [ -d "$dir/public" ]; then
        pathBefore="$dir"public
        pathAfter="vendor-zip/${pathBefore//\.\/src/dist}"
        pathAfter="${pathAfter//public/}"
        
        mkdir  -p $pathAfter
        echo "Copying theme's public folder to vendor:"
        echo "$pathBefore => $pathAfter" 
        cp -rf $pathBefore $pathAfter
    fi
done



mkdir -p vendor-zip/dist/admin
mkdir -p vendor-zip/api/schema
mkdir -p vendor-zip/public
mkdir -p vendor-zip/dist/admin/server/response
mkdir -p vendor-zip/dist/api/schema
mkdir -p vendor-zip/dist/client
mkdir -p vendor-zip/utils
mkdir -p vendor-zip/dist/admin/server/response
mkdir -p vendor-zip/dist/client/themes/**/public/**

echo "Copy environment file"
cp .env vendor-zip/.env

echo "Copy package.json"
cp package.json vendor-zip/package.json

echo "Copy db"
cp -rf data vendor-zip/data

echo "Copy dist folder"
cp -rf dist vendor-zip/

echo "Copy admin public folder"
cp -rf src/admin/public vendor-zip/dist/admin/

echo "Copy db schema files"
cp -rf src/api/schema vendor-zip/dist/api/

echo "Copy the root public folder"
cp -rf src/public vendor-zip/dist/

echo "copy admin response template => content.tpl"
cp -rf src/admin/server/response/content.tpl vendor-zip/dist/admin/server/response/content.tpl

echo "copy client theme template => template.tpl"
cp -rf src/client/template.tpl vendor-zip/dist/client/template.tpl

echo "copy lock file => yarn.lock"
cp -rf yarn.lock vendor-zip/yarn.lock

echo "copy utils folder for post and pre install"
cp -rf utils vendor-zip

# zip the folder
zip -r vendor-zip{.zip,}

curl -X POST -L \
    -F "metadata={name : 'vendor-zip.zip'};type=application/json;charset=UTF-8" \
    -F "artifact=@vendor-zip.zip;type=application/zip" \
    "http://localhost:2000/deploy"