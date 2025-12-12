from typing import List, Optional
from domain.entities.client import Client
import mysql.connector
from datetime import datetime

class ClientRepository:
    def __init__(self, connection):
        self.connection = connection

    async def create_client(self, client: Client) -> Client:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO clients (user_id, full_name, phone_whatsapp, email, birth_date, note, status, unit_id, kea_client_id, role_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                client.user_id,
                client.full_name,
                client.phone_whatsapp,
                client.email,
                client.birth_date,
                client.note,
                client.status if hasattr(client, 'status') else True,
                client.unit_id if hasattr(client, 'unit_id') and client.unit_id else 1,
                client.kea_client_id if hasattr(client, 'kea_client_id') else None,
                client.role_id if hasattr(client, 'role_id') and client.role_id else 1
            ))
            self.connection.commit()
            
            client.client_id = cursor.lastrowid
            client.created_at = datetime.now()
            return client
        except Exception as e:
            self.connection.rollback()
            raise e
        finally:
            cursor.close()

    async def update_client(self, client_id: int, client: Client) -> Optional[Client]:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = """
                UPDATE clients 
                SET full_name = %s, phone_whatsapp = %s, email = %s, birth_date = %s, note = %s, status = %s, unit_id = %s, kea_client_id = %s, role_id = %s
                WHERE client_id = %s
            """
            cursor.execute(query, (
                client.full_name,
                client.phone_whatsapp,
                client.email,
                client.birth_date,
                client.note,
                client.status if hasattr(client, 'status') else True,
                client.unit_id if hasattr(client, 'unit_id') and client.unit_id else 1,
                client.kea_client_id if hasattr(client, 'kea_client_id') else None,
                client.role_id if hasattr(client, 'role_id') and client.role_id else 1,
                client_id
            ))
            self.connection.commit()
            
            # Retrieve updated client
            return await self.get_client_by_id(client_id)
        except Exception as e:
            self.connection.rollback()
            raise e
        finally:
            cursor.close()

    async def get_client_by_id(self, client_id: int) -> Optional[Client]:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = "SELECT * FROM clients WHERE client_id = %s"
            cursor.execute(query, (client_id,))
            result = cursor.fetchone()
            return Client(**result) if result else None
        finally:
            cursor.close()

    async def get_clients_by_user(self, user_id: int) -> List[Client]:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = "SELECT * FROM clients WHERE user_id = %s ORDER BY created_at DESC"
            cursor.execute(query, (user_id,))
            results = cursor.fetchall()
            return [Client(**row) for row in results]
        finally:
            cursor.close()

    async def get_client_by_phone(self, phone: str, exclude_id: int = None) -> Optional[Client]:
        cursor = self.connection.cursor(dictionary=True)
        try:
            if exclude_id:
                query = "SELECT * FROM clients WHERE phone_whatsapp = %s AND client_id != %s LIMIT 1"
                cursor.execute(query, (phone, exclude_id))
            else:
                query = "SELECT * FROM clients WHERE phone_whatsapp = %s LIMIT 1"
                cursor.execute(query, (phone,))
            result = cursor.fetchone()
            return Client(**result) if result else None
        finally:
            cursor.close()

    async def update_client_status(self, client_id: int, status: bool) -> bool:
        cursor = self.connection.cursor()
        try:
            query = "UPDATE clients SET status = %s WHERE client_id = %s"
            cursor.execute(query, (status, client_id))
            self.connection.commit()
            return cursor.rowcount > 0
        except Exception as e:
            self.connection.rollback()
            raise e
        finally:
            cursor.close()

    async def delete_client(self, client_id: int) -> bool:
        cursor = self.connection.cursor()
        try:
            query = "UPDATE clients SET status = FALSE WHERE client_id = %s"
            cursor.execute(query, (client_id,))
            self.connection.commit()
            return cursor.rowcount > 0
        except Exception as e:
            self.connection.rollback()
            raise e
        finally:
            cursor.close()
