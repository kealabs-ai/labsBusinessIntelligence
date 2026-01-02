from typing import List
from datetime import date
from domain.entities.kea_client import KeaClient
from infrastructure.repositories.kea_client_repository import KeaClientRepository

class KeaClientService:
    def __init__(self):
        self.kea_client_repository = KeaClientRepository()

    def create_kea_client(self, client_data: dict) -> KeaClient:
        # Parse date if provided
        last_payment_date = None
        if client_data.get('last_payment_date'):
            last_payment_date = date.fromisoformat(client_data['last_payment_date'])
        
        kea_client = KeaClient(
            name=client_data['name'],
            cpf_cnpj=client_data['cpf_cnpj'],
            email=client_data['email'],
            site=client_data.get('site'),
            phone_number=client_data.get('phone_number'),
            cell_phone=client_data.get('cell_phone'),
            whatsapp_number=client_data.get('whatsapp_number'),
            address=client_data.get('address'),
            status=client_data.get('status', True),
            payment_plan=client_data.get('payment_plan'),
            user_quantity=client_data.get('user_quantity', 1),
            last_payment_date=last_payment_date,
            segmento=client_data.get('segmento')
        )
        
        return self.kea_client_repository.create_kea_client(kea_client)

    def get_all_kea_clients(self) -> List[KeaClient]:
        return self.kea_client_repository.get_all_kea_clients()
    
    def get_kea_client_by_id(self, client_id: int) -> KeaClient:
        return self.kea_client_repository.get_kea_client_by_id(client_id)

    def update_kea_client(self, client_id: int, client_data: dict) -> KeaClient:
        # Parse date if provided
        last_payment_date = None
        if client_data.get('last_payment_date'):
            last_payment_date = date.fromisoformat(client_data['last_payment_date'])
        
        kea_client = KeaClient(
            id=client_id,
            name=client_data['name'],
            cpf_cnpj=client_data['cpf_cnpj'],
            email=client_data['email'],
            site=client_data.get('site'),
            phone_number=client_data.get('phone_number'),
            cell_phone=client_data.get('cell_phone'),
            whatsapp_number=client_data.get('whatsapp_number'),
            address=client_data.get('address'),
            status=client_data.get('status', True),
            payment_plan=client_data.get('payment_plan'),
            user_quantity=client_data.get('user_quantity', 1),
            last_payment_date=last_payment_date,
            segmento=client_data.get('segmento')
        )
        
        return self.kea_client_repository.update_kea_client(kea_client)

    def delete_kea_client(self, client_id: int) -> bool:
        return self.kea_client_repository.delete_kea_client(client_id)