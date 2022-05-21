#!/bin/bash

source scripts/schema.sh

if [ -z "$1" ]; then
    echo "Enter migration name"
    exit 1;
fi

npx prisma migrate dev --name "$1" --schema prisma/$PRISMA_FILE