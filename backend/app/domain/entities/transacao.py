from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from decimal import Decimal

class Transaction(BaseModel):
    id: Optional[int] = None
    cash_register_id: int
    transaction_type: str = Field(..., description="Transaction type")
    amount: float = Field(..., gt=0, description="Amount must be greater than zero")
    description: Optional[str] = Field(None, max_length=255)
    transaction_date: datetime
    category: Optional[str] = Field(None, max_length=100)
    payment_method: Optional[str] = Field(None, max_length=100)

class TransactionCreate(BaseModel):
    cash_register_id: int
    transaction_type: str
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None
    payment_method: Optional[str] = None