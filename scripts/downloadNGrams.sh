#!/bin/bash

NGRAMS_VERSION=20150817

apk --update add ca-certificates openssl libarchive-tools 
mkdir /ngrams 
curl https://languagetool.org/download/ngram-data/ngrams-en-$NGRAMS_VERSION.zip | bsdtar -xf- -C "app/ngrams"