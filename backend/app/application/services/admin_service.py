from typing import List, Dict, Any
from domain.entities.user import User
from infrastructure.repositories.admin_repository import AdminRepository
from application.services.token_manager import TokenManager
import mysql.connector
import os

class AdminService:
    def __init__(self):
        connection_config = {
            'host': os.getenv('MYSQL_HOST', '72.60.140.128'),
            'port': int(os.getenv('MYSQL_PORT', 33060)),
            'user': os.getenv('MYSQL_USER', 'kealabs'),
            'password': os.getenv('MYSQL_PASSWORD', 'Kea2025@!@'),
            'database': os.getenv('MYSQL_DATABASE', 'labsbi_mysql_db')
        }
        self.connection = mysql.connector.connect(**connection_config)
        self.repository = AdminRepository(self.connection)

    def get_all_users(self, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        return self.repository.get_all_users(page, limit)

    def create_user(self, user_data: dict) -> User:
        user_data['password_hash'] = TokenManager.get_password_hash(user_data.pop('password'))
        user = User(**user_data)
        return self.repository.create_user(user)

    def update_user(self, user_id: int, user_data: dict) -> User:
        if 'password' in user_data:
            user_data['password_hash'] = TokenManager.get_password_hash(user_data.pop('password'))
        return self.repository.update_user(user_id, user_data)

    def delete_user(self, user_id: int):
        return self.repository.delete_user(user_id)

    def get_all_modules(self):
        return self.repository.get_all_modules()

    def get_user_permissions(self, user_id: int):
        return self.repository.get_user_permissions(user_id)

    def update_user_permissions(self, user_id: int, permissions: dict):
        return self.repository.update_user_permissions(user_id, permissions)