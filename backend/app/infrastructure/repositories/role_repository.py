from typing import List
from domain.entities.role import Role
from infrastructure.config.env_manager import env
import mysql.connector

class RoleRepository:
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
    
    def get_connection(self):
        return mysql.connector.connect(**self.connection_config)

    def get_all_roles(self) -> List[Role]:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            query = "SELECT role_id, name, description FROM roles ORDER BY name"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            roles = []
            for row in rows:
                role = Role(
                    role_id=row[0],
                    name=row[1],
                    description=row[2]
                )
                roles.append(role)
            
            return roles
            
        finally:
            cursor.close()
            connection.close()