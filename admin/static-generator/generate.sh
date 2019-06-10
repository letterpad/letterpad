#!/bin/bash
# Downloads a website.
# Usage:
# ./generate.sh [domain] [url]
# Eg. ./generate.sh example.com https://example.com <----- Downloads /*
# Eg. ./generate.sh mysite.com https://mysite.com/demo  <---- Downloads /demo/*
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
        $rootUrl 2>&1