#!/bin/bash -x -e

# Download Spacemesh Node Binary
echo "Removing old Spacemesh Node Binaries."
rm -rf node/

# MacOS
echo "Downloading binary for MacOS."
curl -o node/mac/mac-go-spacemesh --create-dirs https://storage.googleapis.com/spacemesh-v010/OSX/mac-go-spacemesh

# Windows
echo "Downloading binary for Windows."
curl -o node/windows/go-spacemesh.exe --create-dirs https://storage.googleapis.com/spacemesh-v010/Windows/go-spacemesh.exe

# Linux
echo "Downloading binary for Linux."
curl -o node/linux/linux-go-spacemesh --create-dirs https://storage.googleapis.com/spacemesh-v010/Linux/linux-go-spacemesh