#!/bin/sh
###########

while true
do
 inotifywait --exclude .swp -e create -e modify -e delete -e move /etc/nginx/sites-enabled
 nginx -t
 if [ $? -eq 0 ]
 then
  date +%F_%T
  echo "Detected Nginx Configuration Change"
  echo "Executing: nginx -s reload"
  nginx -s reload
 fi
done

exec "$@"