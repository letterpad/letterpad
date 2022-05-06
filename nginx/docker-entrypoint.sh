#!/bin/sh
###########

sh -c "nginxReloader.sh &"
exec /docker-entrypoint.sh "$@"