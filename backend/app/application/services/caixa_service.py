from typing import List, Optional
from ...infrastructure.repositories.caixa_repository import CaixaRepository
from ...infrastructure.repositories.transacao_repository import TransacaoRepository
from ...domain.entities.caixa import Caixa, CaixaCreate, CaixaUpdate
from ...domain.entities.transacao import Transacao, TransacaoCreate

class CaixaService:
    def __init__(self):
        self.caixa_repository = CaixaRepository()
        self.transacao_repository = TransacaoRepository()

    def get_all_caixas(self, usuario_id: int) -> List[Caixa]:
        return self.caixa_repository.get_all(usuario_id)

    def get_caixa_by_id(self, caixa_id: int, usuario_id: int) -> Optional[Caixa]:
        return self.caixa_repository.get_by_id(caixa_id, usuario_id)

    def create_caixa(self, caixa: CaixaCreate) -> Caixa:
        return self.caixa_repository.create(caixa)

    def update_caixa(self, caixa_id: int, caixa_update: CaixaUpdate, usuario_id: int) -> Optional[Caixa]:
        # You can add business logic here, e.g. checking if a caixa can be closed
        return self.caixa_repository.update(caixa_id, caixa_update, usuario_id)

    def delete_caixa(self, caixa_id: int, usuario_id: int) -> None:
        # Business logic: maybe you can only delete a caixa if it's empty and closed
        self.caixa_repository.delete(caixa_id, usuario_id)

    def add_transacao(self, transacao: TransacaoCreate) -> Transacao:
        # Business logic can be added here, for example, validating the transaction
        return self.transacao_repository.create(transacao)

    def get_transacoes_from_caixa(self, caixa_id: int) -> List[Transacao]:
        return self.transacao_repository.get_all_from_caixa(caixa_id)

    def delete_transacao(self, transacao_id: int) -> None:
        self.transacao_repository.delete(transacao_id)
