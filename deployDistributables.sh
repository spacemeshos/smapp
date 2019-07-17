#!/bin/bash -x -e

RELEASE_FOLDER="release"
LOCAL_GCLOUD_BIN_PATH="/usr/local/gcloud/google-cloud-sdk/bin"
GCLOUD_WALLET_BUCKET_PATH="gs://spacemesh-v010/Wallet/"

echo "Deploying Spacemesh Wallet Installers";

gcp_connect() {
  if [ -z $GCLOUD_KEY ]; then
    echo "Environment variable GCLOUD_KEY is not set"
    exit 1
  fi

  echo $GCLOUD_KEY | base64 --decode > spacemesh.json
  gcloud auth activate-service-account --key-file spacemesh.json
}

install_gcloud() {
  echo "Installing GCloud...";
  # Downloading gcloud package
  curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz;
  
  # creating and giving permissions a-priori
  mkdir -p /Users/admin/.config/gcloud/
  sudo chown -R $USER /Users/admin/.config/gcloud/

  # Installing the package
  mkdir -p /usr/local/gcloud \
    && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
    && sh /usr/local/gcloud/google-cloud-sdk/install.sh -q --usage-reporting=false 
  if [[ $PATH != *"$LOCAL_GCLOUD_BIN_PATH"* ]]; then
    # Adding the package path to local if not in PATH
    export PATH=$PATH:$LOCAL_GCLOUD_BIN_PATH
  fi
}

upload_distributables() {
  echo "Uploading Spacemesh Wallet App installer files..."
  input="$RELEASE_FOLDER/publishFilesList.txt";

  while IFS= read -r line
  do
    { # try
      echo "Uploading $line...";
      gsutil cp "$RELEASE_FOLDER/$line" $GCLOUD_WALLET_BUCKET_PATH
    } || { # catch
      echo "Could not upload $line"
      exit 1
    }
  done < "$input";
}

install_gcloud
gcp_connect
upload_distributables


echo "Done deploying Installers.";