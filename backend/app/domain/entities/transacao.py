from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from decimal import Decimal

class Transacao(BaseModel):
    id: Optional[int] = None
    cash_register_id: int
    transaction_type: str = Field(..., description="Tipo da transação (entrada/saida)")
    amount: Decimal = Field(..., gt=0, description="Valor deve ser maior que zero")
    description: Optional[str] = Field(None, max_length=255)
    transaction_date: datetime
    category: Optional[str] = Field(None, max_length=100)
    payment_method: Optional[str] = Field(None, max_length=100)
    unit_id: Optional[int] = None
    kea_client_id: Optional[str] = None
    role_id: Optional[int] = None
    
    # Aliases for backward compatibility
    @property
    def user_id(self) -> int:
        return self.cash_register_id
    
    @property
    def tipo(self) -> str:
        return self.transaction_type
    
    @property
    def valor(self) -> Decimal:
        return self.amount
    
    @property
    def descricao(self) -> Optional[str]:
        return self.description
    
    @property
    def data_transacao(self) -> datetime:
        return self.transaction_date
    
    @property
    def categoria(self) -> Optional[str]:
        return self.category
    
    @property
    def metodo_pagamento(self) -> Optional[str]:
        return self.payment_method

class TransacaoCreate(BaseModel):
    cash_register_id: int
    transaction_type: str
    amount: Decimal
    description: Optional[str] = None
    transaction_date: datetime
    category: Optional[str] = None
    payment_method: Optional[str] = None
    unit_id: Optional[int] = None
    kea_client_id: Optional[str] = None
    role_id: Optional[int] = None