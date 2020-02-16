#!/bin/sh

set -e

if [ ! -f src/client/themes/hugo/package.json ]; then
    echo "Installing the default theme - Hugo"
    git clone https://github.com/letterpad/theme-hugo.git src/client/themes/hugo --depth 1
fi

