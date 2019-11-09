 
#!/usr/bin/env bash

#################################################################################
# Run this script for development.
# If you only want to see the finished product, use Docker. 
# Docker instruction: [https://github.com/ngshiheng/reading-list#using-docker].
#################################################################################

start_app () {
    npm run dev --prefix server/
}

start_app