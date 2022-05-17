#!/bin/bash

PRISMA_FILE="sqlite/schema.prisma"

if [[ "$DATABASE_URL" =~ ^mysql.* ]]; then
    export PRISMA_FILE="mysql/schema_mysql.prisma"
fi

npx prisma generate --schema prisma/$PRISMA_FILE