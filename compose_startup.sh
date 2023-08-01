#!/bin/bash

#stop running containers and remove volumes
sudo docker compose down -v

# removw the build file and build
rm -rf ./dist

# start, build and run containers in detach mode
sudo docker compose up --build -d