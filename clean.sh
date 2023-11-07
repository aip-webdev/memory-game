#!/usr/bin/env bash

echo "Удаление старых контейнеров..."
CONTAINERS=$(sudo docker ps -a -f status=exited -q)
echo "Containers: $CONTAINERS"
sudo docker rm "$CONTAINERS" || true
echo "Удаление неиспользуемых образов..."
IMAGES=$(sudo docker images -f "dangling=true" -q)
echo "Images: $IMAGES"
sudo docker rmi "$IMAGES" || true

if [ ! -d memory-game ]; then
    echo "Папка memory-game отсутствует. Создание новой папки..."
    mkdir memory-game
    sudo chmod 777 memory-game
    echo "Папка memory-game создана успешно."
else
    echo "Папка memory-game уже существует."
    cd memory-game || exit
    sudo docker-compose down
    sudo find . ! \( -path './db/db-data' \) -delete || true
fi
