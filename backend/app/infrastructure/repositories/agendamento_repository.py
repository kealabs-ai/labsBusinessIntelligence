from typing import List, Optional
from domain.entities.agendamento import Agendamento
from infrastructure.repositories.interfaces import BaseRepository
import mysql.connector
from datetime import datetime

class AgendamentoRepository(BaseRepository):
    def __init__(self, connection):
        self.connection = connection
        self.create_table()
    
    def create_table(self):
        """Criar tabela de agendamentos se não existir"""
        cursor = self.connection.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS agendamentos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente VARCHAR(255) NOT NULL,
                servico VARCHAR(255) NOT NULL,
                data DATE NOT NULL,
                hora TIME NOT NULL,
                whatsapp_number VARCHAR(20),
                custom_message TEXT,
                enable_notification BOOLEAN DEFAULT FALSE,
                notification_sent BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        self.connection.commit()
    
    def create(self, agendamento: Agendamento, user_id: int) -> Agendamento:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO agendamentos (cliente, servico, data, hora, whatsapp_number, 
                                        custom_message, enable_notification, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                agendamento.cliente,
                agendamento.servico,
                agendamento.data,
                agendamento.hora,
                agendamento.whatsapp_number,
                agendamento.custom_message,
                agendamento.enable_notification,
                user_id
            ))
            
            agendamento.id = cursor.lastrowid
            self.connection.commit()
            return agendamento
        finally:
            cursor.close()
    
    def get_all(self, page: int = 1, limit: int = 10, search: str = None, user_id: int = None) -> dict:
        cursor = self.connection.cursor(dictionary=True)
        try:
            # Query base - filtrar apenas registros ativos e do usuário
            base_query = "SELECT * FROM agendamentos WHERE (ativo IS NULL OR ativo = TRUE)"
            count_query = "SELECT COUNT(*) as total FROM agendamentos WHERE (ativo IS NULL OR ativo = TRUE)"
            params = []
            
            if user_id:
                base_query += " AND user_id = %s"
                count_query += " AND user_id = %s"
                params.append(user_id)
            
            # Adicionar filtro de busca
            if search:
                search_filter = " AND (cliente LIKE %s OR servico LIKE %s)"
                base_query += search_filter
                count_query += search_filter
                search_param = f"%{search}%"
                params.extend([search_param, search_param])
            
            # Contar total de registros
            cursor.execute(count_query, params)
            total = cursor.fetchone()['total']
            
            # Adicionar paginação
            offset = (page - 1) * limit
            base_query += " ORDER BY data DESC, hora DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(base_query, params)
            
            agendamentos = []
            for row in cursor.fetchall():
                agendamentos.append(Agendamento(
                    id=row['id'],
                    cliente=row['cliente'],
                    servico=row['servico'],
                    data=str(row['data']),
                    hora=str(row['hora']),
                    whatsapp_number=row['whatsapp_number'],
                    custom_message=row['custom_message'],
                    enable_notification=bool(row['enable_notification']),
                    notification_sent=bool(row.get('notification_sent', False)),
                    created_at=row.get('created_at'),
                    updated_at=row.get('updated_at')
                ))
            
            return {
                "items": agendamentos,
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit
            }
        finally:
            cursor.close()
    
    def get_pending_notifications(self) -> List[Agendamento]:
        """Buscar agendamentos que precisam de notificação (24h antes)"""
        cursor = self.connection.cursor()
        
        query = """
            SELECT * FROM agendamentos 
            WHERE enable_notification = TRUE 
            AND notification_sent = FALSE
            AND whatsapp_number IS NOT NULL
            AND CONCAT(data, ' ', hora) BETWEEN NOW() + INTERVAL 23 HOUR 
            AND NOW() + INTERVAL 25 HOUR
        """
        
        cursor.execute(query)
        
        agendamentos = []
        for row in cursor.fetchall():
            agendamentos.append(Agendamento(
                id=row[0],
                cliente=row[1],
                servico=row[2],
                data=str(row[3]),
                hora=str(row[4]),
                whatsapp_number=row[5],
                custom_message=row[6],
                enable_notification=bool(row[7]),
                notification_sent=bool(row[8]),
                created_at=row[9],
                updated_at=row[10]
            ))
        
        return agendamentos
    
    def update(self, agendamento_id: int, agendamento: Agendamento, user_id: int) -> Agendamento:
        cursor = self.connection.cursor()
        
        query = """
            UPDATE agendamentos SET 
            cliente = %s, servico = %s, data = %s, hora = %s, 
            whatsapp_number = %s, custom_message = %s, enable_notification = %s
            WHERE id = %s AND user_id = %s
        """
        
        cursor.execute(query, (
            agendamento.cliente,
            agendamento.servico,
            agendamento.data,
            agendamento.hora,
            agendamento.whatsapp_number,
            agendamento.custom_message,
            agendamento.enable_notification,
            agendamento_id,
            user_id
        ))
        
        self.connection.commit()
        agendamento.id = agendamento_id
        return agendamento
    
    def delete(self, agendamento_id: int):
        """Inativar agendamento (soft delete)"""
        cursor = self.connection.cursor()
        
        # Adicionar coluna ativo se não existir
        try:
            cursor.execute("ALTER TABLE agendamentos ADD COLUMN ativo BOOLEAN DEFAULT TRUE")
            self.connection.commit()
        except:
            pass  # Coluna já existe
        
        query = "UPDATE agendamentos SET ativo = FALSE WHERE id = %s"
        cursor.execute(query, (agendamento_id,))
        self.connection.commit()
    
    def get_by_id(self, agendamento_id: int) -> Optional[Agendamento]:
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM agendamentos WHERE id = %s", (agendamento_id,))
        
        row = cursor.fetchone()
        if row:
            return Agendamento(
                id=row[0],
                cliente=row[1],
                servico=row[2],
                data=str(row[3]),
                hora=str(row[4]),
                whatsapp_number=row[5],
                custom_message=row[6],
                enable_notification=bool(row[7]),
                notification_sent=bool(row[8]),
                created_at=row[9],
                updated_at=row[10]
            )
        return None
    
    def mark_notification_sent(self, agendamento_id: int):
        """Marcar notificação como enviada"""
        cursor = self.connection.cursor()
        
        query = "UPDATE agendamentos SET notification_sent = TRUE WHERE id = %s"
        
        cursor.execute(query, (agendamento_id,))
        self.connection.commit()