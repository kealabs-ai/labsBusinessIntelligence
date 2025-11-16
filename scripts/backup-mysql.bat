@echo off
echo Fazendo backup do MySQL...

set BACKUP_DIR=backups
set BACKUP_FILE=%BACKUP_DIR%\labsbi_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

docker exec labsbi_mysql mysqldump -u root -ppassword labsbi > %BACKUP_FILE%

echo Backup salvo em: %BACKUP_FILE%