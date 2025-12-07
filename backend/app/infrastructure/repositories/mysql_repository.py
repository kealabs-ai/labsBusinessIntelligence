import mysql.connector
from typing import Optional, List, Dict, Any
from domain.entities.user import User
from domain.entities.client import Client
from domain.entities.transacao import Transacao
from domain.entities.cash_register import CashRegister, CashRegisterCreate, CashRegisterUpdate
from domain.entities.service import Service
from domain.entities.resource import Resource
from .interfaces import IUserRepository, IChartRepository, IClientRepository, ITransacaoRepository, ICashRegisterRepository, IServiceRepository
from infrastructure.config.env_manager import env
from datetime import datetime
from decimal import Decimal

class MySQLUserRepository(IUserRepository):
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
    
    async def get_user_by_credentials(self, username: str) -> Optional[User]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT id, username, email, password_hash, role_id, kea_client_id, is_active, created_at, updated_at FROM users WHERE username = %s AND is_active = 1", (username,))
            result = cursor.fetchone()
            return User(**result) if result else None
        finally:
            cursor.close()
            conn.close()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT id, username, email, password_hash, role_id, kea_client_id, is_active, created_at, updated_at FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            return User(**result) if result else None
        finally:
            cursor.close()
            conn.close()

class MySQLChartRepository(IChartRepository):
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
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

class MySQLClientRepository(IClientRepository):
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
    
    async def create_client(self, client: Client) -> Client:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO clients (user_id, full_name, phone_whatsapp, email, birth_date, note, created_at, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                client.user_id, client.full_name, client.phone_whatsapp, client.email,
                client.birth_date, client.note, datetime.now(), client.status
            )
            cursor.execute(query, values)
            conn.commit()
            client.client_id = cursor.lastrowid
            client.created_at = datetime.now()
            return client
        finally:
            cursor.close()
            conn.close()
    
    async def update_client(self, client_id: int, client: Client) -> Optional[Client]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                UPDATE clients SET full_name = %s, phone_whatsapp = %s, email = %s, 
                birth_date = %s, note = %s, status = %s
                WHERE client_id = %s
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
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM clients WHERE client_id = %s", (client_id,))
            result = cursor.fetchone()
            return Client(**result) if result else None
        finally:
            cursor.close()
            conn.close()
    
    async def get_clients_by_user(self, user_id: int) -> List[Client]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM clients WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
            results = cursor.fetchall()
            return [Client(**row) for row in results]
        finally:
            cursor.close()
            conn.close()
    
    async def update_client_status(self, client_id: int, status: bool) -> bool:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE clients SET status = %s WHERE client_id = %s", (status, client_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()
    
    async def get_client_by_phone(self, phone: str, exclude_id: int = None) -> Optional[Client]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            if exclude_id:
                cursor.execute("SELECT * FROM clients WHERE phone_whatsapp = %s AND client_id != %s", (phone, exclude_id))
            else:
                cursor.execute("SELECT * FROM clients WHERE phone_whatsapp = %s", (phone,))
            result = cursor.fetchone()
            return Client(**result) if result else None
        finally:
            cursor.close()
            conn.close()

