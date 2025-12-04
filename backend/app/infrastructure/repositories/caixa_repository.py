from typing import List, Optional
from ..database.factory import get_repository
from ...domain.entities.caixa import Caixa, CaixaCreate, CaixaUpdate

class CaixaRepository:
    def __init__(self):
        self.repository = get_repository()

    def get_all(self, usuario_id: int) -> List[Caixa]:
        query = "SELECT * FROM caixa WHERE usuario_id = %s"
        params = (usuario_id,)
        result = self.repository.fetchall(query, params)
        return [Caixa(**row) for row in result] if result else []

    def get_by_id(self, caixa_id: int, usuario_id: int) -> Optional[Caixa]:
        query = "SELECT * FROM caixa WHERE id = %s AND usuario_id = %s"
        params = (caixa_id, usuario_id)
        row = self.repository.fetchone(query, params)
        return Caixa(**row) if row else None

    def create(self, caixa: CaixaCreate) -> Caixa:
        query = """
            INSERT INTO caixa (nome, saldo_inicial, saldo_atual, status, usuario_id)
            VALUES (%s, %s, %s, %s, %s)
        """
        params = (caixa.nome, caixa.saldo_inicial, caixa.saldo_inicial, 'aberto', caixa.usuario_id)
        caixa_id = self.repository.execute(query, params)
        return self.get_by_id(caixa_id, caixa.usuario_id)

    def update(self, caixa_id: int, caixa_update: CaixaUpdate, usuario_id: int) -> Optional[Caixa]:
        query_parts = []
        params = []
        if caixa_update.nome is not None:
            query_parts.append("nome = %s")
            params.append(caixa_update.nome)
        if caixa_update.saldo_atual is not None:
            query_parts.append("saldo_atual = %s")
            params.append(caixa_update.saldo_atual)
        if caixa_update.status is not None:
            query_parts.append("status = %s")
            params.append(caixa_update.status)
        if caixa_update.data_fechamento is not None:
            query_parts.append("data_fechamento = %s")
            params.append(caixa_update.data_fechamento)

        if not query_parts:
            return self.get_by_id(caixa_id, usuario_id)

        query = f"UPDATE caixa SET {', '.join(query_parts)} WHERE id = %s AND usuario_id = %s"
        params.extend([caixa_id, usuario_id])
        
        self.repository.execute(query, tuple(params))
        return self.get_by_id(caixa_id, usuario_id)

    def delete(self, caixa_id: int, usuario_id: int) -> None:
        query = "DELETE FROM caixa WHERE id = %s AND usuario_id = %s"
        params = (caixa_id, usuario_id)
        self.repository.execute(query, params)
