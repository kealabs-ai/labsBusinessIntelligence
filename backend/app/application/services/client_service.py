from typing import Optional, List
from domain.entities.client import Client
from infrastructure.repositories.client_repository import ClientRepository
from infrastructure.config.env_manager import env
import mysql.connector

class ClientService:
    def __init__(self):
        db_config = env.get_database_config()
        connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
        self.connection = mysql.connector.connect(**connection_config)
        self.client_repository = ClientRepository(self.connection)
    
    async def create_client(self, client: Client) -> Client:
        return await self.client_repository.create_client(client)
    
    async def update_client(self, client_id: int, client: Client) -> Optional[Client]:
        return await self.client_repository.update_client(client_id, client)
    
    async def get_client_by_id(self, client_id: int) -> Optional[Client]:
        return await self.client_repository.get_client_by_id(client_id)
    
    async def get_clients_by_user(self, user_id: int) -> List[Client]:
        return await self.client_repository.get_clients_by_user(user_id)
    
    async def deactivate_client(self, client_id: int) -> bool:
        return await self.client_repository.update_client_status(client_id, False)
    
    async def activate_client(self, client_id: int) -> bool:
        return await self.client_repository.update_client_status(client_id, True)
    
    async def check_phone_exists(self, phone: str, exclude_id: int = None) -> bool:
        existing_client = await self.client_repository.get_client_by_phone(phone, exclude_id)
        return existing_client is not None
    
    async def update_client_status(self, client_id: int, status: bool) -> bool:
        return await self.client_repository.update_client_status(client_id, status)