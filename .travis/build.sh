#!/bin/bash
if [[] "$TRAVIS_BRANCH" =~ ^sprint-.*$ ]]; then
	echo "sprint"
	docker ps -a
fi