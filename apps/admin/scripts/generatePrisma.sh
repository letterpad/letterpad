#!/bin/bash

source scripts/schema.sh
print("Generating Prisma Client:","prisma/$PRISMA_FILE")
print("Generating Prisma Client - DB URL:", $DATABASE_URL)
npx prisma generate --schema prisma/$PRISMA_FILE