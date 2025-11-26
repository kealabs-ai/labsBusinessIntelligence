#!/bin/bash

echo "=== CONFIGURANDO FIREWALL ==="

# Verificar se ufw está instalado
if command -v ufw &> /dev/null; then
    echo "Configurando UFW..."
    sudo ufw allow 3002/tcp
    sudo ufw allow 6002/tcp
    sudo ufw status
elif command -v firewall-cmd &> /dev/null; then
    echo "Configurando firewalld..."
    sudo firewall-cmd --permanent --add-port=3002/tcp
    sudo firewall-cmd --permanent --add-port=6002/tcp
    sudo firewall-cmd --reload
    sudo firewall-cmd --list-ports
else
    echo "Verificando iptables..."
    sudo iptables -I INPUT -p tcp --dport 3002 -j ACCEPT
    sudo iptables -I INPUT -p tcp --dport 6002 -j ACCEPT
    sudo iptables -L | grep -E "(3002|6002)"
fi

echo "=== PORTAS CONFIGURADAS ==="