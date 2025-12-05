from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class Resource(BaseModel):
    id: Optional[int] = None
    user_id: int
    name: str = Field(..., min_length=1, max_length=255)
    type: Literal['professional', 'equipment', 'room']
    specialty: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = None
    status: Optional[bool] = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ResourceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: Literal['professional', 'equipment', 'room']
    specialty: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = None
    status: Optional[bool] = True

class ResourceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[Literal['professional', 'equipment', 'room']] = None
    specialty: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = None
    status: Optional[bool] = None