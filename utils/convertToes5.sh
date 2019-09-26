#!/bin/bash

yarn babel ./src/admin/server -d dist/admin/server && 

yarn babel ./src/client/server  -d  dist/client/server &&
yarn babel ./src/client/common  -d  dist/client/common &&

yarn babel ./src/shared -d dist/shared && 
yarn babel ./src/server.js -d dist && 

yarn babel ./src/config -d dist/config && 

yarn babel ./src/api -d dist/api