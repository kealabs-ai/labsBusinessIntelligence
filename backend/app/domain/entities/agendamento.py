from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Agendamento(BaseModel):
    id: Optional[int] = None
    cliente: str
    servico: str
    data: str  # YYYY-MM-DD
    hora: str  # HH:MM
    whatsapp_number: Optional[str] = None
    custom_message: Optional[str] = None
    enable_notification: bool = False
    notification_sent: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True