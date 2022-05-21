#!/bin/bash
PRISMA_FILE="schema.prisma"

if [[ "$DATABASE_URL" =~ ^mysql.* ]]; then
    export PRISMA_FILE="schema_mysql.prisma"
fi

if [ -z "$1" ]; then
    echo "Enter migration name"
    exit 1;
fi

npx prisma migrate dev --name "$1" --schema prisma/$PRISMA_FILE