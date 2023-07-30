#!/bin/bash

#stop running containers and remove volumes
sudo docker compose down -v

# start, build and run containers in detach mode
sudo docker compose up --build -d