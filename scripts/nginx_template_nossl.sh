#!/bin/bash

: ${1?"Usage: $0 example.tld"}

# Nginx - new server block
domain=$1

# Variables
NGINX_AVAILABLE_VHOSTS='./.bin'
# NGINX_AVAILABLE_VHOSTS='/etc/nginx/sites-available'
WEB_DIR='/var/www/html/letterpad-map-test'
WEB_USER=$username

# Sanity check
[ $(id -g) != "0" ] && echo "Script must be run as root." && exit 1;

# Create nginx config file
cat > $NGINX_AVAILABLE_VHOSTS/$domain.enabled <<EOF
### www to non-www
server {
   listen	 80;
   server_name $domain  www.$domain;
   add_header X-App-Name Letterpad;
   root $WEB_DIR;
   add_header X-App-Name Letterpad;
}
EOF

certbot certonly \
   --webroot \
   --agree-tos \
   --email letterpad@ajaxtown.com \
   -d $domain \
   -w /var/www/html/letterpad-map-test/

sudo nginx -s reload