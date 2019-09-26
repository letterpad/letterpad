#!/bin/bash

if [ ! -a ".env" ]; then
    cp sample.env .env
fi
if [ ! -f "src/data/.init" ]; then
    touch src/data/.init
    echo "Seeding the database..."
    yarn seed
    echo "Seeding complete!"
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
fi