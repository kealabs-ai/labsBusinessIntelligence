from typing import List
from domain.entities.whatsapp_instance import WhatsAppInstance, WhatsAppInstanceCreate, WhatsAppInstanceQuery
from infrastructure.repositories.whatsapp_instance_repository import WhatsAppInstanceRepository


class WhatsAppInstanceService:
    def __init__(self, repository: WhatsAppInstanceRepository):
        self.repository = repository

    def create_instance(self, instance_data: WhatsAppInstanceCreate) -> WhatsAppInstance:
        """Cria uma nova instância WhatsApp"""
        return self.repository.create(instance_data)

    def get_instances(self, query_params: WhatsAppInstanceQuery) -> List[WhatsAppInstance]:
        """Busca instâncias por user_id e opcionalmente kea_client_id"""
        return self.repository.get_instances(query_params)

    def get_by_instance_name(self, instance_name: str) -> WhatsAppInstance:
        """Busca instância por nome"""
        instance = self.repository.get_by_instance_name(instance_name)
        if not instance:
            raise ValueError(f"Instância '{instance_name}' não encontrada")
        return instance

    def update_status(self, instance_name: str, status: bool) -> bool:
        """Atualiza status da instância"""
        return self.repository.update_status(instance_name, status)