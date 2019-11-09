#!/usr/bin/env bash

# Run this before commiting any code to check for linting errors and formatting

# font color
green=`tput setaf 2`
white=`tput sgr0`

# function
echo_finish () {
    echo "$green✓$white Finished checking."
}

# main
npm run lint --prefix ./server
npm run lint --prefix ./client
echo_finish