#!/usr/bin/env bash

echo "Создание файла .env..."
cp .env.sample .env
echo "Делаем dump БД..."
sudo docker compose exec -T pg-14 sh -c 'exec pg_dump -U postgres --inserts memorybase > /backup/dump.sql'
echo "Обновляем образы..."
sudo docker compose build
echo "Останавливаем и удаляем контейнеры..."
sudo docker compose down
echo "Удаление старых контейнеров..."
CONTAINERS=$(sudo docker ps -a -f status=exited -q)
echo "Containers: $CONTAINERS"
sudo docker rm "$CONTAINERS" || true
echo "Поднимаем базу и восстанавливаем..."
sudo docker compose up -d pg-14
sudo docker compose exec pg-14 sh -c 'exec psql -U postgres memorybase < db/db-backups/dump.sql'
echo "Запускаем новые контейнеры..."
sudo docker compose up -d
echo "Удаляем всё кроме зависимостей pg и файла docker-compose..."
find . ! \( -path './db' \) ! \( -name 'docker-compose.yml' \) ! \( -name '.env' \) -delete || true