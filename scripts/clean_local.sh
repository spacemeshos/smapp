#!/bin/bash -x -e

# Download Spacemesh Node Binary
echo "Removing local data folders ..."
rm -rf ~/spacemesh
rm -rf ~/spacemeshtestdata
rm -rf ~/post
rm -rf ~/Library/"Application Support"/Electron
rm -rf ~/Documents/spacemesh-log.txt
