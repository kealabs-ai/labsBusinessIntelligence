from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CashRegister(BaseModel):
    id: Optional[int] = None
    name: str
    initial_balance: float
    current_balance: float
    opening_date: datetime = datetime.now()
    closing_date: Optional[datetime] = None
    status: str
    user_id: int

class CashRegisterCreate(BaseModel):
    name: str
    initial_balance: float
    user_id: int

class CashRegisterUpdate(BaseModel):
    name: Optional[str] = None
    current_balance: Optional[float] = None
    status: Optional[str] = None
    closing_date: Optional[datetime] = None
