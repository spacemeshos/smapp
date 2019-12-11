#!/bin/bash -x -e

if [ "$1" == "clean" ]; then
    echo "Clean"
    docker stop $(docker ps -q)
    docker rm -v $(docker ps -a -q -f status=exited)
    exit 0
fi

#Update images
docker pull spacemeshos/go-spacemesh:develop

#Run oracle
docker run -d --rm --expose 3030 -p 3030:3030 --name oracle beckmani/oracle_server

#Run poet
docker run -d --rm --expose 50002 -p 50002:50002 --name poet spacemeshos/poet:develop --rpclisten 0.0.0.0:50002 --restlisten 0.0.0.0:80

oracleDockerID=`docker ps | grep oracle | awk '{print $1}'`
oracleIP=`docker inspect -f '{{.NetworkSettings.IPAddress }}' $oracleDockerID`

poetDockerID=`docker ps | grep poet | awk '{print $1}'`
poetIP=`docker inspect -f '{{.NetworkSettings.IPAddress }}' $poetDockerID`

#Run bootstrap nme ode
docker run -d -p 9090:9090 -p 9091:9091 --name bootstrap spacemeshos/go-spacemesh:develop --oracle_server http://${oracleIP}:3030 --genesis-time '2022-02-24T20:10:00+00:00' --eligibility-epoch-offset 0 --grpc-server --json-server --poet-server ${poetIP}:50002 --executable-path '/bin/go-spacemesh'

s=0
bootstrapKey=`docker container logs bootstrap | grep "Local node identity" | cut -d' ' -f5`
while [ -z "$bootstrapKey" ] && [ $s -lt 10 ]; do
    bootstrapKey=`docker container logs bootstrap | grep "Local node identity" | cut -d' ' -f5`
    sleep 1
    s=$[$s+1]
done

bootstrapDockerID=`docker ps | grep bootstrap | awk '{print $1}'`
