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
   return	 301 https://$DOMAIN\$request_uri;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name $DOMAIN;

    # RSA certificate
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem; # managed by Certbot

    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot

    gzip on;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    root $WEB_DIR;
    add_header X-App-Name Letterpad;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

certbot certonly \
   --webroot \
   --agree-tos \
   --email letterpad@ajaxtown.com \
   -d $DOMAIN \
   -w $WEB_DIR

if [ -f /bin/false ]; then
    SUDO_ASKPASS=/bin/false sudo -A nginx -s reload  2>&1
elif [ -f /usr/bin/false ]; then
    SUDO_ASKPASS=/usr/bin/false sudo -A nginx -s reload  2>&1
fi

LP_HEADER_FOUND=$(curl -is --head https://$DOMAIN)
echo "$LP_HEADER_FOUND" | grep -i "Letterpad";
echo "$LP_HEADER_FOUND" | grep -i "200";
echo "$LP_HEADER_FOUND" | grep -i "301";