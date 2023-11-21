#!/bin/bash

echo "Install application"
cd /var/www/applications/budgetcontrol && docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build