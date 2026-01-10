from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[int] = None
    name: str = Field(description="User display name")
    username: str
    email: str
    phone: Optional[str] = Field(default=None, description="User phone number")
    mobile: Optional[str] = Field(default=None, description="User mobile number")
    password_hash: str
    role_id: int = Field(default=4, description="User role ID")
    role: Optional[str] = Field(default=None, description="User role name")
    kea_client_id: Optional[str] = Field(default=None, description="KEA Client ID")
    unit_id: Optional[int] = Field(default=None, description="Unit ID")
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None