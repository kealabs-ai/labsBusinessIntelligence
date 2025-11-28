#!/bin/bash

set -e

echo "🚀 DEPLOY MANUAL - LabsBusinessIntelligence"
echo "=========================================="

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Execute este script no diretório raiz do projeto"
    exit 1
fi

# Função para cleanup
cleanup() {
    echo "🧹 Limpando containers antigos..."
    docker stop labsbi_backend labsbi_frontend 2>/dev/null || true
    docker rm labsbi_backend labsbi_frontend 2>/dev/null || true
    docker rmi labsbusinessintelligence_backend labsbusinessintelligence_frontend 2>/dev/null || true
}

# Função para build
build_images() {
    echo "🔨 Construindo imagens..."
    
    echo "📦 Building Backend..."
    docker build -t labsbusinessintelligence_backend ./backend
    
    echo "📦 Building Frontend..."  
    docker build -t labsbusinessintelligence_frontend ./frontend
    
    echo "✅ Imagens construídas com sucesso"
}

# Função para deploy
deploy() {
    echo "🚀 Iniciando deploy..."
    
    # Criar network
    docker network create labsbi_network 2>/dev/null || echo "Network já existe"
    
    # Deploy Backend
    echo "🔧 Iniciando Backend..."
    docker run -d --name labsbi_backend \
        --network labsbi_network \
        --restart unless-stopped \
        -e DB_ENGINE=mysql \
        -e MYSQL_HOST=72.60.140.128 \
        -e MYSQL_PORT=33060 \
        -e MYSQL_USER=kealabs \
        -e MYSQL_PASSWORD="Kea2025@!@" \
        -e MYSQL_DATABASE=labsbi_mysql_db \
        -e SECRET_KEY=your-super-secret-key-here \
        -e ENVIRONMENT=dev \
        -e PORT=6002 \
        -p 6002:6002 \
        labsbusinessintelligence_backend
    
    echo "⏳ Aguardando backend inicializar..."
    sleep 15
    
    # Deploy Frontend
    echo "🎨 Iniciando Frontend..."
    docker run -d --name labsbi_frontend \
        --network labsbi_network \
        --restart unless-stopped \
        -e REACT_APP_API_URL=http://72.60.140.128:6002 \
        -p 3002:80 \
        labsbusinessintelligence_frontend
    
    echo "⏳ Aguardando inicialização completa..."
    sleep 20
}

# Função para verificar status
check_status() {
    echo "📊 Verificando status..."
    
    echo "=== CONTAINERS ==="
    docker ps --filter name=labsbi --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo "=== LOGS BACKEND ==="
    docker logs labsbi_backend --tail=10
    
    echo ""
    echo "=== LOGS FRONTEND ==="
    docker logs labsbi_frontend --tail=10
    
    echo ""
    echo "=== CONECTIVIDADE ==="
    curl -I http://localhost:6002/docs 2>/dev/null && echo "✅ Backend API OK" || echo "❌ Backend não acessível"
    curl -I http://localhost:3002 2>/dev/null && echo "✅ Frontend OK" || echo "❌ Frontend não acessível"
}

# Menu principal
case "${1:-deploy}" in
    "cleanup")
        cleanup
        ;;
    "build")
        build_images
        ;;
    "deploy")
        cleanup
        build_images
        deploy
        check_status
        echo ""
        echo "🎉 DEPLOY CONCLUÍDO!"
        echo "Frontend: http://72.60.140.128:3002"
        echo "Backend: http://72.60.140.128:6002"
        echo "API Docs: http://72.60.140.128:6002/docs"
        ;;
    "status")
        check_status
        ;;
    *)
        echo "Uso: $0 [cleanup|build|deploy|status]"
        echo "  cleanup - Remove containers e imagens"
        echo "  build   - Constrói apenas as imagens"
        echo "  deploy  - Deploy completo (padrão)"
        echo "  status  - Verifica status atual"
        ;;
esac