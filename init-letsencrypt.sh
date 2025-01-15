#!/bin/bash

# Create directories for certbot with sudo
sudo mkdir -p certbot/conf
sudo mkdir -p certbot/www

# Set proper permissions with sudo
sudo chmod -R 755 certbot/www
sudo chmod -R 755 certbot/conf
sudo chown -R $USER:$USER certbot

# Stop any running containers
sudo docker compose down

# Start nginx with HTTP only
sudo docker compose up --force-recreate -d nginx

# Wait for nginx to start
echo "Waiting for nginx to start..."
sleep 5

# Test with staging first
echo "Testing with Let's Encrypt staging server..."
sudo docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --staging \
    -d nayari.ai -d www.nayari.ai -d api.nayari.ai \
    --email contact@nayari.ai --agree-tos --no-eff-email

# If staging was successful, get real certificates
if [ $? -eq 0 ]; then
    echo "Staging test successful. Getting real certificates..."
    sudo docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
        --force-renewal \
        -d nayari.ai -d www.nayari.ai -d api.nayari.ai \
        --email contact@nayari.ai --agree-tos --no-eff-email
else
    echo "Staging test failed. Please check the nginx configuration and DNS settings."
    exit 1
fi

# Restart containers
sudo docker compose down
sudo docker compose up -d