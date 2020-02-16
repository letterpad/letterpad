#!/bin/bash
run_dev () {
    THEME=$1
    if [ -z "$THEME" ]; then
        THEME=hugo
    fi
    
    export THEME=$THEME
    export NODE_ENV=dev
    yarn ts-node ./src/start.ts --profile --json &
    webpack --config ./webpack/webpack.dev.js --env.theme=$THEME 
    
}


run_production () {
    THEME=$1
    if [ -z "$THEME" ]; then
        THEME=hugo
    fi
    
    export THEME=$THEME
    
    node ./dist/server.js
}

build_production () {
    if [ -z "$THEME" ]; then
        THEME=hugo
    fi
    
    export THEME=$THEME
    
    tsc --build tsconfig.build.json &
    tsc --build "src/client/themes/$THEME/tsconfig.json" &
    webpack --env.NODE_ENV=production --config webpack/webpack.prod.js --env.theme=$THEME
}

COMMAND=$1

if [ "$COMMAND" = "runDev" ]; then
    run_dev
elif [ "$COMMAND" = "build" ]; then
    build_production
elif [ "$NODE_ENV" = "production" ]; then
    run_production
fi