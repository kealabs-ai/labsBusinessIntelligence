from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from application.services.caixa_service import CashRegisterService
from application.services.token_manager import TokenManager
from domain.entities.caixa import CashRegister, CashRegisterCreate, CashRegisterUpdate
from domain.entities.transacao import Transacao, TransacaoCreate

router = APIRouter()
cash_register_service = CashRegisterService()
token_manager = TokenManager()

@router.get("/cash-registers", response_model=List[CashRegister])
def get_all_cash_registers(current_user: dict = Depends(token_manager.get_current_user)):
    user_id = current_user.get("user_id")
    return cash_register_service.get_all_cash_registers(user_id)

@router.get("/cash-registers/{cash_register_id}", response_model=CashRegister)
def get_cash_register(cash_register_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    user_id = current_user.get("user_id")
    cash_register = cash_register_service.get_cash_register_by_id(cash_register_id, user_id)
    if not cash_register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    return cash_register

@router.post("/cash-registers", response_model=CashRegister, status_code=status.HTTP_201_CREATED)
def create_cash_register(cash_register: CashRegisterCreate, current_user: dict = Depends(token_manager.get_current_user)):
    user_id = current_user.get("user_id")
    cash_register.user_id = user_id
    return cash_register_service.create_cash_register(cash_register)

@router.put("/cash-registers/{cash_register_id}", response_model=CashRegister)
def update_cash_register(cash_register_id: int, cash_register_update: CashRegisterUpdate, current_user: dict = Depends(token_manager.get_current_user)):
    user_id = current_user.get("user_id")
    updated_cash_register = cash_register_service.update_cash_register(cash_register_id, cash_register_update, user_id)
    if not updated_cash_register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    return updated_cash_register

@router.delete("/cash-registers/{cash_register_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cash_register(cash_register_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    user_id = current_user.get("user_id")
    cash_register = cash_register_service.get_cash_register_by_id(cash_register_id, user_id)
    if not cash_register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    cash_register_service.delete_cash_register(cash_register_id, user_id)
    return

@router.get("/cash-registers/{cash_register_id}/transactions", response_model=List[Transacao])
def get_transactions_from_cash_register(cash_register_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    user_id = current_user.get("user_id")
    cash_register = cash_register_service.get_cash_register_by_id(cash_register_id, user_id)
    if not cash_register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    return cash_register_service.get_transactions_from_cash_register(cash_register_id)

@router.post("/transactions", response_model=Transacao, status_code=status.HTTP_201_CREATED)
def add_transaction(transaction: TransacaoCreate, current_user: dict = Depends(token_manager.get_current_user)):
    user_id = current_user.get("user_id")
    cash_register = cash_register_service.get_cash_register_by_id(transaction.cash_register_id, user_id)
    if not cash_register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    return cash_register_service.add_transaction(transaction)

@router.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, current_user: dict = Depends(token_manager.get_current_user)):
    cash_register_service.delete_transaction(transaction_id)
    return
