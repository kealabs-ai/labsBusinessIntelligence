from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ....application.services.caixa_service import CaixaService
from ....application.services.token_manager import TokenManager
from ....domain.entities.caixa import Caixa, CaixaCreate, CaixaUpdate
from ....domain.entities.transacao import Transacao, TransacaoCreate

router = APIRouter()
caixa_service = CaixaService()
token_manager = TokenManager()

@router.get("/caixas", response_model=List[Caixa])
def get_all_caixas(current_user: dict = Depends(token_manager.get_current_user)):
    usuario_id = current_user.get("user_id")
    return caixa_service.get_all_caixas(usuario_id)

@router.get("/caixas/{caixa_id}", response_model=Caixa)
def get_caixa(caixa_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    usuario_id = current_user.get("user_id")
    caixa = caixa_service.get_caixa_by_id(caixa_id, usuario_id)
    if not caixa:
        raise HTTPException(status_code=404, detail="Caixa not found")
    return caixa

@router.post("/caixas", response_model=Caixa, status_code=status.HTTP_201_CREATED)
def create_caixa(caixa: CaixaCreate, current_user: dict = Depends(token_manager.get_current_user)):
    usuario_id = current_user.get("user_id")
    caixa.usuario_id = usuario_id
    return caixa_service.create_caixa(caixa)

@router.put("/caixas/{caixa_id}", response_model=Caixa)
def update_caixa(caixa_id: int, caixa_update: CaixaUpdate, current_user: dict = Depends(token_manager.get_current_user)):
    usuario_id = current_user.get("user_id")
    updated_caixa = caixa_service.update_caixa(caixa_id, caixa_update, usuario_id)
    if not updated_caixa:
        raise HTTPException(status_code=404, detail="Caixa not found")
    return updated_caixa

@router.delete("/caixas/{caixa_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_caixa(caixa_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    usuario_id = current_user.get("user_id")
    caixa = caixa_service.get_caixa_by_id(caixa_id, usuario_id)
    if not caixa:
        raise HTTPException(status_code=404, detail="Caixa not found")
    caixa_service.delete_caixa(caixa_id, usuario_id)
    return

@router.get("/caixas/{caixa_id}/transacoes", response_model=List[Transacao])
def get_transacoes_from_caixa(caixa_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    usuario_id = current_user.get("user_id")
    caixa = caixa_service.get_caixa_by_id(caixa_id, usuario_id)
    if not caixa:
        raise HTTPException(status_code=404, detail="Caixa not found")
    return caixa_service.get_transacoes_from_caixa(caixa_id)

@router.post("/transacoes", response_model=Transacao, status_code=status.HTTP_201_CREATED)
def add_transacao(transacao: TransacaoCreate, current_user: dict = Depends(token_manager.get_current_user)):
    usuario_id = current_user.get("user_id")
    caixa = caixa_service.get_caixa_by_id(transacao.caixa_id, usuario_id)
    if not caixa:
        raise HTTPException(status_code=404, detail="Caixa not found")
    return caixa_service.add_transacao(transacao)

@router.delete("/transacoes/{transacao_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transacao(transacao_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    # Here we should verify if the user has permission to delete this transaction
    # For simplicity, we are not doing it now.
    caixa_service.delete_transacao(transacao_id)
    return
