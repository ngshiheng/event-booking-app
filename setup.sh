#!/usr/bin/env bash

#################################################################################
# Run this script for development.
# If you only want to see the finished product, use Docker. 
# Docker instruction: [https://github.com/ngshiheng/reading-list#using-docker].
#################################################################################

# font color
green=`tput setaf 2`
white=`tput sgr0`

# functions
npm_install () {
    echo "⌛ $white Running npm install at $1"
    (cd $1 && npm i)
    echo "$green✔$white Completed npm install at $1"
}

echo_finish () {
    echo "$green✔$white Finished setup."
}

# main
npm_install ./server
npm_install ./client
echo_finish