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
        # Validate required fields
        if not user_data.get('name') or not user_data.get('username') or not user_data.get('email') or not user_data.get('password'):
            raise ValueError("Name, username, email and password are required")
        
        # Hash password
        user_data['password_hash'] = TokenManager.get_password_hash(user_data.pop('password'))
        
        # Handle role_id conversion
        if 'role' in user_data:
            role_value = user_data.pop('role')
            user_data['role_id'] = int(role_value) if role_value else 4
        elif 'role_id' not in user_data:
            user_data['role_id'] = 4  # Default role
        
        # Validate role_id exists
        if not self._validate_role_id(user_data['role_id']):
            raise ValueError("Invalid role_id")
        
        user = User(**user_data)
        return self.repository.create_user(user)

    def update_user(self, user_id: int, user_data: dict) -> User:
        # Hash password if provided
        if 'password' in user_data and user_data['password']:
            user_data['password_hash'] = TokenManager.get_password_hash(user_data.pop('password'))
        elif 'password' in user_data:
            user_data.pop('password')  # Remove empty password
        
        # Handle role_id conversion
        if 'role' in user_data:
            role_value = user_data.pop('role')
            if role_value:
                user_data['role_id'] = int(role_value)
                # Validate role_id exists
                if not self._validate_role_id(user_data['role_id']):
                    raise ValueError("Invalid role_id")
        
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
    
    def _validate_role_id(self, role_id: int) -> bool:
        """Validate if role_id exists in roles table"""
        cursor = self.connection.cursor()
        try:
            cursor.execute("SELECT COUNT(*) FROM roles WHERE role_id = %s", (role_id,))
            count = cursor.fetchone()[0]
            return count > 0
        except:
            # Fallback validation for basic roles
            return role_id in [1, 2, 3, 4]
        finally:
            cursor.close()