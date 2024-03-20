#!/bin/bash

source scripts/schema.sh

# for planetscale prisma migration is not required.
DB_IGNORE_MIGRATION="connect.psdb"
DB_IGNORE_MIGRATION_SUPABASE="supabase"

if [[ $DATABASE_URL == *"$DB_IGNORE_MIGRATION"* ]]; then
    echo "Ignoring Prisma migration for PlanetScale DB"
    exit 0
fi

if [[ $DATABASE_URL == *"$DB_IGNORE_MIGRATION_SUPABASE"* ]]; then
    echo "Ignoring Prisma migration for PlanetScale DB"
    exit 0
fi

npx prisma migrate reset --force --schema prisma/$PRISMA_FILE