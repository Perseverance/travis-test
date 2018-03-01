#!/bin/bash
if [[ "$TRAVIS_BRANCH" =~ ^sprint-.*$ ]]; then
	docker build -f ./Dockerfiles/dev.dockerfile -t dev_website_image .
	docker build -f ./Dockerfiles/test.dockerfile -t test_website_image .
elif [[ "$TRAVIS_BRANCH" =~ ^stable-.*$ ]]; then
	docker build -f ./Dockerfiles/stage.dockerfile -t stage_website_image .
	docker build -f ./Dockerfiles/prod.dockerfile -t prod_website_image .
elif [[ "$TRAVIS_BRANCH" =~ ^china-.*$ ]]; then
	docker build -f ./Dockerfiles/china.dockerfile -t china_website_image .
fi