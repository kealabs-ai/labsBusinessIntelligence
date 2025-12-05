from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class Service(BaseModel):
    service_id: Optional[int] = None
    user_id: int
    name: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0, description="Preço deve ser maior que zero")
    duration: int = Field(..., gt=0, description="Duração em minutos")
    status: bool = Field(default=True)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ServiceCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    price: Decimal
    duration: int
    status: bool = True

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    duration: Optional[int] = None
    status: Optional[bool] = None