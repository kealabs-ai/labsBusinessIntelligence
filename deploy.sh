#!/bin/bash

echo "=== PARANDO CONTAINERS ==="
docker-compose down

echo "=== REMOVENDO IMAGENS ANTIGAS ==="
docker rmi labsbusinessintelligence_frontend labsbusinessintelligence_backend 2>/dev/null || true

echo "=== CONSTRUINDO E INICIANDO CONTAINERS ==="
docker-compose up --build -d

echo "=== AGUARDANDO INICIALIZAÇÃO ==="
sleep 10

echo "=== STATUS DOS CONTAINERS ==="
docker-compose ps

echo "=== VERIFICANDO PORTAS ==="
netstat -tlnp | grep -E ':(3002|6002)' || echo "Portas não encontradas"

echo "=== TESTANDO CONECTIVIDADE ==="
curl -I http://localhost:6002/api/v1/auth/health 2>/dev/null && echo "Backend OK" || echo "Backend FALHOU"
curl -I http://localhost:3002 2>/dev/null && echo "Frontend OK" || echo "Frontend FALHOU"

echo "=== DEPLOY CONCLUÍDO ==="
echo "Frontend: http://72.60.140.128:3002"
echo "Backend: http://72.60.140.128:6002"
echo "Para diagnóstico: ./check-status.sh"