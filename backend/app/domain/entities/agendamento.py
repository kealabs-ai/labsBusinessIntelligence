from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Agendamento(BaseModel):
    id: Optional[int] = None
    cliente: str
    servico: str
    data: str  # YYYY-MM-DD
    hora: str  # HH:MM
    valor: Optional[float] = None
    whatsapp_number: Optional[str] = None
    custom_message: Optional[str] = None
    enable_notification: bool = False
    notification_sent: bool = False
    notification_quantity: int = 1
    notification_unit: str = 'dias'
    notification_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    unit_name: Optional[str] = None
    
    class Config:
        from_attributes = True