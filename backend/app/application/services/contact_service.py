from typing import List, Optional
from domain.entities.contact import Contact
from infrastructure.repositories.contact_repository import ContactRepository
import mysql.connector
import os
import re

class ContactService:
    def __init__(self):
        connection_config = {
            'host': os.getenv('MYSQL_HOST', '72.60.140.128'),
            'port': int(os.getenv('MYSQL_PORT', 33060)),
            'user': os.getenv('MYSQL_USER', 'kealabs'),
            'password': os.getenv('MYSQL_PASSWORD', 'Kea2025@!@'),
            'database': os.getenv('MYSQL_DATABASE', 'labsbi_mysql_db')
        }
        self.connection = mysql.connector.connect(**connection_config)
        self.repository = ContactRepository(self.connection)

    def get_or_create_contact(self, name: str, phone: str, user_id: int) -> Contact:
        """Busca contato por telefone ou cria novo se não existir"""
        formatted_phone = self._format_phone_number(phone)
        
        existing_contact = self.repository.get_by_phone(formatted_phone)
        if existing_contact:
            return existing_contact
        
        # Criar novo contato
        new_contact = Contact(
            name=name,
            phone=formatted_phone,
            is_online=False,
            active=True
        )
        return self.repository.create(new_contact, user_id)

    def get_all_contacts(self, user_id: int) -> List[Contact]:
        """Buscar todos os contatos ativos"""
        return self.repository.get_all_active(user_id)

    def update_last_message(self, contact_id: int, message: str):
        """Atualizar última mensagem do contato"""
        self.repository.update_last_message(contact_id, message)

    def update_online_status(self, contact_id: int, is_online: bool):
        """Atualizar status online do contato"""
        self.repository.update_online_status(contact_id, is_online)

    def _format_phone_number(self, phone: str) -> str:
        """Formatar número de telefone"""
        clean_number = re.sub(r'\D', '', phone)
        
        if len(clean_number) == 11:
            clean_number = '55' + clean_number
        elif len(clean_number) == 10:
            clean_number = '55' + clean_number[0:2] + '9' + clean_number[2:]
        
        return clean_number