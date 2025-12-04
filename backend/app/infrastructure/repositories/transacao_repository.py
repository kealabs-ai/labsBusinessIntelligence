from typing import List, Optional
from ..database.factory import get_repository
from ...domain.entities.transacao import Transacao, TransacaoCreate

class TransacaoRepository:
    def __init__(self):
        self.repository = get_repository()

    def get_all_from_caixa(self, caixa_id: int) -> List[Transacao]:
        query = "SELECT * FROM transacoes WHERE caixa_id = %s"
        params = (caixa_id,)
        result = self.repository.fetchall(query, params)
        return [Transacao(**row) for row in result] if result else []

    def get_by_id(self, transacao_id: int) -> Optional[Transacao]:
        query = "SELECT * FROM transacoes WHERE id = %s"
        params = (transacao_id,)
        row = self.repository.fetchone(query, params)
        return Transacao(**row) if row else None

    def create(self, transacao: TransacaoCreate) -> Transacao:
        query = """
            INSERT INTO transacoes (caixa_id, tipo, valor, descricao, categoria, metodo_pagamento)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (
            transacao.caixa_id,
            transacao.tipo,
            transacao.valor,
            transacao.descricao,
            transacao.categoria,
            transacao.metodo_pagamento
        )
        transacao_id = self.repository.execute(query, params)
        
        # Update saldo do caixa
        caixa_repo = get_repository()
        caixa_query = "SELECT saldo_atual FROM caixa WHERE id = %s"
        caixa_params = (transacao.caixa_id,)
        caixa = caixa_repo.fetchone(caixa_query, caixa_params)
        
        if caixa:
            saldo_atual = caixa['saldo_atual']
            if transacao.tipo.lower() == 'entrada':
                novo_saldo = saldo_atual + transacao.valor
            else:
                novo_saldo = saldo_atual - transacao.valor
            
            update_query = "UPDATE caixa SET saldo_atual = %s WHERE id = %s"
            update_params = (novo_saldo, transacao.caixa_id)
            caixa_repo.execute(update_query, update_params)

        return self.get_by_id(transacao_id)

    def delete(self, transacao_id: int) -> None:
        # Before deleting, we might need to revert the transaction effect on the caixa balance.
        transacao_to_delete = self.get_by_id(transacao_id)
        if transacao_to_delete:
            caixa_repo = get_repository()
            caixa_query = "SELECT saldo_atual FROM caixa WHERE id = %s"
            caixa_params = (transacao_to_delete.caixa_id,)
            caixa = caixa_repo.fetchone(caixa_query, caixa_params)

            if caixa:
                saldo_atual = caixa['saldo_atual']
                if transacao_to_delete.tipo.lower() == 'entrada':
                    novo_saldo = saldo_atual - transacao_to_delete.valor
                else:
                    novo_saldo = saldo_atual + transacao_to_delete.valor
                
                update_query = "UPDATE caixa SET saldo_atual = %s WHERE id = %s"
                update_params = (novo_saldo, transacao_to_delete.caixa_id)
                caixa_repo.execute(update_query, update_params)

        query = "DELETE FROM transacoes WHERE id = %s"
        params = (transacao_id,)
        self.repository.execute(query, params)
