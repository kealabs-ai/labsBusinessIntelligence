from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Contact(BaseModel):
    id: Optional[int] = None
    name: str
    phone: str
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    is_online: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    active: bool = True

    class Config:
        from_attributes = True