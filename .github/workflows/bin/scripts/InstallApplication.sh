#!/bin/bash

echo "Install application"
cp /var/www/.appEnv /var/www/app/.env #change these with AWS SM
cd /var/www/applications/budgetcontrol && docker-compose up -d