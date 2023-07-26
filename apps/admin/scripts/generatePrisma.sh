#!/bin/bash

source scripts/schema.sh
echo "Generating Prisma Client:"
echo "prisma/$PRISMA_FILE"
echo "Generating Prisma Client - DB URL:"
echo "$DATABASE_URL"
npx prisma generate --schema prisma/$PRISMA_FILE