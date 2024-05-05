#!/bin/bash

source scripts/schema.sh
# for planetscale prisma migration is not required.
DB_IGNORE_MIGRATION="supabase"

if [[ $DATABASE_URL == *"$DB_IGNORE_MIGRATION"* ]]; then
    echo "Ignoring Prisma migration for Supabase DB"
    exit 0
fi

if [[ $NODE_ENV -eq "production" ]]; then
    npx prisma migrate deploy --schema prisma/$PRISMA_FILE
else
    npx prisma migrate dev --schema prisma/$PRISMA_FILE
fi

