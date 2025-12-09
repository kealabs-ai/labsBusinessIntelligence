from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from application.services.auth_service import AuthService
import mysql.connector
from infrastructure.config.env_manager import env

router = APIRouter()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/user-unit")
async def get_user_unit(user=Depends(get_current_user)):
    try:
        db_config = env.get_database_config()
        connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
        
        conn = mysql.connector.connect(**connection_config)
        cursor = conn.cursor(dictionary=True)
        
        try:
            # Buscar unit_id do usuário e nome da unidade
            cursor.execute("""
                SELECT u.unit_id, us.unit_name 
                FROM users u 
                LEFT JOIN unit_settings us ON u.unit_id = us.id 
                WHERE u.id = %s
            """, (user.id,))
            
            result = cursor.fetchone()
            
            if result and result['unit_id']:
                return {
                    "success": True,
                    "unit_id": result['unit_id'],
                    "unit_name": result['unit_name'] or 'Unidade sem nome'
                }
            else:
                return {
                    "success": True,
                    "unit_id": None,
                    "unit_name": 'Sem unidade'
                }
        finally:
            cursor.close()
            conn.close()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))