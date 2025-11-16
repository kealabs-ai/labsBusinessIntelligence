@echo off
echo Iniciando LabsBusinessIntelligence em modo desenvolvimento...

echo Copiando arquivos de ambiente...
if not exist backend\.env (
    copy backend\.env.example backend\.env
)
if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
)

echo Iniciando servicos com Docker Compose...
docker-compose up -d

echo Aguardando servicos iniciarem...
timeout /t 10

echo Verificando status dos servicos...
docker-compose ps

echo.
echo LabsBusinessIntelligence iniciado com sucesso!
echo.
echo Frontend: http://localhost:3002
echo Backend API: http://localhost:6002
echo.
echo Para ver os logs: docker-compose logs -f
echo Para parar: docker-compose down