#!/bin/bash

: ${1?"Usage: $0 example.tld"}

# Nginx - new server block
DOMAIN=$1

# Variables
NGINX_AVAILABLE_VHOSTS='/etc/nginx/sites-enabled'
WEB_DIR='/var/www/html/letterpad-map-test'
WEB_USER=$username


# Create nginx config file
cat > $NGINX_AVAILABLE_VHOSTS/$DOMAIN.enabled <<EOF
### www to non-www
server {
   listen	 80;
   server_name $DOMAIN;
   add_header X-App-Name Letterpad;
   root $WEB_DIR;
   add_header X-App-Name Letterpad;
}
EOF

certbot certonly \
   --webroot \
   --agree-tos \
   --email letterpad@ajaxtown.com \
   -d $DOMAIN \
   -w $WEB_DIR

sudo nginx -s reload