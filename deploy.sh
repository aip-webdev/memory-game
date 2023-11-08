#!/usr/bin/env bash

GREEN='\033[0;32m'
delete_files_except() {
    ls -A | while read -r file; do
        if [ "$file" != "db" ] && [ "$file" != "docker-compose.yml" ] && [ "$file" != ".env" ]; then
            if [ -f "$file" ] || [ -d "$file" ]; then
                rm -rf "$file"
            fi
        fi
    done
}

echo -e "${GREEN}Создание файла .env..."
cp .env.sample .env

echo -e "${GREEN}Обновление образов docker..."
sudo docker compose build server & sudo docker compose build nginx
wait
echo -e "${GREEN}Обновление образов docker - SUCCESS"

echo -e "${GREEN}Остановка контейнеров docker..."
sudo docker compose stop server & sudo docker compose stop nginx
wait
echo -e "${GREEN}Остановка контейнеров - SUCCESS"

echo -e "${GREEN}Запуск новых контейнеров..."
sudo docker compose up -d

echo -e "${GREEN}Удаление ненужных файлов..."
delete_files_except