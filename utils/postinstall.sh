#!/bin/bash

# exit on first error
# seed the database only during first installation
if [ ! -f .installed ]; then
    echo "Seeding the database..."
    yarn seed
    echo "Seeding complete!"
fi
echo "Running migrations"
yarn sequelize db:migrate
touch .installed
echo "


WELCOME TO "
cat << "EOF"
| |        | | | |                          | |
| |     ___| |_| |_ ___ _ __ _ __   __ _  __| |
| |    / _ \ __| __/ _ \ '__| '_ \ / _` |/ _` |
| |___|  __/ |_| ||  __/ |  | |_) | (_| | (_| |
\_____/\___|\__|\__\___|_|  | .__/ \__,_|\__,_|
                            | |
                            |_|

EOF
