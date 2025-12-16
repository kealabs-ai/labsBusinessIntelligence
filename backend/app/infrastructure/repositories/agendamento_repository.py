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
                enable_notification TINYINT(1) DEFAULT 0,
                notification_sent TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                ativo TINYINT(1) DEFAULT 1,
                user_id INT,
                client_id INT UNSIGNED NOT NULL,
                valor DECIMAL(10,2),
                notification_quantity INT DEFAULT 1,
                notification_unit ENUM('dias', 'semanas', 'meses') DEFAULT 'dias',
                notification_date DATETIME,
                unit_id INT NOT NULL,
                INDEX idx_agendamentos_data (data),
                INDEX idx_agendamentos_enable_notification (enable_notification),
                INDEX idx_agendamentos_user_id (user_id)
            )
        """)
        self.connection.commit()
    
    def create(self, agendamento: Agendamento, user_id: int, client_id: int = None, service_id: int = None) -> Agendamento:
        cursor = self.connection.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO agendamentos (cliente, servico, data, hora, valor, whatsapp_number, 
                                        custom_message, enable_notification, notification_quantity, 
                                        notification_unit, notification_date, user_id, client_id, 
                                        service_id, notification_sent, ativo, unit_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            unit_id = getattr(agendamento, 'unit_id', None)
            if not unit_id:
                raise ValueError('unit_id é obrigatório para criar agendamento')
            cursor.execute(query, (
                agendamento.cliente,
                agendamento.servico,
                agendamento.data,
                agendamento.hora,
                agendamento.valor,
                agendamento.whatsapp_number,
                agendamento.custom_message,
                int(agendamento.enable_notification),
                agendamento.notification_quantity,
                agendamento.notification_unit,
                agendamento.notification_date,
                user_id,
                client_id or 0,
                service_id or 0,
                int(agendamento.notification_sent),
                1,
                unit_id
            ))
            
            agendamento.id = cursor.lastrowid
            self.connection.commit()
            return agendamento
        finally:
            cursor.close()
    
    def get_all(self, page: int = 1, limit: int = 10, search: str = None, user_id: int = None, date_filter: str = None, kea_client_id: str = None) -> dict:
        cursor = self.connection.cursor(dictionary=True)
        try:
            # Query base com JOIN para buscar nome da unidade
            base_query = """
                SELECT a.*, u.unit_name, us.unit_id 
                FROM agendamentos a 
                LEFT JOIN users us ON a.user_id = us.id 
                LEFT JOIN unit_settings u ON us.unit_id =  us.unit_id 
                WHERE (a.ativo IS NULL OR a.ativo = TRUE)
            """
            count_query = """
                SELECT COUNT(*) as total 
                FROM agendamentos a 
                LEFT JOIN users us ON a.user_id = us.id 
                WHERE (a.ativo IS NULL OR a.ativo = TRUE)
            """
            params = []
            
            # Filtrar por user_id OU kea_client_id
            count_params = []
            if user_id and kea_client_id:
                base_query += " AND (a.user_id = %s OR us.kea_client_id = %s)"
                count_query += " AND (a.user_id = %s OR us.kea_client_id = %s)"
                params.extend([user_id, kea_client_id])
                count_params.extend([user_id, kea_client_id])
            elif user_id:
                base_query += " AND a.user_id = %s"
                count_query += " AND a.user_id = %s"
                params.append(user_id)
                count_params.append(user_id)
            elif kea_client_id:
                base_query += " AND us.kea_client_id = %s"
                count_query += " AND us.kea_client_id = %s"
                params.append(kea_client_id)
                count_params.append(kea_client_id)
            
            # Adicionar filtro de busca
            if search:
                search_filter = " AND (a.cliente LIKE %s OR a.servico LIKE %s)"
                base_query += search_filter
                count_query += search_filter
                search_param = f"%{search}%"
                params.extend([search_param, search_param])
                count_params.extend([search_param, search_param])
            
            # Adicionar filtro por data
            if date_filter:
                date_filter_sql = " AND a.data = %s"
                base_query += date_filter_sql
                count_query += date_filter_sql
                params.append(date_filter)
                count_params.append(date_filter)
            
            # Contar total de registros
            cursor.execute(count_query, count_params)
            total = cursor.fetchone()['total']
            
            # Adicionar paginação
            offset = (page - 1) * limit
            base_query += " ORDER BY a.data DESC, a.hora DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(base_query, params)
            
            agendamentos = []
            for row in cursor.fetchall():
                agendamento = Agendamento(
                    id=row['id'],
                    client_id=row.get('client_id'),
                    cliente=row['cliente'],
                    service_id=row.get('service_id'),
                    servico=row['servico'],
                    data=str(row['data']),
                    hora=str(row['hora']),
                    valor=float(row['valor']) if row.get('valor') else None,
                    whatsapp_number=row['whatsapp_number'],
                    custom_message=row['custom_message'],
                    enable_notification=bool(row['enable_notification']),
                    notification_sent=bool(row.get('notification_sent', False)),
                    notification_quantity=row.get('notification_quantity', 1),
                    notification_unit=row.get('notification_unit', 'dias'),
                    notification_date=row.get('notification_date'),
                    created_at=row.get('created_at'),
                    updated_at=row.get('updated_at'),
                    unit_name=row.get('unit_name'),
                    unit_id=row.get('unit_id')
                )
                agendamentos.append(agendamento)
            
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
        """Buscar agendamentos que precisam de notificação"""
        cursor = self.connection.cursor(dictionary=True)
        
        query = """
            SELECT * FROM agendamentos 
            WHERE enable_notification = 1 
            AND notification_sent = 0
            AND whatsapp_number IS NOT NULL
            AND ativo = 1
            ORDER BY data ASC, hora ASC
        """
        
        cursor.execute(query)
        
        agendamentos = []
        for row in cursor.fetchall():
            agendamentos.append(Agendamento(
                id=row['id'],
                cliente=row['cliente'],
                servico=row['servico'],
                data=str(row['data']),
                hora=str(row['hora']),
                valor=float(row['valor']) if row.get('valor') else None,
                whatsapp_number=row['whatsapp_number'],
                custom_message=row['custom_message'],
                enable_notification=bool(row['enable_notification']),
                notification_sent=bool(row.get('notification_sent', False)),
                notification_quantity=row.get('notification_quantity', 1),
                notification_unit=row.get('notification_unit', 'dias'),
                notification_date=row.get('notification_date'),
                created_at=row.get('created_at'),
                updated_at=row.get('updated_at')
            ))
        
        return agendamentos
    
    def update(self, agendamento_id: int, agendamento: Agendamento, user_id: int) -> Agendamento:
        cursor = self.connection.cursor(dictionary=True)
        
        query = """
            UPDATE agendamentos SET 
            cliente = %s, servico = %s, data = %s, hora = %s, valor = %s,
            whatsapp_number = %s, custom_message = %s, enable_notification = %s,
            notification_quantity = %s, notification_unit = %s, notification_date = %s,
            notification_sent = %s
            WHERE id = %s AND user_id = %s
        """
        
        cursor.execute(query, (
            agendamento.cliente,
            agendamento.servico,
            agendamento.data,
            agendamento.hora,
            agendamento.valor,
            agendamento.whatsapp_number,
            agendamento.custom_message,
            int(agendamento.enable_notification),
            agendamento.notification_quantity,
            agendamento.notification_unit,
            agendamento.notification_date,
            int(agendamento.notification_sent),
            agendamento_id,
            user_id
        ))
        
        self.connection.commit()
        agendamento.id = agendamento_id
        return agendamento
    
    def delete(self, agendamento_id: int):
        """Inativar agendamento (soft delete)"""
        cursor = self.connection.cursor()
        
        query = "UPDATE agendamentos SET ativo = 0 WHERE id = %s"
        cursor.execute(query, (agendamento_id,))
        self.connection.commit()
    
    def get_by_id(self, agendamento_id: int) -> Optional[Agendamento]:
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM agendamentos WHERE id = %s AND ativo = 1", (agendamento_id,))
        
        row = cursor.fetchone()
        if row:
            return Agendamento(
                id=row['id'],
                client_id=row.get('client_id'),
                cliente=row['cliente'],
                service_id=row.get('service_id'),
                servico=row['servico'],
                data=str(row['data']),
                hora=str(row['hora']),
                valor=float(row['valor']) if row.get('valor') else None,
                whatsapp_number=row['whatsapp_number'],
                custom_message=row['custom_message'],
                enable_notification=bool(row['enable_notification']),
                notification_sent=bool(row.get('notification_sent', False)),
                notification_quantity=row.get('notification_quantity', 1),
                notification_unit=row.get('notification_unit', 'dias'),
                notification_date=row.get('notification_date'),
                created_at=row.get('created_at'),
                updated_at=row.get('updated_at')
            )
        return None
    
    def mark_notification_sent(self, agendamento_id: int):
        """Marcar notificação como enviada"""
        cursor = self.connection.cursor()
        
        query = "UPDATE agendamentos SET notification_sent = 1, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
        
        cursor.execute(query, (agendamento_id,))
        self.connection.commit()