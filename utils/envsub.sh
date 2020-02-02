#!/bin/sh

( echo "cat <<EOF" ; cat $1 ; echo EOF ) | sh
