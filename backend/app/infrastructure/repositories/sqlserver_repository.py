import pyodbc
from typing import Optional, List, Dict, Any
from domain.entities.user import User
from domain.entities.client import Client
from .interfaces import IUserRepository, IChartRepository, IClientRepository
from infrastructure.config.env_manager import env
from datetime import datetime

class SQLServerUserRepository(IUserRepository):
    def __init__(self):
        self.connection_string = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={env.get('SQLSERVER_HOST', 'localhost')};"
            f"DATABASE={env.get('SQLSERVER_DATABASE', 'labsbi')};"
            f"UID={env.get_required('SQLSERVER_USER')};"
            f"PWD={env.get_required('SQLSERVER_PASSWORD')}"
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
            f"SERVER={env.get('SQLSERVER_HOST', 'localhost')};"
            f"DATABASE={env.get('SQLSERVER_DATABASE', 'labsbi')};"
            f"UID={env.get_required('SQLSERVER_USER')};"
            f"PWD={env.get_required('SQLSERVER_PASSWORD')}"
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
    
    async def get_kpi_data(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT metric_name, metric_value FROM kpi_data")
            results = cursor.fetchall()
            return {row[0]: row[1] for row in results}
        finally:
            cursor.close()
            conn.close()

class SQLServerClientRepository(IClientRepository):
    def __init__(self):
        self.connection_string = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={env.get('SQLSERVER_HOST', 'localhost')};"
            f"DATABASE={env.get('SQLSERVER_DATABASE', 'labsbi')};"
            f"UID={env.get_required('SQLSERVER_USER')};"
            f"PWD={env.get_required('SQLSERVER_PASSWORD')}"
        )
    
    async def create_client(self, client: Client) -> Client:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO clients (user_id, full_name, phone_whatsapp, email, birth_date, note, created_at, status)
                OUTPUT INSERTED.client_id
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            values = (
                client.user_id, client.full_name, client.phone_whatsapp, client.email,
                client.birth_date, client.note, datetime.now(), client.status
            )
            cursor.execute(query, values)
            client_id = cursor.fetchone()[0]
            conn.commit()
            client.client_id = client_id
            client.created_at = datetime.now()
            return client
        finally:
            cursor.close()
            conn.close()
    
    async def update_client(self, client_id: int, client: Client) -> Optional[Client]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            query = """
                UPDATE clients SET full_name = ?, phone_whatsapp = ?, email = ?, 
                birth_date = ?, note = ?, status = ?
                WHERE client_id = ?
            """
            values = (
                client.full_name, client.phone_whatsapp, client.email,
                client.birth_date, client.note, client.status, client_id
            )
            cursor.execute(query, values)
            conn.commit()
            return await self.get_client_by_id(client_id) if cursor.rowcount > 0 else None
        finally:
            cursor.close()
            conn.close()
    
    async def get_client_by_id(self, client_id: int) -> Optional[Client]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM clients WHERE client_id = ?", client_id)
            result = cursor.fetchone()
            if result:
                columns = [column[0] for column in cursor.description]
                client_dict = dict(zip(columns, result))
                return Client(**client_dict)
            return None
        finally:
            cursor.close()
            conn.close()
    
    async def get_clients_by_user(self, user_id: int) -> List[Client]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC", user_id)
            results = cursor.fetchall()
            columns = [column[0] for column in cursor.description]
            return [Client(**dict(zip(columns, row))) for row in results]
        finally:
            cursor.close()
            conn.close()
    
    async def update_client_status(self, client_id: int, status: bool) -> bool:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE clients SET status = ? WHERE client_id = ?", status, client_id)
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()
    
    async def get_client_by_phone(self, phone: str, exclude_id: int = None) -> Optional[Client]:
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        try:
            if exclude_id:
                cursor.execute("SELECT * FROM clients WHERE phone_whatsapp = ? AND client_id != ?", phone, exclude_id)
            else:
                cursor.execute("SELECT * FROM clients WHERE phone_whatsapp = ?", phone)
            result = cursor.fetchone()
            if result:
                columns = [column[0] for column in cursor.description]
                client_dict = dict(zip(columns, result))
                return Client(**client_dict)
            return None
        finally:
            cursor.close()
            conn.close()