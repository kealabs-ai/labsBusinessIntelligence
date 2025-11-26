#!/bin/bash

echo "=== JENKINS DEPLOY SCRIPT ==="

# Configurar firewall
echo "Configurando firewall..."
sudo ufw allow 3002/tcp || true
sudo ufw allow 6002/tcp || true

# Parar containers existentes
echo "Parando containers..."
docker-compose down || true

# Remover imagens antigas
echo "Removendo imagens antigas..."
docker rmi labsbusinessintelligence_frontend labsbusinessintelligence_backend || true

# Build e start
echo "Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar inicialização
echo "Aguardando inicialização..."
sleep 30

# Verificar status
echo "Verificando status dos containers..."
docker-compose ps

# Verificar logs
echo "Verificando logs..."
docker-compose logs backend --tail=10
docker-compose logs frontend --tail=10

# Teste de conectividade
echo "Testando conectividade..."
curl -I http://localhost:6002 && echo "Backend OK" || echo "Backend FAILED"
curl -I http://localhost:3002 && echo "Frontend OK" || echo "Frontend FAILED"

# Informações de acesso
echo "========================================="
echo "DEPLOY CONCLUÍDO"
echo "========================================="
echo "Frontend: http://72.60.140.128:3002"
echo "Backend: http://72.60.140.128:6002"
echo "Backend Docs: http://72.60.140.128:6002/docs"
echo "========================================"