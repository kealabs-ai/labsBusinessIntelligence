#!/bin/bash

echo "=== DIAGNÓSTICO E CORREÇÃO ==="

# Parar tudo
docker-compose down
docker stop $(docker ps -aq) 2>/dev/null || true

# Configurar firewall
sudo ufw disable
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 3002/tcp
sudo ufw allow 6002/tcp

# Verificar se as portas estão livres
sudo netstat -tlnp | grep -E ':(3002|6002)' && echo "Portas em uso - matando processos" || echo "Portas livres"
sudo fuser -k 3002/tcp 2>/dev/null || true
sudo fuser -k 6002/tcp 2>/dev/null || true

# Rebuild completo
docker system prune -f
docker-compose up --build -d

# Aguardar
sleep 20

# Verificar
echo "=== STATUS ==="
docker-compose ps
echo "=== PORTAS ==="
sudo netstat -tlnp | grep -E ':(3002|6002)'
echo "=== TESTE LOCAL ==="
curl -I http://127.0.0.1:3002 2>/dev/null && echo "Frontend OK" || echo "Frontend FAIL"
curl -I http://127.0.0.1:6002 2>/dev/null && echo "Backend OK" || echo "Backend FAIL"