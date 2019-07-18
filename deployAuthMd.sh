#!/bin/bash -x -e

UPLOAD_TARGET_NAME="Testnet Guide";
REPO_FOLDER_NAME="testnet-guide";
REPO_URL="https://github.com/spacemeshos/testnet-guide.git";
RELEASE_FOLDER="release";
AUTH_MD_FILE_NAME="auth.md";

setup_git() {
    git remote
    git config --global user.email "yuval3000@gmail.com"
    git config --global user.name "yhaspel"
}

commit_files() {
    # test branch
    git checkout -b test-branch
    git status
    branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p');
    echo "BRANCH: $branch"
    git add .
    echo "Travis build number: $TRAVIS_BUILD_NUMBER"
    
    if [ -z $TRAVIS_BUILD_NUMBER ]; then
        # locally
        git commit -message "Updating $AUTH_MD_FILE_NAME"
    else
        # from travis
        git commit -message "Updating $AUTH_MD_FILE_NAME | Travis build: $TRAVIS_BUILD_NUMBER"
    fi
}

upload_files() {
    if [ -z $GH_TOKEN ]; then
        echo "Environment variable GH_TOKEN is not set"
        exit 1
    fi

    git remote add origin https://${GH_TOKEN}@github.com/spacemeshos/testnet-guide.git > /dev/null 2>&1
    git push --quiet --set-upstream origin test-branch 
#    git push origin test-branch;
}

echo "Updating auth.md in $UPLOAD_TARGET_NAME";

echo "Cleanup before clone...";
rm -rf $REPO_FOLDER_NAME;

git clone $REPO_URL;

cd $REPO_FOLDER_NAME;

setup_git
cp -v "../$RELEASE_FOLDER/$AUTH_MD_FILE_NAME" "$AUTH_MD_FILE_NAME";
commit_files
#upload_files

echo "Done updating $AUTH_MD_FILE_NAME in $UPLOAD_TARGET_NAME.";