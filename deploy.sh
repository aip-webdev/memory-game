#!/usr/bin/env bash

echo "Создание файла .env..."
cp .env.sample .env
echo "Обновляем образы..."
sudo docker-compose build
echo "Останавливаем и удаляем контейнеры..."
sudo docker-compose down
echo "Запускаем новые контейнеры..."
sudo docker-compose up -d
echo "Удаляем всё кроме зависимостей pg и файла docker-compose..."
find . ! \( -path './db' \) ! \( -name 'docker-compose.yml' \) -delete || true