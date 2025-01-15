#!/bin/bash

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Set proper permissions
chmod -R 755 certbot/www
chmod -R 755 certbot/conf

# Stop any running containers
docker-compose down

# Start nginx with HTTP only
docker-compose up --force-recreate -d nginx

# Wait for nginx to start
echo "Waiting for nginx to start..."
sleep 5

# Test with staging first
echo "Testing with Let's Encrypt staging server..."
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --staging \
    -d nayari.ai -d www.nayari.ai -d api.nayari.ai \
    --email contact@nayari.ai --agree-tos --no-eff-email

# If staging was successful, get real certificates
if [ $? -eq 0 ]; then
    echo "Staging test successful. Getting real certificates..."
    docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
        --force-renewal \
        -d nayari.ai -d www.nayari.ai -d api.nayari.ai \
        --email contact@nayari.ai --agree-tos --no-eff-email
else
    echo "Staging test failed. Please check the nginx configuration and DNS settings."
    exit 1
fi

# Restart containers
docker-compose down
docker-compose up -d