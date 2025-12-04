from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime
from decimal import Decimal
from domain.entities.transacao import Transacao
from application.services.transacao_service import TransacaoService
from application.services.cash_register_service import CashRegisterService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()

class TransacaoCreateRequest(BaseModel):
    transaction_type: Literal['entrada', 'saida']
    amount: Decimal
    description: Optional[str] = None
    transaction_date: datetime
    category: Optional[str] = None
    payment_method: Optional[str] = None

class TransacaoUpdateRequest(BaseModel):
    transaction_type: Literal['entrada', 'saida']
    amount: Decimal
    description: Optional[str] = None
    transaction_date: datetime
    category: Optional[str] = None
    payment_method: Optional[str] = None

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user.id

@router.post("/", response_model=Transacao)
async def create_transacao(
    request: TransacaoCreateRequest,
    user_id: int = Depends(get_current_user_id)
):
    transacao_service = TransacaoService()
    cash_register_service = CashRegisterService()
    
    # Get or create default cash register for user
    cash_register = await cash_register_service.get_or_create_default_cash_register(user_id)
    
    transacao = Transacao(
        cash_register_id=cash_register.id,
        transaction_type=request.transaction_type,
        amount=request.amount,
        description=request.description,
        transaction_date=request.transaction_date,
        category=request.category,
        payment_method=request.payment_method
    )
    return await transacao_service.create_transacao(transacao)

@router.get("/", response_model=dict)
async def get_transacoes(
    page: int = 1,
    limit: int = 10,
    user_id: int = Depends(get_current_user_id)
):
    transacao_service = TransacaoService()
    return await transacao_service.get_transacoes_by_user(user_id, page, limit)

@router.get("/resumo")
async def get_resumo_financeiro(user_id: int = Depends(get_current_user_id)):
    transacao_service = TransacaoService()
    return await transacao_service.get_resumo_financeiro(user_id)

@router.get("/{transacao_id}", response_model=Transacao)
async def get_transacao(
    transacao_id: int,
    user_id: int = Depends(get_current_user_id)
):
    transacao_service = TransacaoService()
    transacao = await transacao_service.get_transacao_by_id(transacao_id)
    
    if not transacao:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    return transacao

@router.post("/{transacao_id}/update", response_model=Transacao)
async def update_transacao(
    transacao_id: int,
    request: TransacaoUpdateRequest,
    user_id: int = Depends(get_current_user_id)
):
    transacao_service = TransacaoService()
    
    existing_transacao = await transacao_service.get_transacao_by_id(transacao_id)
    if not existing_transacao:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    transacao = Transacao(
        id=transacao_id,
        cash_register_id=existing_transacao.cash_register_id,
        transaction_type=request.transaction_type,
        amount=request.amount,
        description=request.description,
        transaction_date=request.transaction_date,
        category=request.category,
        payment_method=request.payment_method
    )
    
    updated_transacao = await transacao_service.update_transacao(transacao_id, transacao)
    if not updated_transacao:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    return updated_transacao

@router.delete("/{transacao_id}")
async def delete_transacao(
    transacao_id: int,
    user_id: int = Depends(get_current_user_id)
):
    transacao_service = TransacaoService()
    
    existing_transacao = await transacao_service.get_transacao_by_id(transacao_id)
    if not existing_transacao:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    success = await transacao_service.delete_transacao(transacao_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    return {"message": "Transacao deleted successfully"}