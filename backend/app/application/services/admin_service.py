from typing import List, Dict, Any
from domain.entities.user import User
from infrastructure.repositories.admin_repository import AdminRepository
from application.services.token_manager import TokenManager
from infrastructure.config.env_manager import env
import mysql.connector

class AdminService:
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
        self.repository = AdminRepository(self.connection)

    def get_all_users(self, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        return self.repository.get_all_users(page, limit)

    def create_user(self, user_data: dict) -> User:
        user_data['password_hash'] = TokenManager.get_password_hash(user_data.pop('password'))
        if 'role' in user_data:
            role_value = user_data.pop('role')
            user_data['role_id'] = int(role_value)
        user = User(**user_data)
        return self.repository.create_user(user)

    def update_user(self, user_id: int, user_data: dict) -> User:
        if 'password' in user_data:
            user_data['password_hash'] = TokenManager.get_password_hash(user_data.pop('password'))
        if 'role' in user_data:
            role_value = user_data.pop('role')
            user_data['role_id'] = int(role_value)
        return self.repository.update_user(user_id, user_data)

    def delete_user(self, user_id: int):
        return self.repository.delete_user(user_id)

    def get_all_modules(self):
        return self.repository.get_all_modules()

    def get_user_permissions(self, user_id: int):
        return self.repository.get_user_permissions(user_id)

    def update_user_permissions(self, user_id: int, permissions: dict):
        return self.repository.update_user_permissions(user_id, permissions)

    def get_all_units(self):
        cursor = self.connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT id, unit_name FROM unit_settings")
            return cursor.fetchall()
        finally:
            cursor.close()