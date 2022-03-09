#!/bin/bash

if [ "$NODE_ENV" == "production" ]
then
  export $(echo $(cat .env.production.local | sed 's/#.*//g' | sed 's/\r//g' | xargs) | envsubst)
else
  export $(echo $(cat .env.development.local | sed 's/#.*//g' | sed 's/\r//g' | xargs) | envsubst)
fi