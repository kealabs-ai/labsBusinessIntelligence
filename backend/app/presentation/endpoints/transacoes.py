from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime
from decimal import Decimal
from domain.entities.transacao import Transacao
from application.services.transacao_service import TransacaoService
from application.services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()

class TransacaoCreateRequest(BaseModel):
    tipo: Literal['entrada', 'saida']
    categoria: str
    descricao: str
    valor: Decimal
    data_transacao: datetime
    metodo_pagamento: str
    observacoes: Optional[str] = None

class TransacaoUpdateRequest(BaseModel):
    tipo: Literal['entrada', 'saida']
    categoria: str
    descricao: str
    valor: Decimal
    data_transacao: datetime
    metodo_pagamento: str
    observacoes: Optional[str] = None
    status: bool

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
    transacao = Transacao(
        user_id=user_id,
        tipo=request.tipo,
        categoria=request.categoria,
        descricao=request.descricao,
        valor=request.valor,
        data_transacao=request.data_transacao,
        metodo_pagamento=request.metodo_pagamento,
        observacoes=request.observacoes
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
    
    if not transacao or transacao.user_id != user_id:
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
    if not existing_transacao or existing_transacao.user_id != user_id:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    transacao = Transacao(
        id=transacao_id,
        user_id=user_id,
        tipo=request.tipo,
        categoria=request.categoria,
        descricao=request.descricao,
        valor=request.valor,
        data_transacao=request.data_transacao,
        metodo_pagamento=request.metodo_pagamento,
        observacoes=request.observacoes,
        status=request.status
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
    if not existing_transacao or existing_transacao.user_id != user_id:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    success = await transacao_service.delete_transacao(transacao_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transacao not found")
    
    return {"message": "Transacao deleted successfully"}