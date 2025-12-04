from typing import List, Optional
from ..database.factory import get_repository
from ...domain.entities.transacao import Transaction, TransactionCreate

class TransactionRepository:
    def __init__(self):
        self.repository = get_repository()

    def get_all_from_cash_register(self, cash_register_id: int) -> List[Transaction]:
        query = "SELECT * FROM transactions WHERE cash_register_id = %s"
        params = (cash_register_id,)
        result = self.repository.fetchall(query, params)
        return [Transaction(**row) for row in result] if result else []

    def get_by_id(self, transaction_id: int) -> Optional[Transaction]:
        query = "SELECT * FROM transactions WHERE id = %s"
        params = (transaction_id,)
        row = self.repository.fetchone(query, params)
        return Transaction(**row) if row else None

    def create(self, transaction: TransactionCreate) -> Transaction:
        query = """
            INSERT INTO transactions (cash_register_id, transaction_type, amount, description, category, payment_method, transaction_date)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """
        params = (
            transaction.cash_register_id,
            transaction.transaction_type,
            transaction.amount,
            transaction.description,
            transaction.category,
            transaction.payment_method
        )
        transaction_id = self.repository.execute(query, params)
        
        # Update cash register balance
        cash_register_repo = get_repository()
        cash_register_query = "SELECT current_balance FROM cash_register WHERE id = %s"
        cash_register_params = (transaction.cash_register_id,)
        cash_register = cash_register_repo.fetchone(cash_register_query, cash_register_params)
        
        if cash_register:
            current_balance = cash_register['current_balance']
            if transaction.transaction_type.lower() == 'income':
                new_balance = current_balance + transaction.amount
            else:
                new_balance = current_balance - transaction.amount
            
            update_query = "UPDATE cash_register SET current_balance = %s WHERE id = %s"
            update_params = (new_balance, transaction.cash_register_id)
            cash_register_repo.execute(update_query, update_params)

        return self.get_by_id(transaction_id)

    def delete(self, transaction_id: int) -> None:
        # Before deleting, revert the transaction effect on the cash register balance
        transaction_to_delete = self.get_by_id(transaction_id)
        if transaction_to_delete:
            cash_register_repo = get_repository()
            cash_register_query = "SELECT current_balance FROM cash_register WHERE id = %s"
            cash_register_params = (transaction_to_delete.cash_register_id,)
            cash_register = cash_register_repo.fetchone(cash_register_query, cash_register_params)

            if cash_register:
                current_balance = cash_register['current_balance']
                if transaction_to_delete.transaction_type.lower() == 'income':
                    new_balance = current_balance - transaction_to_delete.amount
                else:
                    new_balance = current_balance + transaction_to_delete.amount
                
                update_query = "UPDATE cash_register SET current_balance = %s WHERE id = %s"
                update_params = (new_balance, transaction_to_delete.cash_register_id)
                cash_register_repo.execute(update_query, update_params)

        query = "DELETE FROM transactions WHERE id = %s"
        params = (transaction_id,)
        self.repository.execute(query, params)
