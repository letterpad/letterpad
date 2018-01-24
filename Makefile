.PHONY: all build-install build-dev install dev

PWD := $(shell pwd)

INSTALL_IMAGE := blog-npm-install
DEV_IMAGE := blog-npm-dev

all: build-install build-dev install

build-install:
	@docker build -f Dockerfile.install -t $(INSTALL_IMAGE) .

install: build-install
	@mkdir -p .yarn-cache
	@docker run -a stdout -a stdin -it \
		-v $(PWD):/app \
		-v $(PWD)/.yarn-cache:/root/yarn-cache \
		--rm $(INSTALL_IMAGE)

dev:
	@docker-compose up
