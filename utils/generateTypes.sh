#!/bin/bash
DEFAULT_PORT=4040
if [ -f .env ]
then
    # Read the port from the environment file
    DEFAULT_PORT=$(cat .env | grep appPort= | cut -d '=' -f2)
fi

yarn run apollo schema:download --endpoint=https://localhost:$PORT/graphql graphql-schema.json

yarn run \
    apollo client:codegen \
    --localSchemaFile=graphql-schema.json \
    --target=typescript \
    --includes=src/shared/queries/**/*.ts \
    --tagName=gql \
    --addTypename \
    types

# rm graphql-schema.json