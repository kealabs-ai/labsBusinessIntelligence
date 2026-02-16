#!/bin/bash

# Jenkins Docker Setup Script
# Este script resolve problemas de permissão do Docker no Jenkins

echo "=== Configurando permissões Docker para Jenkins ==="

# Adicionar usuário jenkins ao grupo docker
sudo usermod -aG docker jenkins
echo "✓ Usuário jenkins adicionado ao grupo docker"

# Definir permissões do socket Docker
sudo chmod 666 /var/run/docker.sock
echo "✓ Permissões do socket Docker configuradas"

# Reiniciar serviço Jenkins
sudo systemctl restart jenkins
echo "✓ Serviço Jenkins reiniciado"

# Verificar configuração
echo "=== Verificando configuração ==="
echo "Grupos do usuário jenkins:"
sudo -u jenkins groups

echo "Permissões do socket Docker:"
ls -la /var/run/docker.sock

echo "Testando acesso Docker:"
sudo -u jenkins docker --version

echo "=== Configuração concluída ==="
echo "Execute o pipeline novamente no Jenkins"