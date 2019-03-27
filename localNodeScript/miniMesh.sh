#!/bin/bash -x -e

if [ "$1" == "clean" ]; then
    echo "Clean"
    docker stop $(docker ps -q)
    docker rm -v $(docker ps -a -q -f status=exited)
    exit 0
fi

#Run oracle
docker run -d --rm --expose 3030 -p 3030:3030 --name oracle beckmani/oracle_server

oracleDockerID=`docker ps | grep oracle | awk '{print $1}'`
oracleIP=`docker inspect -f '{{.NetworkSettings.IPAddress }}' $oracleDockerID`

#Run bootstrap nme ode
docker run -d -p 9090:9090 -p 9091:9091 --name bootstrap spacemeshos/go-spacemesh --oracle_server http://${oracleIP}:3030 --genesis-time '2022-02-24T20:10:00+00:00' --grpc-server --json-server

s=0
bootstrapKey=`docker container logs bootstrap | grep "Local node identity" | cut -d' ' -f5`
while [ -z "$bootstrapKey" ] && [ $s -lt 10 ]; do
    bootstrapKey=`docker container logs bootstrap | grep "Local node identity" | cut -d' ' -f5`
    sleep 1
    s=$[$s+1]
done

bootstrapDockerID=`docker ps | grep bootstrap | awk '{print $1}'`
