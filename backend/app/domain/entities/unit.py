from dataclasses import dataclass
from typing import Optional
from datetime import time

@dataclass
class Unit:
    id: Optional[int] = None
    user_id: int = None
    unit_name: str = ""
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_time: time = time(8, 0)
    closing_time: time = time(18, 0)
    appointment_interval: int = 30
    notifications_enabled: bool = True
    notification_advance_hours: int = 24
    kea_client_id: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'unit_name': self.unit_name,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'opening_time': str(self.opening_time) if self.opening_time else None,
            'closing_time': str(self.closing_time) if self.closing_time else None,
            'appointment_interval': self.appointment_interval,
            'notifications_enabled': self.notifications_enabled,
            'notification_advance_hours': self.notification_advance_hours,
            'kea_client_id': self.kea_client_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }