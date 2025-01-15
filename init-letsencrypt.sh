#!/bin/bash

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Stop any running containers
docker-compose down

# Start nginx with a temporary configuration
docker-compose up --force-recreate -d nginx

# Get certificates for both domains
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    -d nayari.ai -d www.nayari.ai -d api.nayari.ai \
    --email contact@nayari.ai --agree-tos --no-eff-email

# Restart containers
docker-compose down
docker-compose up -d