#!/bin/bash
if [[ "$TRAVIS_BRANCH" =~ ^sprint-.*$ ]]; then
	docker build -f ./Dockerfiles/dev.dockerfile -t dev_website_image .
elif [[ "$TRAVIS_BRANCH" =~ ^stable-.*$ ]]; then
	docker build -f ./Dockerfiles/stage.dockerfile -t stage_website_image .
fi