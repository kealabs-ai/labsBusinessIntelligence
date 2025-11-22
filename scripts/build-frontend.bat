@echo off
echo Fazendo build do frontend...
cd /d "%~dp0.."
docker-compose build frontend
echo Build concluido!
pause