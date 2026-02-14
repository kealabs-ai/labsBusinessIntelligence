from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from pydantic import BaseModel, validator
from application.services.unit_service import UnitService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()
unit_service = UnitService()
auth_service = AuthService()

class UnitCreate(BaseModel):
    unit_name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_time: str = "08:00:00"
    closing_time: str = "18:00:00"
    appointment_interval: int = 30
    notifications_enabled: bool = True
    notification_advance_hours: int = 24
    kea_client_id: Optional[str] = None
    
    @validator('unit_name')
    def validate_unit_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Nome da unidade é obrigatório')
        return v.strip()
    
    @validator('appointment_interval')
    def validate_appointment_interval(cls, v):
        if v < 15 or v > 120:
            raise ValueError('Intervalo deve estar entre 15 e 120 minutos')
        return v

class UnitResponse(BaseModel):
    id: int
    user_id: int
    unit_name: str
    address: str = None
    phone: str = None
    email: str = None
    opening_time: str
    closing_time: str
    appointment_interval: int
    notifications_enabled: bool
    notification_advance_hours: int
    kea_client_id: str = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return {"user_id": user.id, "role_id": user.role}

@router.post("/units", response_model=UnitResponse)
async def create_unit(unit_data: UnitCreate, current_user: dict = Depends(get_current_user)):
    try:
        unit = unit_service.create_unit(current_user["user_id"], current_user["role_id"], unit_data.dict())
        return unit.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        print(f"Erro ao criar unidade: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/units", response_model=List[UnitResponse])
async def get_units(id: Optional[int] = None, current_user: dict = Depends(get_current_user)):
    try:
        if id:
            unit = unit_service.get_unit_by_id(id)
            if not unit:
                raise HTTPException(status_code=404, detail="Unidade não encontrada")
            return [unit.to_dict()]
        else:
            units = unit_service.get_user_units(current_user["user_id"])
            return [unit.to_dict() for unit in units]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/units/{unit_id}", response_model=UnitResponse)
async def update_unit(unit_id: int, unit_data: UnitCreate, current_user: dict = Depends(get_current_user)):
    try:
        unit = unit_service.update_unit(current_user["user_id"], current_user["role_id"], unit_id, unit_data.dict())
        return unit.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/units/{unit_id}")
async def delete_unit(unit_id: int, current_user: dict = Depends(get_current_user)):
    try:
        success = unit_service.delete_unit(current_user["user_id"], unit_id)
        if not success:
            raise HTTPException(status_code=404, detail="Unidade não encontrada")
        return {"message": "Unidade excluída com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))