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
        print(f"=== ADMIN SERVICE - CREATE USER ===")
        print(f"Dados recebidos: {user_data}")
        
        # Validate required fields
        if not user_data.get('name') or not user_data.get('username') or not user_data.get('email') or not user_data.get('password'):
            print(f"❌ Validação falhou - campos obrigatórios")
            print(f"name: {user_data.get('name')}")
            print(f"username: {user_data.get('username')}")
            print(f"email: {user_data.get('email')}")
            print(f"password: {'***' if user_data.get('password') else None}")
            raise ValueError("Name, username, email and password are required")
        
        # Hash password
        password = user_data.pop('password')
        user_data['password_hash'] = TokenManager.get_password_hash(password)
        print(f"✅ Senha hasheada")
        
        # Handle role_id conversion
        if 'role' in user_data:
            role_value = user_data.pop('role')
            user_data['role_id'] = int(role_value) if role_value else 4
            print(f"✅ Role convertido: {role_value} -> {user_data['role_id']}")
        elif 'role_id' not in user_data:
            user_data['role_id'] = 4  # Default role
            print(f"✅ Role padrão definido: 4")
        
        # Validate role_id exists
        if not self._validate_role_id(user_data['role_id']):
            print(f"❌ Role_id inválido: {user_data['role_id']}")
            raise ValueError("Invalid role_id")
        
        # Handle unit_id conversion
        if 'unit_id' in user_data and user_data['unit_id'] is None:
            user_data['unit_id'] = 0
        
        print(f"Dados finais para User: {user_data}")
        
        try:
            user = User(**user_data)
            print(f"✅ Entidade User criada: {user}")
            result = self.repository.create_user(user)
            print(f"✅ Usuário salvo no banco: {result}")
            return result
        except Exception as e:
            print(f"❌ Erro ao criar User ou salvar: {e}")
            raise

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