from typing import List
from datetime import datetime, timedelta
from domain.entities.agendamento import Agendamento
from infrastructure.repositories.agendamento_repository import AgendamentoRepository
from application.services.contact_service import ContactService
from infrastructure.config.env_manager import env
import mysql.connector
import re

class AgendamentoService:
    def __init__(self):
        db_config = env.get_database_config()
        connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
        self.connection = mysql.connector.connect(**connection_config)
        self.repository = AgendamentoRepository(self.connection)
    
    async def create_agendamento(self, agendamento_data: dict, user_id: int, client_id: int = None, service_id: int = None) -> Agendamento:
        """Criar novo agendamento"""
        # Validar e formatar número WhatsApp
        if agendamento_data.get('whatsapp_number'):
            agendamento_data['whatsapp_number'] = self._format_whatsapp_number(
                agendamento_data['whatsapp_number']
            )
        
        agendamento = Agendamento(**agendamento_data)
        created_agendamento = self.repository.create(agendamento, user_id, client_id, service_id)
        
        # Criar ou atualizar contato se número WhatsApp fornecido
        if created_agendamento.whatsapp_number:
            try:
                contact_service = ContactService()
                contact_service.get_or_create_contact(
                    created_agendamento.cliente,
                    created_agendamento.whatsapp_number,
                    user_id
                )
            except Exception as e:
                print(f"Erro ao criar contato: {e}")
            
            await self.send_whatsapp_confirmation(created_agendamento)
        
        return created_agendamento
    
    def get_all_agendamentos(self, page: int = 1, limit: int = 10, search: str = None, user_id: int = None, date_filter: str = None, kea_client_id: str = None) -> dict:
        """Buscar agendamentos filtrados por user_id e kea_client_id"""
        return self.repository.get_all(page, limit, search, user_id, date_filter, kea_client_id)
    
    def get_agendamento_by_id(self, agendamento_id: int) -> Agendamento:
        """Buscar agendamento por ID"""
        return self.repository.get_by_id(agendamento_id)
    
    def update_agendamento(self, agendamento_id: int, agendamento_data: dict, user_id: int) -> Agendamento:
        """Atualizar agendamento"""
        if agendamento_data.get('whatsapp_number'):
            agendamento_data['whatsapp_number'] = self._format_whatsapp_number(
                agendamento_data['whatsapp_number']
            )
        
        agendamento = Agendamento(**agendamento_data)
        return self.repository.update(agendamento_id, agendamento, user_id)
    
    def delete_agendamento(self, agendamento_id: int):
        """Inativar agendamento"""
        return self.repository.delete(agendamento_id)
    
    def get_pending_notifications(self) -> List[Agendamento]:
        """Buscar agendamentos que precisam de notificação"""
        return self.repository.get_pending_notifications()
    
    def mark_notification_sent(self, agendamento_id: int):
        """Marcar notificação como enviada"""
        self.repository.mark_notification_sent(agendamento_id)
    
    def _format_whatsapp_number(self, number: str) -> str:
        """Formatar número para WhatsApp (apenas números)"""
        # Remove tudo que não é número
        clean_number = re.sub(r'\D', '', number)
        
        # Se não tem código do país, adiciona 55 (Brasil)
        if len(clean_number) == 11:  # DDD + número
            clean_number = '55' + clean_number
        elif len(clean_number) == 10:  # DDD + número sem 9
            clean_number = '55' + clean_number[0:2] + '9' + clean_number[2:]
        
        return clean_number
    
    def format_notification_message(self, agendamento: Agendamento) -> str:
        """Formatar mensagem de notificação com variáveis"""
        message = agendamento.custom_message or "Olá {{nome_cliente}}, lembramos que você tem um agendamento em {{data_agenda}} às {{hora_agenda}} para {{servico}}."
        
        # Substituir variáveis
        message = message.replace('{{nome_cliente}}', agendamento.cliente)
        message = message.replace('{{data_agenda}}', agendamento.data)
        message = message.replace('{{hora_agenda}}', agendamento.hora)
        message = message.replace('{{servico}}', agendamento.servico)
        
        return message
    
    def format_confirmation_message(self, agendamento: Agendamento) -> str:
        """Formatar mensagem de confirmação de agendamento"""
        # Usar mensagem personalizada se fornecida, senão usar padrão
        if agendamento.custom_message:
            message = agendamento.custom_message
        else:
            message = f"Olá {{{{nome_cliente}}}}! Seu agendamento foi confirmado para {{{{data_agenda}}}} às {{{{hora_agenda}}}} - {{{{servico}}}}. Obrigado!"
        
        # Formatar data para dd/MM/yyyy
        try:
            date_obj = datetime.strptime(agendamento.data, '%Y-%m-%d')
            formatted_date = date_obj.strftime('%d/%m/%Y')
        except:
            formatted_date = agendamento.data
        
        # Substituir variáveis
        message = message.replace('{{nome_cliente}}', agendamento.cliente)
        message = message.replace('{{data_agenda}}', formatted_date)
        message = message.replace('{{hora_agenda}}', agendamento.hora)
        message = message.replace('{{servico}}', agendamento.servico)
        
        return message
    
    def _calculate_notification_date(self, data: str, hora: str, quantity: int, unit: str) -> datetime:
        """Calcular data de notificação baseada na antecedencia"""
        
        # Combinar data e hora
        agendamento_datetime = datetime.strptime(f"{data} {hora}", "%Y-%m-%d %H:%M")
        
        # Calcular antecedencia
        if unit == 'dias':
            notification_datetime = agendamento_datetime - timedelta(days=quantity)
        elif unit == 'semanas':
            notification_datetime = agendamento_datetime - timedelta(weeks=quantity)
        elif unit == 'meses':
            notification_datetime = agendamento_datetime - timedelta(days=quantity * 30)
        else:
            notification_datetime = agendamento_datetime - timedelta(days=1)
        
        return notification_datetime
    
    async def send_whatsapp_confirmation(self, agendamento: Agendamento) -> bool:
        """Enviar confirmação via WhatsApp"""
        if not agendamento.whatsapp_number:
            return False
            
        try:
            import httpx
            
            current_api_key = env.get("API_KEY")
            current_instance = env.get("INSTANCE")
            url_evolution_api = env.get("URL_EVOLUTION_API")
            
            # Se credenciais não estão configuradas, apenas retorna False
            if not current_api_key or not current_instance or not url_evolution_api:
                print("Evolution API credentials not configured, skipping WhatsApp confirmation")
                return False
            
            headers = {
                "Content-Type": "application/json",
                "apikey": current_api_key,
                "instance": current_instance
            }
            
            url = f"{url_evolution_api}/message/sendText/{current_instance}"
            message = self.format_confirmation_message(agendamento)
            
            payload = {
                "number": agendamento.whatsapp_number,
                "text": message
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                return response.status_code == 200
                
        except Exception as e:
            print(f"Erro ao enviar WhatsApp: {str(e)}")
            return False