#!/bin/bash
docker cp . budgetcontrol-pwa:/var/www/workdir/.
docker exec budgetcontrol-pwa npm run build
docker cp bin/apache/htaccess.conf budgetcontrol-pwa:/var/www/workdir/dist/.htaccess
