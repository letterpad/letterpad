#!/bin/sh

set -e

printf "$npm_execpath" | grep -q "yarn\.js$" || 	
(printf "~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~	
\n⚠️ Please use yarn, NOT npm! \n 
 Letterpad uses workspaces feature which is not available in npm yet. \n	
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~\n" && exit 1)

if [ ! -f src/client/themes/hugo/package.json ]; then
    echo "Installing the default theme - Hugo"
    git clone https://github.com/letterpad/theme-hugo.git src/client/themes/hugo --depth 1
fi

