#!/bin/bash
set -a
source .env
source .env.production.local
set +a
exec $@

PRISMA_FILE="sqlite/schema.prisma"

if [[ "$DATABASE_URL" =~ ^mysql.* ]]; then
    PRISMA_FILE="mysql/schema_mysql.prisma"
fi

export PRISMA_FILE