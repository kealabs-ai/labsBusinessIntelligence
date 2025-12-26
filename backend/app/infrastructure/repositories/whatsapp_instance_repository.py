from typing import List, Optional
from domain.entities.whatsapp_instance import WhatsAppInstance, WhatsAppInstanceCreate, WhatsAppInstanceQuery
from infrastructure.repositories.mysql_repository import MySQLResourceRepository


class WhatsAppInstanceRepository:
    def __init__(self):
        self.db = MySQLResourceRepository()

    def create(self, instance_data: WhatsAppInstanceCreate) -> WhatsAppInstance:
        query = """
            INSERT INTO whatsapp_instances (user_id, kea_client_id, instance_name, qr_code, status)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        self.db.execute(query, (
            instance_data.user_id,
            instance_data.kea_client_id,
            instance_data.instance_name,
            instance_data.qr_code,
            instance_data.status
        ))
        
        # Busca a instância criada
        created_instance = self.get_by_instance_name(instance_data.instance_name)
        if not created_instance:
            raise Exception(f"Falha ao recuperar instância criada: {instance_data.instance_name}")
        
        return created_instance

    def get_by_instance_name(self, instance_name: str) -> Optional[WhatsAppInstance]:
        query = """
            SELECT id, user_id, kea_client_id, instance_name, qr_code, created_at, status
            FROM whatsapp_instances
            WHERE instance_name = %s
        """
        
        result = self.db.fetchone(query, (instance_name,))
        if result:
            return WhatsAppInstance(**result)
        return None

    def get_instances(self, query_params: WhatsAppInstanceQuery) -> List[WhatsAppInstance]:
        base_query = """
            SELECT id, user_id, kea_client_id, instance_name, qr_code, created_at, status
            FROM whatsapp_instances
            WHERE user_id = %s
        """
        
        params = [query_params.user_id]
        
        if query_params.kea_client_id is not None:
            base_query += " AND kea_client_id = %s"
            params.append(query_params.kea_client_id)
        
        results = self.db.fetchall(base_query, tuple(params))
        
        return [WhatsAppInstance(**row) for row in results]

    def update_status(self, instance_name: str, status: bool) -> bool:
        query = """
            UPDATE whatsapp_instances 
            SET status = %s 
            WHERE instance_name = %s
        """
        
        self.db.execute(query, (status, instance_name))
        return True