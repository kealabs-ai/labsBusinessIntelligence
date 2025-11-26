#!/bin/bash

echo "Parando containers..."
docker-compose down

echo "Removendo imagens antigas..."
docker rmi labsbusinessintelligence_frontend labsbusinessintelligence_backend 2>/dev/null || true

echo "Construindo e iniciando containers..."
docker-compose up --build -d

echo "Verificando status dos containers..."
docker-compose ps

echo "Deploy concluído!"
echo "Frontend: http://72.60.140.128:3002"
echo "Backend: http://72.60.140.128:6002"