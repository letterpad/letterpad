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



mkdir -p vendor-zip/data

echo "Copy package.json"
cp package.json vendor-zip/package.json

# echo "Copy db"
# cp -rf data vendor-zip/

echo "Copy dist folder"
cp -rf dist vendor-zip/

echo "Copy schema"
cp -rf src/api/schema vendor-zip/dist/

echo "Copy seed"
cp -rf dist/api/seed vendor-zip/dist/api/

echo "copy lock file => yarn.lock"
cp -rf yarn.lock vendor-zip/yarn.lock

echo "Copy admin public folder"
cp -rf src/admin/public vendor-zip/dist/admin/

# echo "Copy db schema files"
# cp -rf dist/api/* vendor-zip/dist/api/

echo "Copy the root public folder"
cp -rf src/public vendor-zip/dist/

echo "copy admin response template => content.tpl"
cp -rf src/admin/server/response/content.tpl vendor-zip/dist/admin/server/response/content.tpl

echo "copy client theme template => template.tpl"
cp -rf src/client/template.tpl vendor-zip/dist/client/template.tpl

echo "copy sample.env"
cp -rf sample.env vendor-zip

# echo "copy utils folder for post and pre install"
# cp -rf utils vendor-zip

# zip the folder
zip -r vendor-zip{.zip,}

# curl -X POST -L \
#     -F "metadata={name : 'vendor-zip.zip'};type=application/json;charset=UTF-8" \
#     -F "artifact=@vendor-zip.zip;type=application/zip" \
#     -F 'data={"key":"", "domain":"ajaxtown.com"}' \
#     "http://ajaxtown.com/deploy" 