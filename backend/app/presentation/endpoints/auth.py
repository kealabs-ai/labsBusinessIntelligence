from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
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

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    auth_service = AuthService()
    token = await auth_service.authenticate_user(request.username, request.password)
    
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return LoginResponse(
        access_token=token.access_token,
        token_type=token.token_type,
        user_id=token.user_id
    )

@router.get("/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"id": user.id, "username": user.username, "email": user.email, "role_id": user.role_id, "kea_client_id": user.kea_client_id}