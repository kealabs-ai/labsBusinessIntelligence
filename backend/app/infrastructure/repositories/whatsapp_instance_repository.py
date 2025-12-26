from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.entities.whatsapp_instance import WhatsAppInstance, WhatsAppInstanceCreate, WhatsAppInstanceQuery
from sqlalchemy import text


class WhatsAppInstanceRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, instance_data: WhatsAppInstanceCreate) -> WhatsAppInstance:
        query = text("""
            INSERT INTO whatsapp_instances (user_id, kea_client_id, instance_name, qr_code, status)
            VALUES (:user_id, :kea_client_id, :instance_name, :qr_code, :status)
        """)
        
        self.db.execute(query, {
            "user_id": instance_data.user_id,
            "kea_client_id": instance_data.kea_client_id,
            "instance_name": instance_data.instance_name,
            "qr_code": instance_data.qr_code,
            "status": instance_data.status
        })
        self.db.commit()
        
        # Busca a instância criada
        return self.get_by_instance_name(instance_data.instance_name)

    def get_by_instance_name(self, instance_name: str) -> Optional[WhatsAppInstance]:
        query = text("""
            SELECT id, user_id, kea_client_id, instance_name, qr_code, created_at, status
            FROM whatsapp_instances
            WHERE instance_name = :instance_name
        """)
        
        result = self.db.execute(query, {"instance_name": instance_name}).fetchone()
        if result:
            return WhatsAppInstance(**dict(result._mapping))
        return None

    def get_instances(self, query_params: WhatsAppInstanceQuery) -> List[WhatsAppInstance]:
        base_query = """
            SELECT id, user_id, kea_client_id, instance_name, qr_code, created_at, status
            FROM whatsapp_instances
            WHERE user_id = :user_id
        """
        
        params = {"user_id": query_params.user_id}
        
        if query_params.kea_client_id is not None:
            base_query += " AND kea_client_id = :kea_client_id"
            params["kea_client_id"] = query_params.kea_client_id
        
        query = text(base_query)
        results = self.db.execute(query, params).fetchall()
        
        return [WhatsAppInstance(**dict(row._mapping)) for row in results]

    def update_status(self, instance_name: str, status: bool) -> bool:
        query = text("""
            UPDATE whatsapp_instances 
            SET status = :status 
            WHERE instance_name = :instance_name
        """)
        
        result = self.db.execute(query, {
            "status": status,
            "instance_name": instance_name
        })
        self.db.commit()
        
        return result.rowcount > 0