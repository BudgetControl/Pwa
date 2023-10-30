#!/bin/bash

echo "Run functional test"
docker exec isaia-api bash -c "cd /var/www/html/library && vendor/bin/phpunit --testsuite UnitTests"
docker exec isaia-api bash -c "cd /var/www/html/library && vendor/bin/phpunit --testsuite FunctionalTests"