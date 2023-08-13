#!/bin/sh


USE_LOG_FILE_ARGUMENT="USE_LOG_FILE"

if [ $# != 0 ]; then

   echo "Processing start arguments"

   for arg in "$@"; do

      if [ "$arg" = "$USE_LOG_FILE_ARGUMENT" ]; then

         echo "Writing all stdout and stderr to file"

         log_dir="$HOME/log/jenkins-ssh"
         mkdir -p $log_dir

         log_file="$log_dir/deploy-frontend-log.out"
         touch $log_file

         exec 3>&1 4>&2
         trap 'exec 2>&4 1>&3' 0 1 2 3
         exec 1>$log_file 2>&1

      fi

   done

fi


IMAGE_NAME="react_build_prod"
CONTAINER_NAME="frontend_prod"

echo "Stopping container..."

docker stop $CONTAINER_NAME || true

while [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null)" = "true" ]; do
    echo "Waiting for container to stop..."
    sleep 1
done

echo "Running build..."

docker run -itd --rm -p 3000:80 --network EZnet --name "$CONTAINER_NAME" "$IMAGE_NAME"

echo "Deploy done."
