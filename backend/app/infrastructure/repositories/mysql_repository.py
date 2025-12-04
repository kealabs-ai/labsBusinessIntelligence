import mysql.connector
from typing import Optional, List, Dict, Any
from domain.entities.user import User
from domain.entities.client import Client
from domain.entities.transacao import Transacao
from .interfaces import IUserRepository, IChartRepository, IClientRepository, ITransacaoRepository
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
            cursor.execute("SELECT id, username, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE username = %s AND is_active = 1", (username,))
            result = cursor.fetchone()
            return User(**result) if result else None
        finally:
            cursor.close()
            conn.close()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT id, username, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE id = %s", (user_id,))
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
                INSERT INTO transacoes (user_id, tipo, categoria, descricao, valor, data_transacao, 
                                      metodo_pagamento, observacoes, created_at, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                transacao.user_id, transacao.tipo, transacao.categoria, transacao.descricao,
                transacao.valor, transacao.data_transacao, transacao.metodo_pagamento,
                transacao.observacoes, datetime.now(), transacao.status
            )
            cursor.execute(query, values)
            conn.commit()
            transacao.id = cursor.lastrowid
            transacao.created_at = datetime.now()
            return transacao
        finally:
            cursor.close()
            conn.close()
    
    async def get_transacoes_by_user(self, user_id: int, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        conn = mysql.connector.connect(**self.connection_config)
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT COUNT(*) as total FROM transacoes WHERE user_id = %s AND status = 1", (user_id,))
            total = cursor.fetchone()['total']
            
            offset = (page - 1) * limit
            cursor.execute("""
                SELECT * FROM transacoes WHERE user_id = %s AND status = 1 
                ORDER BY data_transacao DESC, created_at DESC 
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
            cursor.execute("SELECT * FROM transacoes WHERE id = %s", (transacao_id,))
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
                UPDATE transacoes SET tipo = %s, categoria = %s, descricao = %s, valor = %s,
                data_transacao = %s, metodo_pagamento = %s, observacoes = %s, status = %s
                WHERE id = %s
            """
            values = (
                transacao.tipo, transacao.categoria, transacao.descricao, transacao.valor,
                transacao.data_transacao, transacao.metodo_pagamento, transacao.observacoes,
                transacao.status, transacao_id
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
            cursor.execute("UPDATE transacoes SET status = 0 WHERE id = %s", (transacao_id,))
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
                    SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
                    SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas,
                    COUNT(*) as total_transacoes
                FROM transacoes WHERE user_id = %s AND status = 1
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