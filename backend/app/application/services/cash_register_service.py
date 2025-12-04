from typing import Optional, List
from domain.entities.cash_register import CashRegister, CashRegisterCreate, CashRegisterUpdate
from infrastructure.database.factory import DatabaseFactory

class CashRegisterService:
    def __init__(self):
        self.cash_register_repository = DatabaseFactory.get_cash_register_repository()
    
    async def create_cash_register(self, cash_register: CashRegisterCreate) -> CashRegister:
        return await self.cash_register_repository.create_cash_register(cash_register)
    
    async def get_cash_registers_by_user(self, user_id: int) -> List[CashRegister]:
        return await self.cash_register_repository.get_cash_registers_by_user(user_id)
    
    async def get_cash_register_by_id(self, cash_register_id: int) -> Optional[CashRegister]:
        return await self.cash_register_repository.get_cash_register_by_id(cash_register_id)
    
    async def update_cash_register(self, cash_register_id: int, cash_register: CashRegisterUpdate) -> Optional[CashRegister]:
        return await self.cash_register_repository.update_cash_register(cash_register_id, cash_register)
    
    async def get_or_create_default_cash_register(self, user_id: int) -> CashRegister:
        return await self.cash_register_repository.get_or_create_default_cash_register(user_id)