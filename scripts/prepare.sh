#!/bin/sh

# ls
yarn seed
source $(dirname "$0")/prisma.sh

migrate

# exec "$@"