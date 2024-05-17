#!/bin/bash

#service nginx status
docker exec budgetcontrol-app service apache2 restart
curl -sI https://dev.budgetcontrol.cloud | grep "200 OK"
