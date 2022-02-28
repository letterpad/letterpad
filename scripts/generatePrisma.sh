#!/bin/bash

if [ "$NODE_ENV" == "production" ]
then
  export $(echo $(cat .env.production.local | sed 's/#.*//g' | sed 's/\r//g' | xargs) | envsubst)
else
  export $(echo $(cat .env.development.local | sed 's/#.*//g' | sed 's/\r//g' | xargs) | envsubst)
fi

PRISMA_FILE="schema.prisma"

if [[ "$DATABASE_URL" =~ ^mysql.* ]]; then
    export PRISMA_FILE="schema_mysql.prisma"
fi

npx prisma generate --schema prisma/$PRISMA_FILE