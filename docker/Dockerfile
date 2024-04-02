# Copyright 2020 Engineering Ingegneria Informatica S.p.A.
#
# This file is part of the IoT Agent for the Ultralight 2.0 protocol (IOTAUL) component
#

ARG NODE_VERSION=20
ARG GITHUB_ACCOUNT=Engineering-Research-and-Development
ARG GITHUB_REPOSITORY=opc-ua-car-server
ARG DOWNLOAD=latest
ARG SOURCE_BRANCH=master

# Copying Build time arguments to environment variables so they are persisted at run time and can be 
# inspected within a running container.
# see: https://vsupalov.com/docker-build-time-env-values/  for a deeper explanation.

FROM node:${NODE_VERSION} AS builder
ARG GITHUB_ACCOUNT
ARG GITHUB_REPOSITORY
ARG DOWNLOAD
ARG SOURCE_BRANCH

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

#
# The following RUN command retrieves the source code from GitHub.
# 
# To obtain the latest stable release run this Docker file with the parameters
# --no-cache --build-arg DOWNLOAD=stable
# To obtain any speciifc version of a release run this Docker file with the parameters
# --no-cache --build-arg DOWNLOAD=1.7.0
#
# The default download is the latest tip of the master of the named repository on GitHub
#
# Alternatively for local development, just copy this Dockerfile into file the root of the repository and 
# replace the whole RUN statement by the following COPY statement in your local source using :
#
# COPY . /opt/opc-ua-car

RUN \
	# Install security updates
	apt-get update -y && \
	apt-get upgrade -y && \
	# Ensure that unzip is installed prior to downloading
	apt-get install -y --no-install-recommends unzip && \
	if [ "${DOWNLOAD}" = "latest" ] ; \
	then \
		RELEASE="${SOURCE_BRANCH}"; \
		echo "INFO: Building Latest Development from ${SOURCE_BRANCH} branch."; \
	elif [ "${DOWNLOAD}" = "stable" ]; \
	then \
		RELEASE=$(curl -s https://api.github.com/repos/"${GITHUB_ACCOUNT}"/"${GITHUB_REPOSITORY}"/releases/latest | grep 'tag_name' | cut -d\" -f4); \
		echo "INFO: Building Latest Stable Release: ${RELEASE}"; \
	else \
	 	RELEASE="${DOWNLOAD}"; \
	 	echo "INFO: Building Release: ${RELEASE}"; \
	fi && \
	RELEASE_CONCAT=$(echo "${RELEASE}" | tr / -); \
	curl -s -L https://github.com/"${GITHUB_ACCOUNT}"/"${GITHUB_REPOSITORY}"/archive/"${RELEASE}".zip > source.zip && \
	unzip source.zip -x "*/test/**" "*/rpm/**" "*/ghpages/**" "*/docs/**" "*/.*" && \
	rm source.zip && \
	mv "${GITHUB_REPOSITORY}-${RELEASE_CONCAT}" /opt/opc-ua-car && \
	# Remove unzip and clean apt cache
	apt-get clean && \
	apt-get remove -y unzip && \
	apt-get -y autoremove && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /opt/opc-ua-car

# hadolint ignore=DL3008
RUN \
	# Ensure that Git is installed prior to running npm install
	echo "INFO: npm install --production..." && \
	npm install --only=prod --no-package-lock --no-optional && \
	# Remove Git and clean apt cache
	apt-get clean && \
	apt-get -y autoremove

# USER node
ENV NODE_ENV=production

# Expose 5001 for OPC-UA Car Server
EXPOSE 5001

RUN \
	chmod +x "docker/entrypoint.sh"

ENTRYPOINT ["docker/entrypoint.sh"]
