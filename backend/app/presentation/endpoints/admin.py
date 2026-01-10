from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from application.services.auth_service import AuthService
from application.services.admin_service import AdminService
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

class UserCreateRequest(BaseModel):
    name: str
    username: str
    email: str
    phone: Optional[str] = None
    mobile: Optional[str] = None
    password: str
    role: str = '4'
    kea_client_id: Optional[str] = None
    unit_id: Optional[int] = None

class UserUpdateRequest(BaseModel):
    username: str = None
    email: str = None
    role: str = None
    kea_client_id: str = None
    unit_id: int = None
    is_active: bool = None
    _method: str = None

class UserDeleteRequest(BaseModel):
    _method: str

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user or user.role_id != 1:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/users")
async def get_users(page: int = 1, limit: int = 10, admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        result = service.get_all_users(page, limit)
        return {
            "users": [user.dict() for user in result["users"]],
            "total": result["total"],
            "page": result["page"],
            "pages": result["pages"]
        }
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/users")
async def create_user(request: UserCreateRequest, admin=Depends(get_current_admin)):
    try:
        print(f"=== ENDPOINT CREATE USER ===")
        print(f"Request recebido: {request}")
        print(f"Request dict: {request.dict()}")
        print(f"Admin: {admin}")
        
        service = AdminService()
        user = service.create_user(request.dict())
        
        result = {"success": True, "message": "Usuário criado com sucesso", "data": user.dict()}
        print(f"✅ Resultado final: {result}")
        return result
        
    except ValueError as e:
        print(f"❌ Validation error: {str(e)}")
        logger.error(f"Validation error creating user: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        print(f"❌ Exception error: {str(e)}")
        print(f"Exception type: {type(e)}")
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/users/{user_id}")
async def update_or_delete_user(user_id: int, request: dict, admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        
        if request.get('_method') == 'DELETE':
            service.delete_user(user_id)
            return {"success": True, "message": "Usuário desativado com sucesso"}
        elif request.get('_method') == 'PUT':
            # Remove _method from request data
            update_data = {k: v for k, v in request.items() if k != '_method'}
            user = service.update_user(user_id, update_data)
            if not user:
                raise HTTPException(status_code=404, detail="Usuário não encontrado")
            return {"success": True, "message": "Usuário atualizado com sucesso", "data": user.dict()}
        else:
            raise HTTPException(status_code=400, detail="Método não especificado")
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing user operation: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/modules")
async def get_modules(admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        modules = service.get_all_modules()
        return {"success": True, "data": modules}
    except Exception as e:
        logger.error(f"Error fetching modules: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/permissions/{user_id}")
async def get_user_permissions(user_id: int, admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        permissions = service.get_user_permissions(user_id)
        return {"success": True, "data": permissions}
    except Exception as e:
        logger.error(f"Error fetching permissions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/permissions/{user_id}")
async def update_user_permissions(user_id: int, permissions: dict, admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        service.update_user_permissions(user_id, permissions)
        return {"success": True, "message": "Permissions updated"}
    except Exception as e:
        logger.error(f"Error updating permissions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/units")
async def get_units(admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        units = service.get_all_units()
        return {"success": True, "data": units}
    except Exception as e:
        logger.error(f"Error fetching units: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))