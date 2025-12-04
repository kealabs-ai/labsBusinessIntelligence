from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class CashRegister(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., max_length=255)
    initial_balance: Decimal = Field(..., description="Saldo inicial")
    current_balance: Decimal = Field(..., description="Saldo atual")
    opening_date: datetime
    closing_date: Optional[datetime] = None
    status: str = Field(..., max_length=50)
    user_id: int

class CashRegisterCreate(BaseModel):
    name: str
    initial_balance: Decimal
    user_id: int

class CashRegisterUpdate(BaseModel):
    name: Optional[str] = None
    current_balance: Optional[Decimal] = None
    closing_date: Optional[datetime] = None
    status: Optional[str] = None