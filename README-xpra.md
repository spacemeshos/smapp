# Docker-based Smapp with Xpra GUI

This will build the sources in the current directory inside a docker container (based on the [node](https://hub.docker.com/_/node/) docker image), and then create a docker image based on [ubuntu](https://hub.docker.com/_/ubuntu/) with the linux package installed. The Ubuntu image runs an [Xpra](https://xpra.org/) server.

## Prerequisites

* Install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/)
* Install [Xpra](https://xpra.org/trac/wiki/Download)


## Building

0. Run `git pull` to get the latest sources.
1. Run `docker-compose build`. This builds the docker image.
2. **Optional:** If you want to remove any previous volumes (i.e., start from scratch), run `docker-compose down -v`

## Running

1. Run `docker-compose up`. 
  This starts the server. By default, it uses port 7513 for incoming communication and 9090 for API access and port 6070 for Xpra. The server will shutdown if the app is closed, if you Ctrl-C in the docker-compose window or if you run `docker-compose down`.  You can restart it by running `docker-compose up` again.
2. Connect to the gui by running an Xpra client on the *host*.  If you're running on the same host as the docker engine, run `xpra attach tcp://localhost:6070`. 