class MySQLTransacaoRepository(ITransacaoRepository):
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
    
    async def create_transacao(self, transacao: Transacao) -> Transacao:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO transactions (cash_register_id, transaction_type, amount, description, 
                                        transaction_date, category, payment_method)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                transacao.cash_register_id, transacao.transaction_type, transacao.amount, 
                transacao.description, transacao.transaction_date, transacao.category, 
                transacao.payment_method
            )
            cursor.execute(query, values)
            conn.commit()
            transacao.id = cursor.lastrowid
            return transacao
        finally:
            cursor.close()
            conn.close()
    
    async def get_transacoes_by_user(self, user_id: int, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("""
                SELECT COUNT(*) as total FROM transactions t 
                JOIN cash_register cr ON t.cash_register_id = cr.id 
                WHERE cr.user_id = %s
            """, (user_id,))
            total = cursor.fetchone()['total']
            
            offset = (page - 1) * limit
            cursor.execute("""
                SELECT t.* FROM transactions t 
                JOIN cash_register cr ON t.cash_register_id = cr.id 
                WHERE cr.user_id = %s 
                ORDER BY t.transaction_date DESC 
                LIMIT %s OFFSET %s
            """, (user_id, limit, offset))
            
            results = cursor.fetchall()
            transacoes = [Transacao(**row) for row in results]
            
            return {
                "items": transacoes,
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit
            }
        finally:
            cursor.close()
            conn.close()
    
    async def get_transacao_by_id(self, transacao_id: int) -> Optional[Transacao]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM transactions WHERE id = %s", (transacao_id,))
            result = cursor.fetchone()
            return Transacao(**result) if result else None
        finally:
            cursor.close()
            conn.close()
    
    async def update_transacao(self, transacao_id: int, transacao: Transacao) -> Optional[Transacao]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor()
        try:
            query = """
                UPDATE transactions SET transaction_type = %s, category = %s, description = %s, 
                amount = %s, transaction_date = %s, payment_method = %s
                WHERE id = %s
            """
            values = (
                transacao.transaction_type, transacao.category, transacao.description, 
                transacao.amount, transacao.transaction_date, transacao.payment_method, transacao_id
            )
            cursor.execute(query, values)
            conn.commit()
            return await self.get_transacao_by_id(transacao_id) if cursor.rowcount > 0 else None
        finally:
            cursor.close()
            conn.close()
    
    async def delete_transacao(self, transacao_id: int) -> bool:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM transactions WHERE id = %s", (transacao_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()
    
    async def get_resumo_financeiro(self, user_id: int) -> Dict[str, Any]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("""
                SELECT 
                    SUM(CASE WHEN t.transaction_type = 'entrada' THEN t.amount ELSE 0 END) as total_entradas,
                    SUM(CASE WHEN t.transaction_type = 'saida' THEN t.amount ELSE 0 END) as total_saidas,
                    COUNT(*) as total_transacoes
                FROM transactions t
                JOIN cash_register cr ON t.cash_register_id = cr.id
                WHERE cr.user_id = %s
            """, (user_id,))
            
            result = cursor.fetchone()
            total_entradas = float(result['total_entradas'] or 0)
            total_saidas = float(result['total_saidas'] or 0)
            
            return {
                "total_entradas": total_entradas,
                "total_saidas": total_saidas,
                "saldo": total_entradas - total_saidas,
                "total_transacoes": result['total_transacoes']
            }
        finally:
            cursor.close()
            conn.close()

class MySQLCashRegisterRepository(ICashRegisterRepository):
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
    
    async def create_cash_register(self, cash_register: CashRegisterCreate) -> CashRegister:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO cash_register (name, initial_balance, current_balance, opening_date, status, user_id)
                VALUES (%s, %s, %s, NOW(), %s, %s)
            """
            values = (
                cash_register.name, cash_register.initial_balance, cash_register.initial_balance,
                'open', cash_register.user_id
            )
            cursor.execute(query, values)
            conn.commit()
            cash_register_id = cursor.lastrowid
            return await self.get_cash_register_by_id(cash_register_id)
        finally:
            cursor.close()
            conn.close()
    
    async def get_cash_registers_by_user(self, user_id: int) -> List[CashRegister]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM cash_register WHERE user_id = %s ORDER BY opening_date DESC", (user_id,))
            results = cursor.fetchall()
            return [CashRegister(**row) for row in results]
        finally:
            cursor.close()
            conn.close()
    
    async def get_cash_register_by_id(self, cash_register_id: int) -> Optional[CashRegister]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM cash_register WHERE id = %s", (cash_register_id,))
            result = cursor.fetchone()
            return CashRegister(**result) if result else None
        finally:
            cursor.close()
            conn.close()
    
    async def update_cash_register(self, cash_register_id: int, cash_register: CashRegisterUpdate) -> Optional[CashRegister]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor()
        try:
            updates = []
            values = []
            
            if cash_register.name is not None:
                updates.append("name = %s")
                values.append(cash_register.name)
            if cash_register.current_balance is not None:
                updates.append("current_balance = %s")
                values.append(cash_register.current_balance)
            if cash_register.closing_date is not None:
                updates.append("closing_date = %s")
                values.append(cash_register.closing_date)
            if cash_register.status is not None:
                updates.append("status = %s")
                values.append(cash_register.status)
            
            if updates:
                query = f"UPDATE cash_register SET {', '.join(updates)} WHERE id = %s"
                values.append(cash_register_id)
                cursor.execute(query, values)
                conn.commit()
            
            return await self.get_cash_register_by_id(cash_register_id)
        finally:
            cursor.close()
            conn.close()
    
    async def get_or_create_default_cash_register(self, user_id: int) -> CashRegister:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM cash_register WHERE user_id = %s ORDER BY opening_date ASC LIMIT 1", (user_id,))
            result = cursor.fetchone()
            
            if result:
                return CashRegister(**result)
            
            # Create default cash register
            cash_register_create = CashRegisterCreate(
                name=f"Caixa Principal - User {user_id}",
                initial_balance=Decimal('0.00'),
                user_id=user_id
            )
            return await self.create_cash_register(cash_register_create)
        finally:
            cursor.close()
            conn.close()

class MySQLServiceRepository(IServiceRepository):
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
    
    async def create_service(self, service: Service) -> Service:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO services (user_id, name, category, description, price, duration, status, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                service.user_id, service.name, service.category, service.description,
                service.price, service.duration, service.status, datetime.now(), datetime.now()
            )
            cursor.execute(query, values)
            conn.commit()
            service.service_id = cursor.lastrowid
            service.created_at = datetime.now()
            service.updated_at = datetime.now()
            return service
        finally:
            cursor.close()
            conn.close()
    
    async def update_service(self, service_id: int, service: Service) -> Optional[Service]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                UPDATE services SET name = %s, category = %s, description = %s, price = %s,
                duration = %s, status = %s, updated_at = %s
                WHERE service_id = %s
            """
            values = (
                service.name, service.category, service.description, service.price,
                service.duration, service.status, datetime.now(), service_id
            )
            cursor.execute(query, values)
            conn.commit()
            return await self.get_service_by_id(service_id) if cursor.rowcount > 0 else None
        finally:
            cursor.close()
            conn.close()
    
    async def get_service_by_id(self, service_id: int) -> Optional[Service]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM services WHERE service_id = %s", (service_id,))
            result = cursor.fetchone()
            return Service(**result) if result else None
        finally:
            cursor.close()
            conn.close()
    
    async def get_services_by_user(self, user_id: int) -> List[Service]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM services WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
            results = cursor.fetchall()
            return [Service(**row) for row in results]
        finally:
            cursor.close()
            conn.close()
    
    async def update_service_status(self, service_id: int, status: bool) -> bool:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE services SET status = %s, updated_at = %s WHERE service_id = %s", (status, datetime.now(), service_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()

class MySQLResourceRepository:
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
    
    def fetchall(self, query: str, params: tuple) -> List[Dict[str, Any]]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(query, params)
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    
    def fetchone(self, query: str, params: tuple) -> Optional[Dict[str, Any]]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(query, params)
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()
    
    def execute(self, query: str, params: tuple) -> int:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            conn.commit()
            return cursor.lastrowid
        finally:
            cursor.close()
            conn.close()