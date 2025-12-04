from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from domain.entities.user import User
from domain.entities.client import Client
from domain.entities.transacao import Transacao

class BaseRepository(ABC):
    pass

class IUserRepository(ABC):
    @abstractmethod
    async def get_user_by_credentials(self, username: str) -> Optional[User]:
        pass
    
    @abstractmethod
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        pass

class IChartRepository(ABC):
    @abstractmethod
    async def get_chart_data(self, chart_type: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        pass
    
    @abstractmethod
    async def get_kpi_data(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        pass

class IClientRepository(ABC):
    @abstractmethod
    async def create_client(self, client: Client) -> Client:
        pass
    
    @abstractmethod
    async def update_client(self, client_id: int, client: Client) -> Optional[Client]:
        pass
    
    @abstractmethod
    async def get_client_by_id(self, client_id: int) -> Optional[Client]:
        pass
    
    @abstractmethod
    async def get_clients_by_user(self, user_id: int) -> List[Client]:
        pass
    
    @abstractmethod
    async def update_client_status(self, client_id: int, status: bool) -> bool:
        pass
    
    @abstractmethod
    async def get_client_by_phone(self, phone: str, exclude_id: int = None) -> Optional[Client]:
        pass

class ITransacaoRepository(ABC):
    @abstractmethod
    async def create_transacao(self, transacao: Transacao) -> Transacao:
        pass
    
    @abstractmethod
    async def get_transacoes_by_user(self, user_id: int, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def get_transacao_by_id(self, transacao_id: int) -> Optional[Transacao]:
        pass
    
    @abstractmethod
    async def update_transacao(self, transacao_id: int, transacao: Transacao) -> Optional[Transacao]:
        pass
    
    @abstractmethod
    async def delete_transacao(self, transacao_id: int) -> bool:
        pass
    
    @abstractmethod
    async def get_resumo_financeiro(self, user_id: int) -> Dict[str, Any]:
        pass