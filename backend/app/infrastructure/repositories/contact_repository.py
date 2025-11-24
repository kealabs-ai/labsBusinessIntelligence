from typing import List, Optional
from domain.entities.contact import Contact
import mysql.connector
from datetime import datetime

class ContactRepository:
    def __init__(self, connection):
        self.connection = connection

    def create(self, contact: Contact, user_id: int) -> Contact:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO contacts (name, phone, last_message, last_message_time, is_online, active, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                contact.name,
                contact.phone,
                contact.last_message,
                contact.last_message_time,
                contact.is_online,
                contact.active,
                user_id
            ))
            self.connection.commit()
            
            contact.id = cursor.lastrowid
            return contact
        finally:
            cursor.close()

    def get_by_phone(self, phone: str) -> Optional[Contact]:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = "SELECT * FROM contacts WHERE phone = %s AND active = TRUE"
            cursor.execute(query, (phone,))
            result = cursor.fetchone()
            return Contact(**result) if result else None
        finally:
            cursor.close()

    def get_all_active(self, user_id: int) -> List[Contact]:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = "SELECT * FROM contacts WHERE active = TRUE AND user_id = %s ORDER BY updated_at DESC"
            cursor.execute(query, (user_id,))
            results = cursor.fetchall()
            return [Contact(**row) for row in results]
        finally:
            cursor.close()

    def update_last_message(self, contact_id: int, message: str):
        cursor = self.connection.cursor()
        try:
            query = """
                UPDATE contacts 
                SET last_message = %s, last_message_time = %s, updated_at = %s
                WHERE id = %s
            """
            cursor.execute(query, (message, datetime.now(), datetime.now(), contact_id))
            self.connection.commit()
        finally:
            cursor.close()

    def update_online_status(self, contact_id: int, is_online: bool):
        cursor = self.connection.cursor()
        try:
            query = "UPDATE contacts SET is_online = %s, updated_at = %s WHERE id = %s"
            cursor.execute(query, (is_online, datetime.now(), contact_id))
            self.connection.commit()
        finally:
            cursor.close()