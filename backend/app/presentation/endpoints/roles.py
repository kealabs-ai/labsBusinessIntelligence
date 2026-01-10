from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from application.services.auth_service import AuthService
from infrastructure.config.env_manager import env
import mysql.connector

router = APIRouter()
security = HTTPBearer()
auth_service = AuthService()

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await auth_service.get_current_user(credentials.credentials)
    if not user or user.role_id != 1:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/roles")
async def get_roles(admin=Depends(get_current_admin)):
    try:
        db_config = env.get_database_config()
        connection = mysql.connector.connect(
            host=db_config['host'],
            port=db_config['port'],
            user=env.get_required('MYSQL_USER'),
            password=env.get_required('MYSQL_PASSWORD'),
            database=db_config['database']
        )
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT role_id, name FROM roles ORDER BY role_id")
        roles = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return [{"value": str(role['role_id']), "label": role['name']} for role in roles]
    except Exception as e:
        # Fallback to hardcoded roles if table doesn't exist
        return [
            {"value": "1", "label": "Administrador"},
            {"value": "2", "label": "Gerente"},
            {"value": "3", "label": "Operador"},
            {"value": "4", "label": "Usuário"}
        ]