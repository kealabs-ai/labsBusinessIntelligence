from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from domain.entities.cash_register import CashRegister, CashRegisterCreate, CashRegisterUpdate
from application.services.cash_register_service import CashRegisterService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()

class CashRegisterCreateRequest(BaseModel):
    name: str
    initial_balance: Decimal

class CashRegisterUpdateRequest(BaseModel):
    name: Optional[str] = None
    current_balance: Optional[Decimal] = None
    closing_date: Optional[datetime] = None
    status: Optional[str] = None

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user.id

@router.post("/", response_model=CashRegister)
async def create_cash_register(
    request: CashRegisterCreateRequest,
    user_id: int = Depends(get_current_user_id)
):
    cash_register_service = CashRegisterService()
    cash_register_create = CashRegisterCreate(
        name=request.name,
        initial_balance=request.initial_balance,
        user_id=user_id
    )
    return await cash_register_service.create_cash_register(cash_register_create)

@router.get("/", response_model=List[CashRegister])
async def get_cash_registers(user_id: int = Depends(get_current_user_id)):
    cash_register_service = CashRegisterService()
    return await cash_register_service.get_cash_registers_by_user(user_id)

@router.get("/default", response_model=CashRegister)
async def get_default_cash_register(user_id: int = Depends(get_current_user_id)):
    cash_register_service = CashRegisterService()
    return await cash_register_service.get_or_create_default_cash_register(user_id)

@router.get("/{cash_register_id}", response_model=CashRegister)
async def get_cash_register(
    cash_register_id: int,
    user_id: int = Depends(get_current_user_id)
):
    cash_register_service = CashRegisterService()
    cash_register = await cash_register_service.get_cash_register_by_id(cash_register_id)
    
    if not cash_register or cash_register.user_id != user_id:
        raise HTTPException(status_code=404, detail="Cash register not found")
    
    return cash_register

@router.put("/{cash_register_id}", response_model=CashRegister)
async def update_cash_register(
    cash_register_id: int,
    request: CashRegisterUpdateRequest,
    user_id: int = Depends(get_current_user_id)
):
    cash_register_service = CashRegisterService()
    
    # Verify ownership
    existing = await cash_register_service.get_cash_register_by_id(cash_register_id)
    if not existing or existing.user_id != user_id:
        raise HTTPException(status_code=404, detail="Cash register not found")
    
    cash_register_update = CashRegisterUpdate(
        name=request.name,
        current_balance=request.current_balance,
        closing_date=request.closing_date,
        status=request.status
    )
    
    updated = await cash_register_service.update_cash_register(cash_register_id, cash_register_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Cash register not found")
    
    return updated