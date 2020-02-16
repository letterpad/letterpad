#!/bin/sh

( echo "cat <<EOF" ; cat $* ; echo EOF ) | sh
