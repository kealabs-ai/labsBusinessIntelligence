from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password_hash: str
    role: Literal['user', 'admin'] = Field(default='user', description="User role: 'user' or 'admin'")
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None