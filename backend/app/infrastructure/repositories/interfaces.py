from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from domain.entities.user import User

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