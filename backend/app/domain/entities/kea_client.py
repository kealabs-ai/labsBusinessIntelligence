from dataclasses import dataclass
from typing import Optional, List
from datetime import date
import json

@dataclass
class KeaClient:
    id: Optional[int] = None
    name: str = ""
    cpf_cnpj: str = ""
    kea_identifier: str = ""
    email: str = ""
    site: Optional[str] = None
    phone_number: Optional[str] = None
    cell_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    address: Optional[str] = None
    status: bool = True
    payment_plan: Optional[str] = None
    user_quantity: int = 1
    last_payment_date: Optional[date] = None
    segmento: Optional[List[str]] = None
    color_palette: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'cpf_cnpj': self.cpf_cnpj,
            'kea_identifier': self.kea_identifier,
            'email': self.email,
            'site': self.site,
            'phone_number': self.phone_number,
            'cell_phone': self.cell_phone,
            'whatsapp_number': self.whatsapp_number,
            'address': self.address,
            'status': self.status,
            'payment_plan': self.payment_plan,
            'user_quantity': self.user_quantity,
            'last_payment_date': str(self.last_payment_date) if self.last_payment_date else None,
            'segmento': self.segmento,
            'color_palette': self.color_palette,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }