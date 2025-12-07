from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from application.services.auth_service import AuthService
from application.services.admin_service import AdminService
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

class UserCreateRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = '4'
    kea_client_id: int = None

class UserUpdateRequest(BaseModel):
    username: str = None
    email: str = None
    role: str = None
    kea_client_id: int = None
    is_active: bool = None

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
        service = AdminService()
        user = service.create_user(request.dict())
        return {"success": True, "data": user.dict()}
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users/{user_id}")
async def update_user(user_id: int, request: UserUpdateRequest, admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        user = service.update_user(user_id, request.dict(exclude_unset=True))
        return {"success": True, "data": user.dict()}
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, admin=Depends(get_current_admin)):
    try:
        service = AdminService()
        service.delete_user(user_id)
        return {"success": True, "message": "User deactivated"}
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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