#!/usr/bin/env bash

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
