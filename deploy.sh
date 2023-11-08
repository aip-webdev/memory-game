#!/usr/bin/env bash

GREEN='\033[0;32m'
echo -e "${GREEN}Создание файла .env..."
cp .env.sample .env

echo -e "${GREEN}Создание дампа БД..."
echo "DATE=date -d @1267619929"
sudo docker compose exec -T pg-14 sh -c "exec pg_dump -U postgres --inserts memorybase > db/db-backups/dump.sql"

echo -e "${GREEN}Обновление образов docker..."
sudo docker compose build
echo -e "${GREEN}Обновление образов docker - SUCCESS"

echo -e "${GREEN}Остановка и удаление контейнеров docker..."
sudo docker compose down
echo -e "${GREEN}Остановка и удаление контейнеров - SUCCESS"

echo -e "${GREEN}Удаление старых контейнеров..."
CONTAINERS=$(sudo docker ps -a -f status=exited -q)
echo -e "${GREEN}Containers: $CONTAINERS"
sudo docker rm "$CONTAINERS" || true

echo -e "${GREEN}Восстановление БД..."
sudo docker compose up -d pg-14
sudo docker compose exec pg-14 sh -c 'exec psql -U postgres memorybase < db/db-backups/dump.sql'

echo -e "${GREEN}Запуск новых контейнеров..."
sudo docker compose up -d

echo -e "${GREEN}Удаление ненужных файлов..."
find . ! \( -path './db' \) ! \( -name 'docker-compose.yml' \) ! \( -name '.env' \) -delete || true