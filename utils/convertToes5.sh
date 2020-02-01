#!/bin/bash
# yarn tsc ./src/__generated__/*.ts --outDir ./dist
# yarn tsc  --esModuleInterop true --jsx react --skipLibCheck ./src/admin/server/*.ts --outDir ./dist/admin/server
# yarn tsc --esModuleInterop true --jsx react --skipLibCheck ./src/client/server/*.ts --outDir ./dist/client/server
# yarn tsc --esModuleInterop true --jsx react --skipLibCheck ./src/client/common/*.ts --outDir ./dist/client/common
# yarn tsc --esModuleInterop true --jsx react --skipLibCheck ./src/shared/*.ts --outDir ./dist/shared
yarn tsc --moduleResolution node --esModuleInterop true --jsx react --skipLibCheck ./src/server.ts --outDir ./dist

yarn tsc --moduleResolution node --esModuleInterop true --jsx react --skipLibCheck ./src/api/*.ts --outDir ./dist
yarn babel ./src/api  -d  ./dist/api



# yarn babel ./src/client/common  -d  ./dist/client/common &&

# yarn babel ./src/shared -d ./dist/shared && 
# yarn babel ./src/server.js -d ./dist && 

# yarn babel ./src/config -d ./dist/config && 

# yarn babel ./src/api -d ./dist/api

