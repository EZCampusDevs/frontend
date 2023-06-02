#!/bin/sh

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>frontend-docker-run-log.out 2>&1

docker stop frontend_prod || true

sleep 2

docker run -itd --rm -p 3000:3000 --network EZnet --name frontend_prod node_frontend
