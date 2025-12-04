from typing import Optional, List, Dict, Any
from domain.entities.transacao import Transacao
from infrastructure.database.factory import DatabaseFactory

class TransacaoService:
    def __init__(self):
        self.transacao_repository = DatabaseFactory.get_transacao_repository()
    
    async def create_transacao(self, transacao: Transacao) -> Transacao:
        return await self.transacao_repository.create_transacao(transacao)
    
    async def get_transacoes_by_user(self, user_id: int, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        return await self.transacao_repository.get_transacoes_by_user(user_id, page, limit)
    
    async def get_transacao_by_id(self, transacao_id: int) -> Optional[Transacao]:
        return await self.transacao_repository.get_transacao_by_id(transacao_id)
    
    async def update_transacao(self, transacao_id: int, transacao: Transacao) -> Optional[Transacao]:
        return await self.transacao_repository.update_transacao(transacao_id, transacao)
    
    async def delete_transacao(self, transacao_id: int) -> bool:
        return await self.transacao_repository.delete_transacao(transacao_id)
    
    async def get_resumo_financeiro(self, user_id: int) -> Dict[str, Any]:
        return await self.transacao_repository.get_resumo_financeiro(user_id)