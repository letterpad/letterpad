#!/bin/bash
echo "Installing the default theme - Hugo"
if [ ! -d client/themes/hugo ]; then
    git clone https://github.com/letterpad/theme-hugo.git client/themes/hugo --depth 1
fi

