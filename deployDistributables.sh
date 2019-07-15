#!/bin/bash -x -e

UPLOAD_TARGET_NAME="Testnet Guide";
REPO_FOLDER_NAME="testnet-guide";
REPO_URL="https://github.com/spacemeshos/testnet-guide.git";
RELEASE_FOLDER="release"

echo "Deploying distributables to $UPLOAD_TARGET_NAME";

echo "Cleanup before clone...";
rm -rf $REPO_FOLDER_NAME;

git clone $REPO_URL;

# test branch
cd $REPO_FOLDER_NAME;
git checkout -b test-branch

echo "Updating Spacemesh Wallet App installer files..."
input="../$RELEASE_FOLDER/publishFilesList.txt";

while IFS= read -r line
do
  echo "$line";
  cp -v "../$RELEASE_FOLDER/$line" "$line";
done < "$input"

git status
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p');
echo "BRANCH: $branch";

echo "Done deploying to $UPLOAD_TARGET_NAME.";