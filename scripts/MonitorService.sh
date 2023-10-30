#!/bin/bash

#service nginx status
curl -sI https://dev-api-mtm.isaiastore.com | grep "200 OK"
curl -sI https://dev-mtm.isaiastore.com | grep "200 OK"
