#!/bin/sh

log_dir="/var/log/jenkins-ssh"
mkdir -p $log_dir

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>"$log_dir/frontend-dockerbuild-log.out" 2>&1

docker build -t node_frontend -f ./Dockerfile .

