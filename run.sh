 
#!/usr/bin/env bash

#################################################################################
# Run this script for development.
# If you only want to see the finished product, use Docker. 
# Docker instruction: [https://github.com/ngshiheng/event-booking-app#using-docker-whale].
#################################################################################

start_app () {
    npm run dev --prefix server/
}

start_app