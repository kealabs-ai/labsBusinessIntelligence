from typing import List, Dict, Any
from domain.entities.user import User
import mysql.connector

class AdminRepository:
    def __init__(self, connection):
        self.connection = connection

    def get_all_users(self, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        cursor = self.connection.cursor(dictionary=True)
        try:
            # Count total users
            cursor.execute("SELECT COUNT(*) as total FROM users")
            total = cursor.fetchone()['total']
            
            # Get paginated users with role names
            offset = (page - 1) * limit
            cursor.execute("""
                SELECT u.id, u.name, u.username, u.email, u.phone, u.mobile, u.role_id, r.name as role_name, 
                       u.kea_client_id, u.unit_id, u.is_active, u.created_at, u.updated_at 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.role_id
                ORDER BY u.created_at DESC LIMIT %s OFFSET %s
            """, (limit, offset))
            
            users_data = cursor.fetchall()
            users = []
            for row in users_data:
                user_dict = dict(row)
                user_dict['role'] = user_dict.pop('role_name', 'Usuário')
                users.append(User(**user_dict, password_hash=''))
            
            return {
                "users": users,
                "total": total,
                "page": page,
                "pages": (total + limit - 1) // limit
            }
        finally:
            cursor.close()

    def create_user(self, user: User) -> User:
        cursor = self.connection.cursor(dictionary=True)
        try:
            # Check if username or email already exists
            cursor.execute(
                "SELECT COUNT(*) as count FROM users WHERE username = %s OR email = %s",
                (user.username, user.email)
            )
            if cursor.fetchone()['count'] > 0:
                raise ValueError("Username or email already exists")
            
            cursor.execute("""
                INSERT INTO users (name, username, email, phone, mobile, password_hash, role_id, kea_client_id, unit_id, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (user.name, user.username, user.email, user.phone, user.mobile, user.password_hash, user.role_id, 
                  user.kea_client_id, user.unit_id, user.is_active))
            
            user.id = cursor.lastrowid
            self.connection.commit()
            return user
        finally:
            cursor.close()

    def update_user(self, user_id: int, user_data: dict) -> User:
        cursor = self.connection.cursor(dictionary=True)
        try:
            # Check if username or email already exists for other users
            if 'username' in user_data or 'email' in user_data:
                conditions = []
                params = []
                if 'username' in user_data:
                    conditions.append("username = %s")
                    params.append(user_data['username'])
                if 'email' in user_data:
                    conditions.append("email = %s")
                    params.append(user_data['email'])
                
                query = f"SELECT COUNT(*) as count FROM users WHERE ({' OR '.join(conditions)}) AND id != %s"
                params.append(user_id)
                cursor.execute(query, params)
                if cursor.fetchone()['count'] > 0:
                    raise ValueError("Username or email already exists")
            
            # Build dynamic update query
            fields = []
            values = []
            for key, value in user_data.items():
                if value is not None:
                    fields.append(f"{key} = %s")
                    values.append(value)
            
            if fields:
                query = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
                values.append(user_id)
                cursor.execute(query, values)
                self.connection.commit()
            
            # Return updated user with role name
            cursor.execute("""
                SELECT u.id, u.name, u.username, u.email, u.phone, u.mobile, u.role_id, r.name as role_name,
                       u.kea_client_id, u.unit_id, u.is_active, u.created_at, u.updated_at 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.role_id
                WHERE u.id = %s
            """, (user_id,))
            result = cursor.fetchone()
            if result:
                user_dict = dict(result)
                user_dict['role'] = user_dict.pop('role_name', 'Usuário')
                return User(**user_dict, password_hash='')
            return None
        finally:
            cursor.close()

    def delete_user(self, user_id: int):
        cursor = self.connection.cursor()
        try:
            cursor.execute("UPDATE users SET is_active = FALSE WHERE id = %s", (user_id,))
            self.connection.commit()
        finally:
            cursor.close()

    def get_all_modules(self):
        cursor = self.connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM modules WHERE active = TRUE ORDER BY name")
            return cursor.fetchall()
        finally:
            cursor.close()

    def get_user_permissions(self, user_id: int):
        cursor = self.connection.cursor(dictionary=True)
        try:
            cursor.execute("""
                SELECT m.id, m.name, m.description, m.route, m.icon,
                       COALESCE(up.can_view, FALSE) as can_view,
                       COALESCE(up.can_create, FALSE) as can_create,
                       COALESCE(up.can_edit, FALSE) as can_edit,
                       COALESCE(up.can_delete, FALSE) as can_delete
                FROM modules m
                LEFT JOIN user_permissions up ON m.id = up.module_id AND up.user_id = %s
                WHERE m.active = TRUE
                ORDER BY m.name
            """, (user_id,))
            return cursor.fetchall()
        finally:
            cursor.close()

    def update_user_permissions(self, user_id: int, permissions: dict):
        cursor = self.connection.cursor()
        try:
            for module_id, perms in permissions.items():
                cursor.execute("""
                    INSERT INTO user_permissions (user_id, module_id, can_view, can_create, can_edit, can_delete)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                    can_view = VALUES(can_view),
                    can_create = VALUES(can_create),
                    can_edit = VALUES(can_edit),
                    can_delete = VALUES(can_delete)
                """, (user_id, int(module_id), perms.get('can_view', False), 
                      perms.get('can_create', False), perms.get('can_edit', False), 
                      perms.get('can_delete', False)))
            self.connection.commit()
        finally:
            cursor.close()