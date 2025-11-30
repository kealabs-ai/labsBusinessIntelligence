from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, date
import re

class Client(BaseModel):
    client_id: Optional[int] = None
    user_id: int
    full_name: str = Field(..., min_length=1, max_length=255)
    phone_whatsapp: str = Field(..., min_length=10, max_length=20)
    email: str = Field(..., min_length=1, max_length=255)
    birth_date: Optional[date] = None
    note: Optional[str] = Field(None, max_length=1000)
    created_at: Optional[datetime] = None
    status: bool = Field(default=True, description="Active status: True for active, False for inactive")
    
    @validator('email')
    def validate_email(cls, v):
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', v):
            raise ValueError('Invalid email format')
        return v