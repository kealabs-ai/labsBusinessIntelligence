#!/bin/bash

echo "🔍 VERIFICAÇÃO DO AMBIENTE DE DEPLOY"
echo "===================================="

# Verificar Docker
echo "📦 Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker encontrado: $(docker --version)"
    
    # Verificar se Docker está rodando
    if docker ps &> /dev/null; then
        echo "✅ Docker daemon está rodando"
    else
        echo "❌ Docker daemon não está rodando"
        exit 1
    fi
else
    echo "❌ Docker não encontrado"
    exit 1
fi

# Verificar portas
echo ""
echo "🔌 Verificando portas..."
check_port() {
    local port=$1
    local service=$2
    if netstat -tuln | grep ":$port " &> /dev/null; then
        echo "⚠️  Porta $port ($service) já está em uso"
        return 1
    else
        echo "✅ Porta $port ($service) disponível"
        return 0
    fi
}

check_port 3002 "Frontend"
check_port 6002 "Backend"

# Verificar conectividade com MySQL externo
echo ""
echo "🗄️ Verificando conectividade com MySQL..."
if command -v mysql &> /dev/null; then
    if mysql -h 72.60.140.128 -P 33060 -u kealabs -p'Kea2025@!@' -e "SELECT 1;" &> /dev/null; then
        echo "✅ Conexão com MySQL externa OK"
    else
        echo "⚠️  Não foi possível conectar ao MySQL externo"
    fi
else
    echo "ℹ️  Cliente MySQL não instalado (usando Docker para testes)"
fi

# Verificar arquivos essenciais
echo ""
echo "📁 Verificando arquivos essenciais..."
files=(
    "backend/Dockerfile"
    "frontend/Dockerfile" 
    "backend/.env.example"
    "frontend/.env.example"
    "docker-compose.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file não encontrado"
    fi
done

# Verificar espaço em disco
echo ""
echo "💾 Verificando espaço em disco..."
available_space=$(df -h . | awk 'NR==2 {print $4}')
echo "📊 Espaço disponível: $available_space"

# Verificar memória
echo ""
echo "🧠 Verificando memória..."
if command -v free &> /dev/null; then
    free -h
else
    echo "ℹ️  Comando 'free' não disponível"
fi

echo ""
echo "🏁 Verificação concluída!"
echo "===================================="