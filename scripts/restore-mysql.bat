@echo off
echo Restaurando backup do MySQL...

if "%1"=="" (
    echo Uso: restore-mysql.bat [arquivo_backup.sql]
    echo Exemplo: restore-mysql.bat backups\labsbi_backup_20241115.sql
    exit /b 1
)

docker exec -i labsbi_mysql mysql -u root -ppassword labsbi < %1

echo Backup restaurado com sucesso!