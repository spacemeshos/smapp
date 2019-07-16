#!/bin/bash -x -e

RELEASE_FOLDER="release"

echo "Deploying Spacemesh Wallet Installers";

echo "Updating Spacemesh Wallet App installer files..."
input="../$RELEASE_FOLDER/publishFilesList.txt";

while IFS= read -r line
do
  echo "$line";
done < "$input";

echo "Done deploying Installers.";