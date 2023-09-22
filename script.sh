#!/bin/bash

echo "Pulling backend Docker image..."
docker pull yifu123kkk/agv-map-editor-be

echo "Pulling frontend Docker image..."
docker pull yifu123kkk/agv-map-editor-fe

echo "Starting backend service on port 8000..."
docker run -d -p 8000:8000 yifu123kkk/agv-map-editor-be

echo "Starting frontend service on port 3000..."
docker run -d -p 3000:3000 yifu123kkk/agv-map-editor-fe

# this line is optional and only works on MacOS
echo "Opening http://localhost:3000/ in your web browser..."
# open http://localhost:3000/

# echo "Navigate to http://localhost:3000/ in your web browser."