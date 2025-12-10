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
    unit_id: Optional[int] = None
    role_id: Optional[int] = None
    kea_client_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ResourceCreate(BaseModel):
    name: str
    type: str
    specialty: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    notes: Optional[str] = ""
    unit_id: Optional[int] = None
    role_id: Optional[int] = None
    kea_client_id: Optional[str] = None

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    specialty: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[bool] = None
    unit_id: Optional[int] = None
    role_id: Optional[int] = None
    kea_client_id: Optional[str] = None