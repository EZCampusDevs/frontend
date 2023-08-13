#!/bin/sh


USE_LOG_FILE_ARGUMENT="USE_LOG_FILE"

if [ $# != 0 ]; then

   echo "Processing start arguments"

   for arg in "$@"; do

      if [ "$arg" = "$USE_LOG_FILE_ARGUMENT" ]; then

         echo "Writing all stdout and stderr to file"

         log_dir="$HOME/log/jenkins-ssh"
         mkdir -p $log_dir

         log_file="$log_dir/run-datascraper-log.out"
         touch $log_file

         exec 3>&1 4>&2
         trap 'exec 2>&4 1>&3' 0 1 2 3
         exec 1>$log_file 2>&1

      fi

   done

fi


if [ ! -d ./client ]; then

   echo './client directory does not exist, this contains the source code of the frontend!'
   exit 1

fi

cd ./client

IMAGE_NAME="react_build_prod"

docker build -t "$IMAGE_NAME" -f ./Dockerfile .

