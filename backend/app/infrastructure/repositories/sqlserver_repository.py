import pyodbc
from typing import Optional, List, Dict, Any
from domain.entities.user import User
from .interfaces import IUserRepository, IChartRepository
import os

class SQLServerUserRepository(IUserRepository):
    def __init__(self):
        self.connection_string = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={os.getenv('SQLSERVER_HOST', 'localhost')};"
            f"DATABASE={os.getenv('SQLSERVER_DATABASE', 'labsbi')};"
            f"UID={os.getenv('SQLSERVER_USER', 'sa')};"
            f"PWD={os.getenv('SQLSERVER_PASSWORD', '')}"
        )
    
    async def get_user_by_credentials(self, username: str) -> Optional[User]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM users WHERE username = ? AND is_active = 1", username)
            result = cursor.fetchone()
            if result:
                columns = [column[0] for column in cursor.description]
                user_dict = dict(zip(columns, result))
                return User(**user_dict)
            return None
        finally:
            cursor.close()
            conn.close()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM users WHERE id = ?", user_id)
            result = cursor.fetchone()
            if result:
                columns = [column[0] for column in cursor.description]
                user_dict = dict(zip(columns, result))
                return User(**user_dict)
            return None
        finally:
            cursor.close()
            conn.close()

class SQLServerChartRepository(IChartRepository):
    def __init__(self):
        self.connection_string = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={os.getenv('SQLSERVER_HOST', 'localhost')};"
            f"DATABASE={os.getenv('SQLSERVER_DATABASE', 'labsbi')};"
            f"UID={os.getenv('SQLSERVER_USER', 'sa')};"
            f"PWD={os.getenv('SQLSERVER_PASSWORD', '')}"
        )
    
    async def get_chart_data(self, chart_type: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            if chart_type == "bar":
                cursor.execute("SELECT category, value FROM chart_data WHERE type = 'bar'")
            elif chart_type == "pie":
                cursor.execute("SELECT label, percentage FROM chart_data WHERE type = 'pie'")
            else:
                cursor.execute("SELECT * FROM chart_data WHERE type = ?", chart_type)
            
            results = cursor.fetchall()
            columns = [column[0] for column in cursor.description]
            return [dict(zip(columns, row)) for row in results]
        finally:
            cursor.close()
            conn.close()