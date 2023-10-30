#!/bin/bash

echo "Install application"
cp /var/www/.env /var/www/app/.env #change these with AWS SM
cd /var/www/app && docker-compose up -d --build
docker exec isaia-api bash -c "cd /var/www/html/library && vendor/bin/phinx migrate"
docker exec isaia-api bash -c "service apache2 restart" #workaround
docker exec isaia-api bash -c "chown -R www-data:www-data *" #apache group

#temporary script ################# remove these
docker container cp bin/apache/isaia-default.prod.fe.conf isaia-fe:/etc/apache2/sites-available/isaia-default.conf
docker container restart isaia-fe