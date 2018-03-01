#!/bin/bash
if [[ "sprint-luke" =~ ^sprint-.*$ ]]; then
	docker build -f ./Dockerfiles/dev.dockerfile -t dev_website_image .
fi

if [[ "sprint-luke" =~ ^stable-.*$ ]]; then
	docker build -f ./Dockerfiles/stage.dockerfile -t stage_website_image .
fi