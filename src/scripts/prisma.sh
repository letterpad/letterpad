#!/bin/sh

command=$1


source $(dirname "$0")/../../.env

PRISMA_FILE="schema.prisma"
if [[ "$DATABASE_URL" =~ ^mysql.* ]]; then
    export PRISMA_FILE="schema_mysql.prisma"
fi

schema=prisma/$PRISMA_FILE

migrate() {
    npx prisma migrate dev --schema "$schema"
}

createMigration() {
    npx prisma migrate dev --name "$2" --schema "$schema"
}

studio() {
    npx prisma studio --schema "$schema"
}

generateClient() {
    npx prisma generate --schema "$schema"
}

reset() {
    npx prisma db push --force-reset --schema "$schema"
}

intro() {
    npx prisma db pull --schema "$schema"
}

seed() {
    npx prisma db seed --schema "$schema"
}

eval "$command"