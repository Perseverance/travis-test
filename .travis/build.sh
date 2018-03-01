#!/bin/bash
if [ "$TRAVIS_BRANCH" == "sprint-luke" ]; then
  docker ps -a
fi