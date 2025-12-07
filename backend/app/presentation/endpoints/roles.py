from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from pydantic import BaseModel
from application.services.auth_service import AuthService
from application.services.role_service import RoleService

router = APIRouter()
security = HTTPBearer()
auth_service = AuthService()
role_service = RoleService()

class RoleResponse(BaseModel):
    value: str
    label: str
    description: Optional[str] = None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return {"user_id": user.id, "role": user.role}

@router.get("/roles", response_model=List[RoleResponse])
async def get_roles(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    try:
        roles = role_service.get_all_roles()
        return [role.to_dict() for role in roles]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))