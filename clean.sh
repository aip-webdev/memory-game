#!/usr/bin/env bash

GREEN='\033[0;32m'

echo -e "${GREEN}Удаление старых контейнеров..."
CONTAINERS=$(sudo docker ps -a -f status=exited -q)
echo -e "${GREEN}Containers: $CONTAINERS"
sudo docker rm "$CONTAINERS"
echo -e "${GREEN}Удаление неиспользуемых образов..."
IMAGES=$(sudo docker images -f "dangling=true" -q)
echo -e "${GREEN}Images: $IMAGES"
sudo docker rmi "$IMAGES"

if [ ! -d memory-game ]; then
    echo -e "${GREEN}Папка memory-game отсутствует. Создание новой папки..."
    mkdir memory-game
    sudo chmod 777 memory-game
    echo -e "${GREEN}Папка memory-game создана успешно."
else
    echo -e "${GREEN}Папка memory-game уже существует."
    #Не удалять строку ниже,
    cd memory-game || exit
    echo -e "${GREEN}Удаление старых файлов..."
    sudo find . ! \( -path './db/db-data' \) ! \( -path '.ssh' \) -delete || true
fi
