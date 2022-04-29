#!/bin/bash

yarn codegen

source ./scripts/generatePrisma.sh
source ./scripts/runMigration.sh

yarn dev

# exec "$@"