#!/usr/bin/env bash

GREEN='\033[0;32m'
echo -e "${GREEN}Создание файла .env..."
cp .env.sample .env

echo -e "${GREEN}Проверка базы данных..."
if docker ps -f "name=mg-pg" --format '{{.Names}}' | grep -q "mg-pg"; then
    echo -e "${GREEN}Контейнер mg-pg уже запущен."
    #echo -e "${GREEN}Создание дампа БД..."
    #sudo docker compose exec -T pg-16 sh -c "exec pg_dump -U postgres --inserts memorybase > /backup/dump.sql"
    #sudo chmod 777 db/db-backups
    #(cp ./db/db-backups/dump.sql ./db/dump.sql && sudo rm -rf ./db/db-backups/dump.sql ) || true
else
    echo -e "${GREEN}Контейнер mg-pg не запущен. Запуск контейнера с БД..."
    docker compose up -d pg-16
fi

echo -e "${GREEN}Проверка adminer..."
docker ps -f "name=mg-adminer" --format '{{.Names}}' | grep -q "mg-adminer" || docker compose up -d adminer


echo -e "${GREEN}Обновление образов docker..."
sudo docker compose build server & sudo docker compose build nginx
wait
echo -e "${GREEN}Обновление образов docker - SUCCESS"

echo -e "${GREEN}Остановка контейнеров docker..."
sudo docker compose stop server & sudo docker compose stop nginx
wait
echo -e "${GREEN}Остановка контейнеров - SUCCESS"

echo -e "${GREEN}Запуск новых контейнеров..."
sudo docker compose up -d server
sudo docker compose up -d nginx

echo -e "${GREEN}Удаление ненужных файлов..."
find . ! \( -path './db' \) ! \( -name 'docker-compose.yml' \) ! \( -name '.env' \) -delete || true