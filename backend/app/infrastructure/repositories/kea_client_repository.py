from typing import List, Optional
from domain.entities.kea_client import KeaClient
from infrastructure.config.env_manager import env
import mysql.connector
import random
import string

class KeaClientRepository:
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

    def generate_kea_identifier(self) -> str:
        """Gera um identificador único KEA"""
        suffix = ''.join(random.choices(string.digits, k=6))
        return f"kea{suffix}"

    def create_kea_client(self, kea_client: KeaClient) -> KeaClient:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            # Gerar identificador KEA único
            kea_client.kea_identifier = self.generate_kea_identifier()
            
            query = """
            INSERT INTO kea_clients (name, cpf_cnpj, kea_identifier, email, site, 
                                   phone_number, cell_phone, whatsapp_number, address, 
                                   status, payment_plan, user_quantity, last_payment_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                kea_client.name, kea_client.cpf_cnpj, kea_client.kea_identifier,
                kea_client.email, kea_client.site, kea_client.phone_number,
                kea_client.cell_phone, kea_client.whatsapp_number, kea_client.address,
                kea_client.status, kea_client.payment_plan, kea_client.user_quantity,
                kea_client.last_payment_date
            ))
            
            kea_client.id = cursor.lastrowid
            connection.commit()
            return kea_client
            
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()

    def get_all_kea_clients(self) -> List[KeaClient]:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            query = """
            SELECT id, name, cpf_cnpj, kea_identifier, email, site, phone_number, 
                   cell_phone, whatsapp_number, address, status, payment_plan, 
                   user_quantity, last_payment_date, created_at, updated_at 
            FROM kea_clients ORDER BY created_at DESC
            """
            
            cursor.execute(query)
            rows = cursor.fetchall()
            
            clients = []
            for row in rows:
                client = KeaClient(
                    id=row[0],
                    name=row[1],
                    cpf_cnpj=row[2],
                    kea_identifier=row[3],
                    email=row[4],
                    site=row[5],
                    phone_number=row[6],
                    cell_phone=row[7],
                    whatsapp_number=row[8],
                    address=row[9],
                    status=bool(row[10]),
                    payment_plan=row[11],
                    user_quantity=row[12],
                    last_payment_date=row[13],
                    created_at=str(row[14]) if row[14] else None,
                    updated_at=str(row[15]) if row[15] else None
                )
                clients.append(client)
            
            return clients
            
        finally:
            cursor.close()
            connection.close()

    def update_kea_client(self, kea_client: KeaClient) -> KeaClient:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            query = """
            UPDATE kea_clients 
            SET name = %s, cpf_cnpj = %s, email = %s, site = %s, phone_number = %s,
                cell_phone = %s, whatsapp_number = %s, address = %s, status = %s,
                payment_plan = %s, user_quantity = %s, last_payment_date = %s
            WHERE id = %s
            """
            
            cursor.execute(query, (
                kea_client.name, kea_client.cpf_cnpj, kea_client.email, kea_client.site,
                kea_client.phone_number, kea_client.cell_phone, kea_client.whatsapp_number,
                kea_client.address, kea_client.status, kea_client.payment_plan,
                kea_client.user_quantity, kea_client.last_payment_date, kea_client.id
            ))
            
            connection.commit()
            return kea_client
            
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()

    def delete_kea_client(self, client_id: int) -> bool:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            query = "DELETE FROM kea_clients WHERE id = %s"
            cursor.execute(query, (client_id,))
            connection.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()