#!/bin/bash

source scripts/schema.sh

npx prisma migrate reset --schema prisma/$PRISMA_FILE