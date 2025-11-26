from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from application.services.database_config_service import DatabaseConfigService
from application.services.auth_service import AuthService

router = APIRouter()

class MySQLConfig(BaseModel):
    host: str
    port: str
    user: str
    password: str
    database: str

class SQLServerConfig(BaseModel):
    host: str
    port: str
    user: str
    password: str
    database: str
    driver: str

class EnvironmentConfig(BaseModel):
    dbEngine: str
    environment: str
    port: str
    secretKey: str
    evolutionApiUrl: str
    evolutionInstance: str
    evolutionApiKey: str

class OpenVPNConfig(BaseModel):
    server: str
    port: str
    protocol: str
    username: str
    password: str
    caCert: str
    additionalConfig: str

def get_database_config_service():
    return DatabaseConfigService()

def get_auth_service():
    return AuthService()

@router.get("/database-config-public")
async def get_configurations_public():
    """Retorna as configurações sem autenticação (teste)"""
    try:
        service = DatabaseConfigService()
        return service.get_configurations()
    except Exception as e:
        return {"error": str(e), "mysql": {"host": "", "port": "3306", "user": "", "password": "", "database": ""}}

@router.get("/database-config")
async def get_configurations(
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Retorna as configurações atuais do banco de dados"""
    try:
        return service.get_configurations()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/test-mysql-public")
async def test_mysql_connection_public(config: MySQLConfig):
    """Testa a conexão com MySQL sem autenticação"""
    try:
        service = DatabaseConfigService()
        return service.test_mysql_connection(config.dict())
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/database-config/test-mysql")
async def test_mysql_connection(
    config: MySQLConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Testa a conexão com MySQL"""
    try:
        return service.test_mysql_connection(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/test-sqlserver-public")
async def test_sqlserver_connection_public(config: SQLServerConfig):
    """Testa a conexão com SQL Server sem autenticação"""
    try:
        service = DatabaseConfigService()
        return service.test_sqlserver_connection(config.dict())
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/database-config/test-sqlserver")
async def test_sqlserver_connection(
    config: SQLServerConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Testa a conexão com SQL Server"""
    try:
        return service.test_sqlserver_connection(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/test-environment")
async def test_environment_config(
    config: EnvironmentConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Valida as configurações de ambiente"""
    try:
        return service.test_environment_config(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/mysql-public")
async def save_mysql_config_public(config: MySQLConfig):
    """Salva a configuração MySQL sem autenticação"""
    try:
        service = DatabaseConfigService()
        return service.save_mysql_config(config.dict())
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/database-config/mysql")
async def save_mysql_config(
    config: MySQLConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Salva a configuração MySQL"""
    try:
        return service.save_mysql_config(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/sqlserver-public")
async def save_sqlserver_config_public(config: SQLServerConfig):
    """Salva a configuração SQL Server sem autenticação"""
    try:
        service = DatabaseConfigService()
        return service.save_sqlserver_config(config.dict())
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/database-config/sqlserver")
async def save_sqlserver_config(
    config: SQLServerConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Salva a configuração SQL Server"""
    try:
        return service.save_sqlserver_config(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/environment")
async def save_environment_config(
    config: EnvironmentConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Salva as configurações de ambiente"""
    try:
        return service.save_environment_config(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/test-openvpn")
async def test_openvpn_connection(
    config: OpenVPNConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Testa a configuração OpenVPN"""
    try:
        return service.test_openvpn_connection(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/database-config/openvpn")
async def save_openvpn_config(
    config: OpenVPNConfig,
    current_user: dict = Depends(AuthService().get_current_user),
    service: DatabaseConfigService = Depends(get_database_config_service)
):
    """Salva a configuração OpenVPN"""
    try:
        return service.save_openvpn_config(config.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))