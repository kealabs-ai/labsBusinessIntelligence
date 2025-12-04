from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from decimal import Decimal

class Transacao(BaseModel):
    id: Optional[int] = None
    user_id: int
    tipo: str = Field(..., description="Tipo da transação (entrada/saida)")
    categoria: str = Field(..., max_length=100)
    descricao: str = Field(..., max_length=255)
    valor: Decimal = Field(..., gt=0, description="Valor deve ser maior que zero")
    data_transacao: datetime
    metodo_pagamento: str = Field(..., max_length=100)
    observacoes: Optional[str] = Field(None, max_length=500)
    status: bool = Field(default=True)
    created_at: Optional[datetime] = None

class TransacaoCreate(BaseModel):
    tipo: str
    categoria: str
    descricao: str
    valor: Decimal
    data_transacao: datetime
    metodo_pagamento: str
    observacoes: Optional[str] = None