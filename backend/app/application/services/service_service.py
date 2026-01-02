from typing import Optional, List
from domain.entities.service import Service, ServiceCreate, ServiceUpdate
from infrastructure.database.factory import DatabaseFactory

class ServiceService:
    def __init__(self):
        self.service_repository = DatabaseFactory.get_service_repository()
    
    async def create_service(self, service: Service) -> Service:
        return await self.service_repository.create_service(service)
    
    async def get_services_by_user(self, user_id: int) -> List[Service]:
        return await self.service_repository.get_services_by_user(user_id)
    
    async def get_service_by_id(self, service_id: int) -> Optional[Service]:
        return await self.service_repository.get_service_by_id(service_id)
    
    async def update_service(self, service_id: int, service: Service) -> Optional[Service]:
        return await self.service_repository.update_service(service_id, service)
    
    async def update_service_status(self, service_id: int, status: bool) -> bool:
        return await self.service_repository.update_service_status(service_id, status)
    
    async def get_service_categories(self) -> List[str]:
        return await self.service_repository.get_service_categories()