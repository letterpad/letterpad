#!/bin/bash
set -e
printf "$npm_execpath" | grep -q "yarn\.js$" || 
(printf "~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
\n⚠️ Use yarn not npm! ⚠️\n
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~" && exit 1)

echo "Installing the default theme - Hugo"
if [ ! -d client/themes/hugo ]; then
    git clone https://github.com/letterpad/theme-hugo.git client/themes/hugo --depth 1
fi

