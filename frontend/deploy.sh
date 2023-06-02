#!/bin/sh

log_dir="/var/log/jenkins-ssh"
mkdir -p $log_dir

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>"$log_dir/frontend-dockerrun-log.out" 2>&1

container_name="frontend_prod"

echo "Stopping container..."

docker stop $container_name || true

while [ "$(docker inspect -f '{{.State.Running}}' "$container_name" 2>/dev/null)" = "true" ]; do
    echo "Waiting for container to stop..."
    sleep 1
done

echo "Running build..."

docker run -itd --rm -p 3000:3000 --network EZnet --name $container_name node_frontend

echo "Deploy done."
