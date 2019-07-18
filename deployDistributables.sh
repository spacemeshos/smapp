#!/bin/bash -x -e

RELEASE_FOLDER="release"
LOCAL_GCLOUD_PATH="/usr/local/gcloud"
LOCAL_GCLOUD_BIN_PATH="$LOCAL_GCLOUD_PATH/google-cloud-sdk/bin"
GCLOUD_WALLET_BUCKET_PATH="gs://spacemesh-v010/Wallet/"

echo "Deploying Spacemesh Wallet Installers";

install_gcloud() {
  echo "Installing GCloud...";
  # Downloading gcloud package
  curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz;
  
  # creating and giving ownership permissions a-priori
  # sudo mkdir -p /Users/$USER/.config/gcloud/
  #sudo mkdir -p /Users/$USER/.config/gcloud/configurations/
  #sudo mkdir -p /Users/$USER/.config/gcloud/logs/
  # sudo chown -R $USER: /Users/$USER/.config/gcloud/
  #sudo chown -R $USER: /Users/$USER/.config/gcloud/configurations/
  #sudo chown -R $USER /Users/$USER/.config/gcloud/logs/
  #sudo chmod 700 /Users/$USER/.config/gcloud/
  #sudo chmod 700 /Users/$USER/.config/gcloud/configurations/
  #sudo chmod 700 /Users/$USER/.config/gcloud/logs/

  sudo chown -R $USER: $LOCAL_GCLOUD_PATH/google-cloud-sdk/

  # Installing the package
  sudo su $USER -c "mkdir -p $LOCAL_GCLOUD_PATH"
  sudo su $USER -c "tar -C $LOCAL_GCLOUD_PATH -xvf /tmp/google-cloud-sdk.tar.gz"
  sudo su $USER -c "sh $LOCAL_GCLOUD_PATH/google-cloud-sdk/install.sh -q --usage-reporting=false"
  
  
  if [[ $PATH != *"$LOCAL_GCLOUD_BIN_PATH"* ]]; then
    # Adding the package path to local if not in PATH
    export PATH=$PATH:$LOCAL_GCLOUD_BIN_PATH
  fi

  # test notifications
  echo "**** Some test notification *****"
  echo "Running gsutil version -l..."
  gsutil version -l
  echo "User is: $USER"
}

gcp_connect() {
  if [ -z $GCLOUD_KEY ]; then
    echo "Environment variable GCLOUD_KEY is not set"
    exit 1
  fi

  echo $GCLOUD_KEY | base64 --decode > spacemesh.json
  gcloud auth activate-service-account --key-file spacemesh.json
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
      # TODO: consider quitting script (1) if file could not upload
      exit 1
    }
  done < "$input";
}

install_gcloud
gcp_connect
upload_distributables


echo "Done deploying Installers.";