#!/bin/bash

source scripts/schema.sh

if [[ $NODE_ENV -eq "production" ]]; then
    npx prisma migrate deploy --schema prisma/$PRISMA_FILE
else
    npx prisma migrate dev --schema prisma/$PRISMA_FILE
fi

