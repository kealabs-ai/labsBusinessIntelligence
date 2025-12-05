from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Resource(BaseModel):
    id: Optional[int] = None
    user_id: int
    name: str
    type: str
    specialty: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[bool] = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ResourceCreate(BaseModel):
    name: str
    type: str
    specialty: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    specialty: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[bool] = None