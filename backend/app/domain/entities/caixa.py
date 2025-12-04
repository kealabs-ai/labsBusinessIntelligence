from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Caixa(BaseModel):
    id: Optional[int] = None
    nome: str
    saldo_inicial: float
    saldo_atual: float
    data_abertura: datetime = datetime.now()
    data_fechamento: Optional[datetime] = None
    status: str
    usuario_id: int

class CaixaCreate(BaseModel):
    nome: str
    saldo_inicial: float
    usuario_id: int

class CaixaUpdate(BaseModel):
    nome: Optional[str] = None
    saldo_atual: Optional[float] = None
    status: Optional[str] = None
    data_fechamento: Optional[datetime] = None
