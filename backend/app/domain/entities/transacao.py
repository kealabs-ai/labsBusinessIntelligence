from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from decimal import Decimal

class Transacao(BaseModel):
    id: Optional[int] = None
    user_id: int
    tipo: Literal['entrada', 'saida'] = Field(..., description="Tipo da transação: entrada ou saida")
    categoria: str = Field(..., min_length=1, max_length=100)
    descricao: str = Field(..., min_length=1, max_length=255)
    valor: Decimal = Field(..., gt=0, description="Valor deve ser maior que zero")
    data_transacao: datetime
    metodo_pagamento: str = Field(..., max_length=50)
    observacoes: Optional[str] = Field(None, max_length=500)
    created_at: Optional[datetime] = None
    status: bool = Field(default=True, description="Status ativo/inativo")