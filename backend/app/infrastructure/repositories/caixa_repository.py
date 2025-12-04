from typing import List, Optional
from ..database.factory import get_repository
from ...domain.entities.caixa import CashRegister, CashRegisterCreate, CashRegisterUpdate

class CashRegisterRepository:
    def __init__(self):
        self.repository = get_repository()

    def get_all(self, user_id: int) -> List[CashRegister]:
        query = "SELECT * FROM cash_register WHERE user_id = %s"
        params = (user_id,)
        result = self.repository.fetchall(query, params)
        return [CashRegister(**row) for row in result] if result else []

    def get_by_id(self, cash_register_id: int, user_id: int) -> Optional[CashRegister]:
        query = "SELECT * FROM cash_register WHERE id = %s AND user_id = %s"
        params = (cash_register_id, user_id)
        row = self.repository.fetchone(query, params)
        return CashRegister(**row) if row else None

    def create(self, cash_register: CashRegisterCreate) -> CashRegister:
        query = """
            INSERT INTO cash_register (name, initial_balance, current_balance, status, user_id, opening_date)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """
        params = (cash_register.name, cash_register.initial_balance, cash_register.initial_balance, 'open', cash_register.user_id)
        cash_register_id = self.repository.execute(query, params)
        return self.get_by_id(cash_register_id, cash_register.user_id)

    def update(self, cash_register_id: int, cash_register_update: CashRegisterUpdate, user_id: int) -> Optional[CashRegister]:
        query_parts = []
        params = []
        if cash_register_update.name is not None:
            query_parts.append("name = %s")
            params.append(cash_register_update.name)
        if cash_register_update.current_balance is not None:
            query_parts.append("current_balance = %s")
            params.append(cash_register_update.current_balance)
        if cash_register_update.status is not None:
            query_parts.append("status = %s")
            params.append(cash_register_update.status)
        if cash_register_update.closing_date is not None:
            query_parts.append("closing_date = %s")
            params.append(cash_register_update.closing_date)

        if not query_parts:
            return self.get_by_id(cash_register_id, user_id)

        query = f"UPDATE cash_register SET {', '.join(query_parts)} WHERE id = %s AND user_id = %s"
        params.extend([cash_register_id, user_id])
        
        self.repository.execute(query, tuple(params))
        return self.get_by_id(cash_register_id, user_id)

    def delete(self, cash_register_id: int, user_id: int) -> None:
        query = "DELETE FROM cash_register WHERE id = %s AND user_id = %s"
        params = (cash_register_id, user_id)
        self.repository.execute(query, params)
