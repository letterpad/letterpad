#!/bin/bash

source scripts/schema.sh

npx prisma migrate dev --schema prisma/$PRISMA_FILE