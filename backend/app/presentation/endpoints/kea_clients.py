from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from pydantic import BaseModel
from application.services.kea_client_service import KeaClientService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()
kea_client_service = KeaClientService()
auth_service = AuthService()

class KeaClientCreate(BaseModel):
    name: str
    cpf_cnpj: str
    email: str
    site: Optional[str] = None
    phone_number: Optional[str] = None
    cell_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    address: Optional[str] = None
    status: bool = True
    payment_plan: Optional[str] = None
    user_quantity: int = 1
    last_payment_date: Optional[str] = None
    segmento: Optional[List[str]] = None

class KeaClientResponse(BaseModel):
    id: int
    name: str
    cpf_cnpj: str
    kea_identifier: str
    email: str
    site: Optional[str] = None
    phone_number: Optional[str] = None
    cell_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    address: Optional[str] = None
    status: bool
    payment_plan: Optional[str] = None
    user_quantity: int
    last_payment_date: Optional[str] = None
    segmento: Optional[List[str]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return {"user_id": user.id, "role_id": user.role_id, "role": user.role}

@router.post("/kea-clients", response_model=KeaClientResponse)
async def create_kea_client(client_data: KeaClientCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role_id") != 1:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    try:
        client = kea_client_service.create_kea_client(client_data.dict())
        return client.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/kea-clients", response_model=List[KeaClientResponse])
async def get_kea_clients(current_user: dict = Depends(get_current_user)):
    if current_user.get("role_id") != 1:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    try:
        clients = kea_client_service.get_all_kea_clients()
        return [client.to_dict() for client in clients]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/kea-clients/{client_id}", response_model=KeaClientResponse)
async def update_kea_client(client_id: int, client_data: KeaClientCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role_id") != 1:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    try:
        client = kea_client_service.update_kea_client(client_id, client_data.dict())
        return client.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/kea-clients/{client_id}")
async def delete_kea_client(client_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.get("role_id") != 1:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    try:
        success = kea_client_service.delete_kea_client(client_id)
        if not success:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        return {"message": "Cliente excluído com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))