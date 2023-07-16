# Docker-based Smapp with Xpra GUI

This will build the sources in the current directory inside a docker container (based on the [node](https://hub.docker.com/_/node/) docker image), and then create a docker image based on [ubuntu](https://hub.docker.com/_/ubuntu/) with the linux package installed. The Ubuntu image runs an [Xpra](https://xpra.org/) server, which allows remote access to the Smapp GUI.

Notes:

* This mode of running Smapp is **not officially supported**! (Use only if you know what you're doing.)
* Currently, the dockerized Smapp version **does not auto-update**. This means you must manually update when a new version of Smapp is released (or your node may stop working correctly). The docker-xpra branch may lag significantly after the main branch, so to ensure you're getting the latest version, check the Smapp version in the GUI.

## Prerequisites

* Install a recent version of [docker](https://docs.docker.com/install/) (which includes [docker-compose](https://docs.docker.com/compose/))
* Install [Xpra](https://github.com/Xpra-org/xpra/wiki/Download)
* Install the [Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
  (AMD GPUs may work, but are not tested)


## Running

1. Either clone the repository:

       git clone -b docker-xpra https://github.com/spacemeshos/smapp.git  

   or just download the [docker-compose.yml](https://github.com/spacemeshos/smapp/raw/docker-xpra/docker-compose.yml) and [.env](https://github.com/spacemeshos/smapp/raw/docker-xpra/.env) files (if you don't intend to build from source).

2. **Optional:** Edit the `.env` file to specify the port numbers and location of the data directory that will be used by Smapp. 

   By default, the server uses a docker volume for the data, port 7513 for incoming communication and 9090 for API access and port 6070 for Xpra.

3. Run 

       docker-compose up

   This downloads the image from dockerhub (if it's not already available) and starts the server.  The server will shutdown if the app is closed, if you Ctrl-C in the docker-compose window or if you run `docker-compose down`.  You can restart it by running `docker-compose up` again.
2. Connect to the gui by running an Xpra client on the *host*.  If you're running on the same host as the docker engine, run 

       xpra attach tcp://localhost:6070

3. **Optional:** If you want to remove any previous volumes (i.e., start from scratch), run `docker-compose down -v`. 

   Notes: 
   * This will **delete your wallet and all of your post data** if you left the default `.env` configuration (data is stored in a docker volume).
   * This won't delete data from host directories if `SMESH_HOST_DATA_PATH` was set in `.env`.)

## Updating

If the new version has already been pushed to docker hub, update by running

    docker compose pull
    docker compose down
	docker compose up

If the new version hasn't been pushed yet, you may need to build from the latest sources (possibly from sources on the develop branch).

## Building from source

1. Run `git pull` to get the latest sources.  
2. Run `docker-compose build`. This builds the docker image from the local sources.






