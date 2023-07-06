FROM ubuntu:22.04 AS builder

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y libnss3 libgtk-3-0 libxss1 libasound2 ocl-icd-libopencl1 unzip curl binutils build-essential 

RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && bash nodesource_setup.sh && DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs && npm install --global yarn


RUN adduser --disabled-password --gecos '' spacemesh 
COPY --chown=spacemesh . /home/spacemesh 
USER spacemesh
WORKDIR /home/spacemesh

RUN [ "/bin/bash", "-c",  "curl -L -o /tmp/Linux.zip \"https://storage.googleapis.com/go-spacemesh-release-builds/$(<node/use-version)/Linux.zip\" && unzip /tmp/Linux.zip && mkdir -p node/linux && mv Linux/* node/linux && rmdir Linux" ]

RUN chmod +x node/linux/profiler # Installer doesn't do this for some reason

ENV SENTRY_AUTH_TOKEN=
ENV SENTRY_DSN=

RUN yarn && yarn build && yarn package-linux

FROM ubuntu:22.04 
ARG XPRA_REPO=https://raw.githubusercontent.com/Xpra-org/xpra/master/packaging/repos/jammy/xpra.sources
ARG XPRA_KEY_ID=73254CAD17978FAF

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y curl gnupg

RUN gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys ${XPRA_KEY_ID} && gpg --export --armor ${XPRA_KEY_ID} > "/usr/share/keyrings/xpra.asc"
RUN cd /etc/apt/sources.list.d && curl -O ${XPRA_REPO}

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y xpra libnss3 libgtk-3-0 libxss1 libasound2 musl desktop-file-utils x11-apps epiphany-browser ocl-icd-libopencl1 

RUN mkdir -p /etc/OpenCL/vendors && \
    echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

RUN adduser --disabled-password --gecos '' spacemesh 
RUN chown -R spacemesh /home/spacemesh

COPY --from=builder /home/spacemesh/release/*_amd64.deb /tmp
RUN dpkg -i /tmp/*_amd64.deb ; apt install -y -f
COPY ./no-sandbox-smapp /usr/local/bin

USER spacemesh
ENTRYPOINT ["/usr/bin/xpra"]

EXPOSE 7513
EXPOSE 9999
