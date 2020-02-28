ARG NODE_VERSION

FROM go-spacemesh:${NODE_VERSION} AS spacemesh_node

FROM node:stretch AS builder

RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y libnss3 libgtk-3-0 libxss1 libasound2 

RUN adduser --disabled-password --gecos '' spacemesh 
COPY --chown=spacemesh . /home/spacemesh 
USER spacemesh
WORKDIR /home/spacemesh

COPY --from=spacemesh_node /bin/go-spacemesh node/linux/

RUN npm install && npm run package-linux

FROM ubuntu:18.04 
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y xpra libnss3 libgtk-3-0 libxss1 libasound2 musl desktop-file-utils x11-apps epiphany-browser

RUN adduser --disabled-password --gecos '' spacemesh 
RUN chown -R spacemesh /home/spacemesh

COPY --from=builder /home/spacemesh/release/*_amd64.deb /tmp
RUN dpkg -i /tmp/*_amd64.deb ; apt install -y -f
COPY ./no-sandbox-smapp /usr/local/bin

USER spacemesh
ENTRYPOINT ["/usr/bin/xpra"]

EXPOSE 7513
EXPOSE 9999
