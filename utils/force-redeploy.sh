#!/bin/bash

kubectl patch deployment letterpad-demo -p "{\"spec\": {\"template\": {\"metadata\": { \"labels\": {  \"redeploy\": \"$(date +%s)\"}}}}}"
