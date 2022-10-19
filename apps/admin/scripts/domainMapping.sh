#!/bin/bash

#This function is used to cleanly exit any script. It does this displaying a
# given error message, and exiting with an error code.
function error_exit {
    echo "$@"
    exit 1
}
#Trap the killer signals so that we can exit with a good message.
trap "error_exit 'Received signal SIGHUP'" SIGHUP
trap "error_exit 'Received signal SIGINT'" SIGINT
trap "error_exit 'Received signal SIGTERM'" SIGTERM

#Alias the function so that it will print a message with the following format:
#prog-name(@line#): message
#We have to explicitly allow aliases, we do this because they make calling the
#function much easier (see example).
shopt -s expand_aliases
# alias die='error_exit "Error ${0}(@`echo $(( $LINENO - 1 ))`):"'
alias die='error_exit "Error (@`echo $(( $LINENO - 1 ))`):"'


# NGINX_AVAILABLE_VHOSTS='./'
NGINX_AVAILABLE_VHOSTS='/etc/nginx/sites-enabled'
WEB_DIR='/var/www/html/letterpad-map-test'

function reloadServer {
    sudo -A nginx -s reload >/dev/null 2>&1
    l=$?

    if [ $l -eq 0 ]; then
        echo "success"
    else
        die "Unable to reload nginx server"
    fi
}

function createCertificate {
    DOMAIN=$1
    certbot certonly \
        --webroot \
        --agree-tos \
        --email letterpad@ajaxtown.com \
        -d $DOMAIN \
        -w $WEB_DIR >/dev/null 2>&1

    l=$?
    if [ $l -eq 0 ]; then
        echo "success"
    elif [ $l -eq 127 ]; then
        die "Install certbot to generate certificates"
    else
        die "Certificate generation failed"
    fi
}

function validateCertificate {
    DOMAIN=$1
    CHAIN=/etc/letsencrypt/live/$DOMAIN/chain.pem
    CERT=/etc/letsencrypt/live/$DOMAIN/cert.pem

    openssl verify -untrusted $CHAIN $CERT >/dev/null 2>&1

    l=$?
    if [ $l -eq 0 ]; then
        echo "success"
    else
        die "Verification failed"
    fi
}

function removeDomainMapping {
    DOMAIN=$1
    certbot delete --cert-name $DOMAIN  >/dev/null 2>&1
    l=$?
    if [ $l -eq 0 ]; then
        rm /etc/nginx/sites-enabled/$DOMAIN >/dev/null 2>&1
        echo "success"
    else
        die "Certificates not found"
    fi
}

function nginxSetConfig_80 {
    DOMAIN=$1
    # Create nginx config file
 cat > $NGINX_AVAILABLE_VHOSTS/$DOMAIN.enabled <<EOF
server {
   listen	 80;
   server_name $DOMAIN;
   add_header X-App-Name Letterpad;
   root $WEB_DIR;
}
EOF

    echo "success";
}

function nginxSetConfig_443 {
    DOMAIN=$1
    # Create nginx config file
    cat > $NGINX_AVAILABLE_VHOSTS/$DOMAIN.enabled <<EOF
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

    location ^~ /.well-known/acme-challenge/ {

        default_type "text/plain";

        # This directory must be the same as in /etc/letsencrypt/cli.ini
        # as "webroot-path" parameter. Also don't forget to set "authenticator" parameter
        # there to "webroot".
        root $WEB_DIR;
    }
    
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
    echo "success"
}



function verifySSL {
    DOMAIN=$1
    if curl -Is https://$DOMAIN | head -1 | grep -o '[0-9][0-9][0-9]'; then
        echo "success"
    fi
}

# Check if the function exists (bash specific)
if declare -f "$1" > /dev/null
then
  # call arguments verbatim
  "$@"
else
  # Show a helpful error
  echo "'$1' is not a known function name" >&2
  exit 1
fi