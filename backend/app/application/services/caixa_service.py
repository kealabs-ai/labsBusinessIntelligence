from typing import List, Optional
from ...infrastructure.repositories.caixa_repository import CashRegisterRepository
from ...infrastructure.repositories.transacao_repository import TransactionRepository
from ...domain.entities.caixa import CashRegister, CashRegisterCreate, CashRegisterUpdate
from ...domain.entities.transacao import Transaction, TransactionCreate

class CashRegisterService:
    def __init__(self):
        self.cash_register_repository = CashRegisterRepository()
        self.transaction_repository = TransactionRepository()

    def get_all_cash_registers(self, user_id: int) -> List[CashRegister]:
        return self.cash_register_repository.get_all(user_id)

    def get_cash_register_by_id(self, cash_register_id: int, user_id: int) -> Optional[CashRegister]:
        return self.cash_register_repository.get_by_id(cash_register_id, user_id)

    def create_cash_register(self, cash_register: CashRegisterCreate) -> CashRegister:
        return self.cash_register_repository.create(cash_register)

    def update_cash_register(self, cash_register_id: int, cash_register_update: CashRegisterUpdate, user_id: int) -> Optional[CashRegister]:
        return self.cash_register_repository.update(cash_register_id, cash_register_update, user_id)

    def delete_cash_register(self, cash_register_id: int, user_id: int) -> None:
        self.cash_register_repository.delete(cash_register_id, user_id)

    def add_transaction(self, transaction: TransactionCreate) -> Transaction:
        return self.transaction_repository.create(transaction)

    def get_transactions_from_cash_register(self, cash_register_id: int) -> List[Transaction]:
        return self.transaction_repository.get_all_from_cash_register(cash_register_id)

    def delete_transaction(self, transaction_id: int) -> None:
        self.transaction_repository.delete(transaction_id)
