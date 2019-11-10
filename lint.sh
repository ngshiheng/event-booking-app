#!/usr/bin/env bash

# Run this before commiting any code to check for linting errors and formatting

# font color
red=`tput setaf 1`
green=`tput setaf 2`
white=`tput sgr0`

# function
echo_finish () {
    echo "$green✓$white Finished checking."
}

echo_ok() {
    echo "$green✓$white $1"
}

echo_error() {
    echo "$red✗$white $1"
}

lint_check() {
    echo "⌛ $white Running eslint & prettier at $1"
    npm run lint --prefix $1
    if [ "$?" -ne "0" ]; then echo_error "ERR - error while running eslint/prettier $1" && exit 1; fi
    echo_ok "OK - no eslint/prettier errors found at $1"
}

# main
lint_check ./server
lint_check ./client
echo_finish