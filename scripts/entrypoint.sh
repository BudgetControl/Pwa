#!/bin/bash
service apache2 restart
echo "[INFO] install Isaia application"
cd /var/www/html && composer install -v
echo "[INFO]  install Isaia library"
cd /var/www/html/library && composer install -v
echo "[INFO] log"
tail -f -n 100 /var/www/logs/error.log