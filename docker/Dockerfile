# Copyright 2020 Engineering Ingegneria Informatica S.p.A.
#
# This file is part of the IoT Agent for the Ultralight 2.0 protocol (IOTAUL) component
#

ARG NODE_VERSION=16.20.0-slim
FROM node:${NODE_VERSION}
ARG GITHUB_ACCOUNT=Engineering-Research-and-Development
ARG GITHUB_REPOSITORY=opc-ua-car-server
ARG DOWNLOAD=latest
ARG SOURCE_BRANCH=master

# Copying Build time arguments to environment variables so they are persisted at run time and can be 
# inspected within a running container.
# see: https://vsupalov.com/docker-build-time-env-values/  for a deeper explanation.

ENV GITHUB_ACCOUNT=${GITHUB_ACCOUNT}
ENV GITHUB_REPOSITORY=${GITHUB_REPOSITORY}
ENV DOWNLOAD=${DOWNLOAD}

MAINTAINER Engineering Ingegneria Informatica S.p.A.

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
#
RUN if [ "${DOWNLOAD}" = "latest" ] ; \
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
	# Ensure that unzip is installed, and download the sources
	apt-get update && \
	apt-get install -y  --no-install-recommends unzip wget && \
	wget --no-check-certificate -O source.zip https://github.com/"${GITHUB_ACCOUNT}"/"${GITHUB_REPOSITORY}"/archive/"${RELEASE}".zip && \
	unzip source.zip && \
	rm source.zip && \
	mv "${GITHUB_REPOSITORY}-${RELEASE_CONCAT}" /opt/opc-ua-car && \
	# Remove unzip and clean apt cache
	apt-get clean && \
	apt-get remove -y unzip && \
	apt-get -y autoremove

WORKDIR /opt/opc-ua-car

RUN \
	# Ensure that Git is installed prior to running npm install
	apt-get update && \
	apt-get install -y git && \
	npm install --unsafe-perm --production && \
	# Remove Git and clean apt cache
	apt-get clean && \
	apt-get remove -y git && \
	apt-get -y autoremove && \
	chmod +x docker/entrypoint.sh

# USER node
ENV NODE_ENV=production

# Expose 5001 for OPC-UA Car Server
EXPOSE 5001

ENTRYPOINT ["docker/entrypoint.sh"]
