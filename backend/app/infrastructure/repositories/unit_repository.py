from typing import List, Optional
from datetime import time
from domain.entities.unit import Unit
from infrastructure.config.env_manager import env
import mysql.connector
import os

class UnitRepository:
    def __init__(self):
        db_config = env.get_database_config()
        self.connection_config = {
            'host': db_config['host'],
            'port': db_config['port'],
            'user': env.get_required('MYSQL_USER'),
            'password': env.get_required('MYSQL_PASSWORD'),
            'database': db_config['database']
        }
        self.db_type = os.getenv('DB_ENGINE', 'mysql').lower()
    
    def get_connection(self):
        return mysql.connector.connect(**self.connection_config)

    def create_unit(self, unit: Unit) -> Unit:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            if self.db_type == "mysql":
                query = """
                INSERT INTO unit_settings (user_id, unit_name, address, phone, email, 
                                         opening_time, closing_time, appointment_interval, 
                                         notifications_enabled, notification_advance_hours)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
            else:  # SQL Server
                query = """
                INSERT INTO unit_settings (user_id, unit_name, address, phone, email, 
                                         opening_time, closing_time, appointment_interval, 
                                         notifications_enabled, notification_advance_hours)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
            
            cursor.execute(query, (
                unit.user_id, unit.unit_name, unit.address, unit.phone, unit.email,
                unit.opening_time, unit.closing_time, unit.appointment_interval,
                unit.notifications_enabled, unit.notification_advance_hours
            ))
            
            unit.id = cursor.lastrowid
            connection.commit()
            return unit
            
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()

    def get_units_by_user(self, user_id: int) -> List[Unit]:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            if self.db_type == "mysql":
                query = "SELECT * FROM unit_settings WHERE user_id = %s ORDER BY created_at DESC"
            else:
                query = "SELECT * FROM unit_settings WHERE user_id = ? ORDER BY created_at DESC"
            
            cursor.execute(query, (user_id,))
            rows = cursor.fetchall()
            
            units = []
            for row in rows:
                unit = Unit(
                    id=row[0],
                    user_id=row[1],
                    unit_name=row[2],
                    address=row[3],
                    phone=row[4],
                    email=row[5],
                    opening_time=row[6] if row[6] else time(8, 0),
                    closing_time=row[7] if row[7] else time(18, 0),
                    appointment_interval=row[8],
                    notifications_enabled=bool(row[9]),
                    notification_advance_hours=row[10],
                    created_at=str(row[11]) if row[11] else None,
                    updated_at=str(row[12]) if row[12] else None
                )
                units.append(unit)
            
            return units
            
        finally:
            cursor.close()
            connection.close()

    def update_unit(self, unit: Unit) -> Unit:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            if self.db_type == "mysql":
                query = """
                UPDATE unit_settings 
                SET unit_name = %s, address = %s, phone = %s, email = %s,
                    opening_time = %s, closing_time = %s, appointment_interval = %s,
                    notifications_enabled = %s, notification_advance_hours = %s
                WHERE id = %s AND user_id = %s
                """
            else:
                query = """
                UPDATE unit_settings 
                SET unit_name = ?, address = ?, phone = ?, email = ?,
                    opening_time = ?, closing_time = ?, appointment_interval = ?,
                    notifications_enabled = ?, notification_advance_hours = ?
                WHERE id = ? AND user_id = ?
                """
            
            cursor.execute(query, (
                unit.unit_name, unit.address, unit.phone, unit.email,
                unit.opening_time, unit.closing_time, unit.appointment_interval,
                unit.notifications_enabled, unit.notification_advance_hours,
                unit.id, unit.user_id
            ))
            
            connection.commit()
            return unit
            
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()

    def delete_unit(self, unit_id: int, user_id: int) -> bool:
        connection = self.get_connection()
        cursor = connection.cursor()
        
        try:
            if self.db_type == "mysql":
                query = "DELETE FROM unit_settings WHERE id = %s AND user_id = %s"
            else:
                query = "DELETE FROM unit_settings WHERE id = ? AND user_id = ?"
            
            cursor.execute(query, (unit_id, user_id))
            connection.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            connection.close()