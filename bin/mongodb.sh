#!/usr/bin/env bash

# NOTE:
# One stop shop for managing the our development mongo database.
#  Use helper functions for sourcing configs, starting, stopping, etc.

set -o errexit
set -o nounset

MONGODB_CONTAINER_NAME="example-express-mongodb"
MONGODB_VOLUME_NAME="example-express-mongodb-data"

MONGODB_ROOT_USER="root"
MONGODB_ROOT_PASSWORD="password"

# Connection string for the database
# TODO: do i need the db name?
# TODO: do i need to specify the auth strategy?
# TODO: do i need to use a +srv connection string?
MONGODB_URI="mongodb://${MONGODB_ROOT_USER}:${MONGODB_ROOT_PASSWORD}@localhost:27017"
# Name of the mongo database
MONGODB_DATABASE_NAME="example-express-db"

MONGODB_IMAGE_NAME="mongodb/mongodb-community-server:latest"

CONTAINER_RUNTIME="podman"
if which docker &>/dev/null; then
	CONTAINER_RUNTIME="docker"
fi

function uri {
	echo ${MONGODB_URI}
}

function database-name {
	echo ${MONGODB_DATABASE_NAME}
}

function run {
	start-mongodb-container
}

# Helpers:

function start-mongodb-container {
	ensure-mongodb-container-exists
	${CONTAINER_RUNTIME} start ${MONGODB_CONTAINER_NAME}
}

function ensure-mongodb-container-exists {
	${CONTAINER_RUNTIME} pull ${MONGODB_IMAGE_NAME}
	create-mongodb-container
}

function create-mongodb-container {
	if ${CONTAINER_RUNTIME} ps -a | grep ${MONGODB_CONTAINER_NAME} &>/dev/null; then
		return
	fi

	${CONTAINER_RUNTIME} volume create ${MONGODB_VOLUME_NAME} || true

	${CONTAINER_RUNTIME} run \
		--name ${MONGODB_CONTAINER_NAME} \
		--env MONGODB_INITDB_ROOT_USERNAME=${MONGODB_ROOT_USER} \
		--env MONGODB_INITDB_ROOT_PASSWORD=${MONGODB_ROOT_PASSWORD} \
		--publish 27017:27017 \
		--volume ${MONGODB_VOLUME_NAME}:/data/db \
		--detach \
		${MONGODB_IMAGE_NAME}
}

function clean() {
	${CONTAINER_RUNTIME} stop ${MONGODB_CONTAINER_NAME} || true
	${CONTAINER_RUNTIME} rm -fv ${MONGODB_CONTAINER_NAME} || true
	${CONTAINER_RUNTIME} volume rm -f ${MONGODB_VOLUME_NAME} || true
}

$1
