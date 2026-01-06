from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class WhatsAppInstance(BaseModel):
    id: Optional[int] = None
    user_id: int = Field(..., description="ID do usuário proprietário")
    kea_client_id: Optional[str] = Field(None, description="ID do cliente KEA")
    instance_name: str = Field(..., max_length=100, description="Nome único da instância")
    qr_code: Optional[str] = Field(None, description="QR Code em base64")
    evolution_api_key: Optional[str] = Field(None, description="Chave da Evolution API")
    created_at: Optional[datetime] = None
    status: bool = Field(False, description="Status da instância")

    class Config:
        from_attributes = True


class WhatsAppInstanceCreate(BaseModel):
    user_id: int
    kea_client_id: Optional[str] = None
    instance_name: str = Field(..., max_length=100)
    qr_code: Optional[str] = None
    evolution_api_key: Optional[str] = None
    status: bool = False


class WhatsAppInstanceQuery(BaseModel):
    user_id: int
    kea_client_id: Optional[str] = None