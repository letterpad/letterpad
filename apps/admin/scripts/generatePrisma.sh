#!/bin/bash

source scripts/schema.sh

npx prisma generate --schema prisma/$PRISMA_FILE