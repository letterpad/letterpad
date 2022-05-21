#!/bin/bash
PRISMA_FILE="schema.prisma"

if [[ "$DATABASE_URL" =~ ^mysql.* ]]; then
    export PRISMA_FILE="schema_mysql.prisma"
fi

npx prisma generate --schema prisma/$PRISMA_FILE