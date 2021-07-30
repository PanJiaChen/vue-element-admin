#!/bin/sh

# folder with dist app files
cd /usr/share/nginx/html/static/js

# Set API Proxy connection
find -name 'app.*.js' -exec sed -i "s|https://api.erpya.com|$API_URL|g" {} \;

# Start nginx web server
nginx && tail -f /dev/null
