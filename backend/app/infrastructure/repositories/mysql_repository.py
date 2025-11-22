import mysql.connector
from typing import Optional, List, Dict, Any
from domain.entities.user import User
from .interfaces import IUserRepository, IChartRepository
import os

class MySQLUserRepository(IUserRepository):
    def __init__(self):
        self.connection_config = {
            'host': os.getenv('MYSQL_HOST', 'localhost'),
            'port': int(os.getenv('MYSQL_PORT', 33060)),
            'user': os.getenv('MYSQL_USER', 'root'),
            'password': os.getenv('MYSQL_PASSWORD', ''),
            'database': os.getenv('MYSQL_DATABASE', 'labsbi')
        }
    
    async def get_user_by_credentials(self, username: str) -> Optional[User]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM users WHERE username = %s AND is_active = 1", (username,))
            result = cursor.fetchone()
            return User(**result) if result else None
        finally:
            cursor.close()
            conn.close()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            return User(**result) if result else None
        finally:
            cursor.close()
            conn.close()

class MySQLChartRepository(IChartRepository):
    def __init__(self):
        self.connection_config = {
            'host': os.getenv('MYSQL_HOST', 'localhost'),
            'port': int(os.getenv('MYSQL_PORT', 33060)),
            'user': os.getenv('MYSQL_USER', 'root'),
            'password': os.getenv('MYSQL_PASSWORD', ''),
            'database': os.getenv('MYSQL_DATABASE', 'labsbi')
        }
    
    async def get_chart_data(self, chart_type: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            if chart_type == "bar":
                cursor.execute("SELECT category, value FROM chart_data WHERE type = 'bar'")
            elif chart_type == "pie":
                cursor.execute("SELECT label, percentage FROM chart_data WHERE type = 'pie'")
            elif chart_type == "line":
                cursor.execute("SELECT month, value FROM chart_data WHERE type = 'line' ORDER BY id")
            elif chart_type == "area":
                cursor.execute("SELECT month, value FROM chart_data WHERE type = 'area' ORDER BY id")
            elif chart_type == "scatter":
                cursor.execute("SELECT id, x, y FROM chart_data WHERE type = 'scatter'")
            else:
                cursor.execute("SELECT * FROM chart_data WHERE type = %s", (chart_type,))
            
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    
    async def get_kpi_data(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT metric_name, metric_value FROM kpi_data")
            results = cursor.fetchall()
            return {row['metric_name']: row['metric_value'] for row in results}
        finally:
            cursor.close()
            conn.close()