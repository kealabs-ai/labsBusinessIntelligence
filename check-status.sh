#!/bin/bash

echo "=== STATUS DOS CONTAINERS ==="
docker-compose ps

echo -e "\n=== LOGS DO BACKEND ==="
docker-compose logs backend --tail=20

echo -e "\n=== LOGS DO FRONTEND ==="
docker-compose logs frontend --tail=20

echo -e "\n=== PORTAS EM USO ==="
netstat -tlnp | grep -E ':(3002|6002)'

echo -e "\n=== TESTE DE CONECTIVIDADE ==="
curl -I http://localhost:6002 2>/dev/null || echo "Backend não acessível"
curl -I http://localhost:3002 2>/dev/null || echo "Frontend não acessível"