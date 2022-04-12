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
}
EOF

if [ -f /bin/false ]; then
    SUDO_ASKPASS=/bin/false sudo -A nginx -s reload  2>&1
elif [ -f /usr/bin/false ]; then
    SUDO_ASKPASS=/usr/bin/false sudo -A nginx -s reload  2>&1
fi

HEADER_FOUND=$(curl blog.void0.app -ISs  | grep -i "Letterpad")
# X-App-Name: Letterpad

if [[ $HEADER_FOUND =~ "Letterpad" ]]; then
   echo "Success!"
else
   echo "Error: Header not found"
   exit 1;
fi