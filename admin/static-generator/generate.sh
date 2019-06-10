#!/bin/bash
# Downloads a website.
# Usage:
# ./generate.sh [domain] [url]
# Eg. ./generate.sh example.com https://example.com <----- Downloads /*
# Eg. ./generate.sh mysite.com https://mysite.com/demo  <---- Downloads /demo/*

# Outputs:
# https://example.com/page1
# https://example.com/page2
# ...
#
wget \
     --recursive \
     --page-requisites \
     --header "static: true" \
     --no-clobber \
     --html-extension \
     --convert-links \
     --restrict-file-names=windows \
     --no-verbose \
     --domains localhost \
     --directory-prefix=static \
     --progress=bar \
     --exclude-directories=admin \
     --no-host-directories \
     --no-parent \
        robots=off \
        http://localhost:4040 2>&1
        
        
        #  | \
        # awk '{
        #     if (index($3, "URL:http"))
        #         print substr($3,5);
        # }'