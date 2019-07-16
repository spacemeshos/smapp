#!/bin/bash -x -e

UPLOAD_TARGET_NAME="Testnet Guide";
REPO_FOLDER_NAME="testnet-guide";
REPO_URL="https://github.com/spacemeshos/testnet-guide.git";
RELEASE_FOLDER="release";
AUTH_MD_FILE_NAME="auth.md";

echo "Updating auth.md in $UPLOAD_TARGET_NAME";

echo "Cleanup before clone...";
rm -rf $REPO_FOLDER_NAME;

git clone $REPO_URL;

# test branch
cd $REPO_FOLDER_NAME;
git checkout -b test-branch

cp -v "../$RELEASE_FOLDER/$AUTH_MD_FILE_NAME" "$AUTH_MD_FILE_NAME";

git status;
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p');
echo "BRANCH: $branch";
git add .;
git commit -am "updating $AUTH_MD_FILE_NAME";
git push origin $branch;

echo "Done updating $AUTH_MD_FILE_NAME in $UPLOAD_TARGET_NAME.";