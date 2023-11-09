#!/usr/bin/env bash

GREEN='\033[0;32m'
delete_files_except() {
    ls -A | while read -r file; do
        if [ "$file" != "db" ] && [ "$file" != ".ssh" ]; then
            if [ -f "$file" ] || [ -d "$file" ]; then
                rm -rf "$file"
            fi
        fi
    done
}

echo -e "${GREEN}Удаление старых контейнеров..."
CONTAINERS=$(sudo docker ps -a -f status=exited -q)
echo "Containers: $CONTAINERS"
echo -e "${GREEN}Containers: $CONTAINERS"
sudo docker rm "$CONTAINERS" || true
echo "Удаление неиспользуемых образов..."
echo -e "${GREEN}Удаление неиспользуемых образов..."
IMAGES=$(sudo docker images -f "dangling=true" -q)
echo "Images: $IMAGES"
echo -e "${GREEN}Images: $IMAGES"
sudo docker rmi "$IMAGES" || true

if [ ! -d memory-game ]; then
    echo -e "${GREEN}Папка memory-game отсутствует. Создание новой папки..."
    mkdir memory-game
    sudo chmod 777 memory-game
    echo -e "${GREEN}Папка memory-game создана успешно."
else
    echo -e "${GREEN}Папка memory-game уже существует."
    cd memory-game || exit
    echo -e "${GREEN}Удаление старых файлов..."
    delete_files_except
fi



