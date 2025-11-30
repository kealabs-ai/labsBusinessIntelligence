from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from domain.entities.client import Client
from application.services.client_service import ClientService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()

class ClientCreateRequest(BaseModel):
    full_name: str
    phone_whatsapp: str
    email: str
    birth_date: Optional[date] = None
    note: Optional[str] = None

class ClientUpdateRequest(BaseModel):
    full_name: str
    phone_whatsapp: str
    email: str
    birth_date: Optional[date] = None
    note: Optional[str] = None
    status: bool

class ClientStatusRequest(BaseModel):
    status: bool

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user.id

@router.post("/", response_model=Client)
async def create_client(
    request: ClientCreateRequest,
    user_id: int = Depends(get_current_user_id)
):
    client_service = ClientService()
    
    # Check if phone already exists
    if await client_service.check_phone_exists(request.phone_whatsapp):
        raise HTTPException(status_code=400, detail="Já existe um cliente cadastrado com este número de telefone")
    
    client = Client(
        user_id=user_id,
        full_name=request.full_name,
        phone_whatsapp=request.phone_whatsapp,
        email=request.email,
        birth_date=request.birth_date,
        note=request.note
    )
    return await client_service.create_client(client)

@router.post("/{client_id}/update", response_model=Client)
async def update_client(
    client_id: int,
    request: ClientUpdateRequest,
    user_id: int = Depends(get_current_user_id)
):
    client_service = ClientService()
    
    # Verify client belongs to user
    existing_client = await client_service.get_client_by_id(client_id)
    if not existing_client or existing_client.user_id != user_id:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Check if phone already exists (excluding current client)
    if await client_service.check_phone_exists(request.phone_whatsapp, client_id):
        raise HTTPException(status_code=400, detail="Já existe um cliente cadastrado com este número de telefone")
    
    client = Client(
        client_id=client_id,
        user_id=user_id,
        full_name=request.full_name,
        phone_whatsapp=request.phone_whatsapp,
        email=request.email,
        birth_date=request.birth_date,
        note=request.note,
        status=request.status
    )
    
    updated_client = await client_service.update_client(client_id, client)
    if not updated_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return updated_client

@router.post("/{client_id}/status")
async def update_client_status(
    client_id: int,
    request: ClientStatusRequest,
    user_id: int = Depends(get_current_user_id)
):
    client_service = ClientService()
    
    # Verify client belongs to user
    existing_client = await client_service.get_client_by_id(client_id)
    if not existing_client or existing_client.user_id != user_id:
        raise HTTPException(status_code=404, detail="Client not found")
    
    success = await client_service.update_client_status(client_id, request.status)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return {"message": f"Client {'activated' if request.status else 'deactivated'} successfully"}

@router.get("/test")
async def test_clients():
    return {"message": "Clients endpoint is working"}

@router.get("/", response_model=List[Client])
async def get_clients(user_id: int = Depends(get_current_user_id)):
    client_service = ClientService()
    return await client_service.get_clients_by_user(user_id)

@router.get("/{client_id}", response_model=Client)
async def get_client(
    client_id: int,
    user_id: int = Depends(get_current_user_id)
):
    client_service = ClientService()
    client = await client_service.get_client_by_id(client_id)
    
    if not client or client.user_id != user_id:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return client