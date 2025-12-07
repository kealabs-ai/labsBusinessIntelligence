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
            
            # Get paginated users
            offset = (page - 1) * limit
            cursor.execute("""
                SELECT id, username, email, role_id, kea_client_id, is_active, created_at, updated_at 
                FROM users ORDER BY created_at DESC LIMIT %s OFFSET %s
            """, (limit, offset))
            
            users = [User(**row, password_hash='') for row in cursor.fetchall()]
            
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
            cursor.execute("""
                INSERT INTO users (username, email, password_hash, role_id, kea_client_id, is_active)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (user.username, user.email, user.password_hash, user.role_id, user.kea_client_id, user.is_active))
            
            user.id = cursor.lastrowid
            self.connection.commit()
            return user
        finally:
            cursor.close()

    def update_user(self, user_id: int, user_data: dict) -> User:
        cursor = self.connection.cursor(dictionary=True)
        try:
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
            
            # Return updated user
            cursor.execute("SELECT id, username, email, role_id, kea_client_id, is_active, created_at, updated_at FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            return User(**result, password_hash='') if result else None
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