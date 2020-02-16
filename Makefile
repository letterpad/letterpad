COMMIT_HASH := $(shell git rev-parse --short HEAD)
GCR_URI := gcr.io/ajaxtown-hosting/letterpad-demo:$(COMMIT_HASH)

KFILE =

.PHONY: build push-gcloud push-hub deploy-gcloud

build:
	@docker build -t letterpad .

push-gcloud:
	@docker tag letterpad $(GCR_URI)
	@docker push $(GCR_URI)

push-hub:
	@docker tag letterpad letterpad/letterpad
	@docker push letterpad/letterpad

# helper for kubectl apply with templating
apply:
ifndef KFILE
	$(error KFILE is not set)
endif
	@VERSION=$(COMMIT_HASH) ./utils/envsub.sh $(KFILE) | kubectl apply -f -
