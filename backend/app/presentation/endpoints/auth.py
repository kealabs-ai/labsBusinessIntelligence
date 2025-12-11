from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    kea_client_id: Optional[str] = None
    role_id: Optional[int] = None
    unit_id: Optional[int] = None

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    auth_service = AuthService()
    result = await auth_service.authenticate_user(request.username, request.password)
    
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token, user = result
    
    print(f"Login user data: {user}")
    print(f"User kea_client_id: {user.kea_client_id}")
    print(f"User role_id: {user.role_id}")
    print(f"User unit_id: {user.unit_id}")
    
    response_data = {
        "access_token": token.access_token,
        "token_type": token.token_type,
        "user_id": token.user_id,
        "kea_client_id": user.kea_client_id if user.kea_client_id else "DEFAULT_KEA_CLIENT",
        "role_id": user.role_id if user.role_id else 1,
        "unit_id": user.unit_id if user.unit_id else 0
    }
    
    print(f"Response data: {response_data}")
    
    return LoginResponse(**response_data)

@router.get("/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"id": user.id, "username": user.username, "email": user.email, "role_id": user.role_id, "kea_client_id": user.kea_client_id, "unit_id": user.unit_id}