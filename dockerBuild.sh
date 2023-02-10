#!/bin/bash

CONTAINER_NAME="chmac/nostr-kind-registry-crawler"

STATUS=$(git status --porcelain | grep -c '^')

if [[ "$STATUS" != "0" ]]
then
  echo "#Jfaxj9 Cowardly refusing to build with a dirty git"
  exit 1
fi

# Get the current commit hash of the repository
COMMIT=$(git rev-parse --short HEAD)

docker build . -t "${CONTAINER_NAME}:latest" -t "${CONTAINER_NAME}:git-${COMMIT}"

echo
echo "#y5rr9J Docker images built."
echo
echo "Please push these images now like so:"
echo
echo "docker push ${CONTAINER_NAME}:git-${COMMIT} && docker push ${CONTAINER_NAME}:latest"