from fastapi import APIRouter
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.get("/database-config")
async def get_configurations():
    """Carregar configurações do .env"""
    return {
        "mysql": {
            "host": os.getenv("MYSQL_HOST", ""),
            "port": os.getenv("MYSQL_PORT", "3306"),
            "user": os.getenv("MYSQL_USER", ""),
            "password": os.getenv("MYSQL_PASSWORD", ""),
            "database": os.getenv("MYSQL_DATABASE", "")
        },
        "sqlserver": {
            "host": os.getenv("SQLSERVER_HOST", ""),
            "port": "1433",
            "user": os.getenv("SQLSERVER_USER", ""),
            "password": os.getenv("SQLSERVER_PASSWORD", ""),
            "database": os.getenv("SQLSERVER_DATABASE", "")
        },
        "environment": {
            "dbEngine": os.getenv("DB_ENGINE", "mysql"),
            "environment": os.getenv("ENVIRONMENT", "dev"),
            "port": os.getenv("PORT", "6002"),
            "secretKey": os.getenv("SECRET_KEY", ""),
            "evolutionApiUrl": os.getenv("URL_EVOLUTION_API", ""),
            "evolutionInstance": os.getenv("INSTANCE", ""),
            "evolutionApiKey": os.getenv("API_KEY", "")
        }
    }