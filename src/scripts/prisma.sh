#!/bin/sh

command=$1


source $(dirname "$0")/../../.env

PRISMA_FILE="schema.prisma"
if [[ "$DATABASE_URL" =~ ^mysql.* ]]; then
    export PRISMA_FILE="schema_mysql.prisma"
fi


migrate() {
    npx prisma migrate dev --schema prisma/$PRISMA_FILE
}

createMigration() {
    npx prisma migrate dev --name "$2" --schema prisma/$PRISMA_FILE
}

studio() {
    npx prisma studio --schema prisma/$PRISMA_FILE
}

generateClient() {
    npx prisma generate --schema prisma/$PRISMA_FILE
}

reset() {
    npx prisma db push --force-reset --schema prisma/$PRISMA_FILE
}

intro() {
    npx prisma db pull --schema prisma/$PRISMA_FILE
}

eval "$command"