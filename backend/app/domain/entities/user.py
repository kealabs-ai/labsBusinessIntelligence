from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password_hash: str
    role_id: int = Field(default=4, description="User role ID")
    role: Optional[str] = Field(default=None, description="User role name")
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None