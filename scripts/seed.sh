#!/bin/bash

source scripts/schema.sh

npx prisma migrate reset --force --schema prisma/$PRISMA_FILE