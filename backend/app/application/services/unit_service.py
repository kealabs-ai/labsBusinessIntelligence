from typing import List
from datetime import time
from domain.entities.unit import Unit
from infrastructure.repositories.unit_repository import UnitRepository

class UnitService:
    def __init__(self):
        self.unit_repository = UnitRepository()

    def create_unit(self, user_id: int, unit_data: dict) -> Unit:
        # Parse time strings
        opening_time = time.fromisoformat(unit_data.get('opening_time', '08:00:00'))
        closing_time = time.fromisoformat(unit_data.get('closing_time', '18:00:00'))
        
        unit = Unit(
            user_id=user_id,
            unit_name=unit_data['unit_name'],
            address=unit_data.get('address'),
            phone=unit_data.get('phone'),
            email=unit_data.get('email'),
            opening_time=opening_time,
            closing_time=closing_time,
            appointment_interval=unit_data.get('appointment_interval', 30),
            notifications_enabled=unit_data.get('notifications_enabled', True),
            notification_advance_hours=unit_data.get('notification_advance_hours', 24)
        )
        
        return self.unit_repository.create_unit(unit)

    def get_user_units(self, user_id: int) -> List[Unit]:
        return self.unit_repository.get_units_by_user(user_id)

    def update_unit(self, user_id: int, unit_id: int, unit_data: dict) -> Unit:
        # Parse time strings
        opening_time = time.fromisoformat(unit_data.get('opening_time', '08:00:00'))
        closing_time = time.fromisoformat(unit_data.get('closing_time', '18:00:00'))
        
        unit = Unit(
            id=unit_id,
            user_id=user_id,
            unit_name=unit_data['unit_name'],
            address=unit_data.get('address'),
            phone=unit_data.get('phone'),
            email=unit_data.get('email'),
            opening_time=opening_time,
            closing_time=closing_time,
            appointment_interval=unit_data.get('appointment_interval', 30),
            notifications_enabled=unit_data.get('notifications_enabled', True),
            notification_advance_hours=unit_data.get('notification_advance_hours', 24)
        )
        
        return self.unit_repository.update_unit(unit)

    def delete_unit(self, user_id: int, unit_id: int) -> bool:
        return self.unit_repository.delete_unit(unit_id, user_id)