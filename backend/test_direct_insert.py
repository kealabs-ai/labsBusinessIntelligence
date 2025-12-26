#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from infrastructure.repositories.whatsapp_instance_repository import WhatsAppInstanceRepository
from application.services.whatsapp_instance_service import WhatsAppInstanceService
from domain.entities.whatsapp_instance import WhatsAppInstanceCreate

def test_direct_insert():
    try:
        print("[INFO] Testando inserção direta...")
        
        repository = WhatsAppInstanceRepository()
        service = WhatsAppInstanceService(repository)
        
        instance_data = WhatsAppInstanceCreate(
            user_id=1,
            kea_client_id=None,
            instance_name="test_direct_insert",
            qr_code="test_qr_code_data",
            status=True
        )
        
        print(f"[INFO] Criando instância: {instance_data.instance_name}")
        created_instance = service.create_instance(instance_data)
        print(f"[SUCCESS] Instância criada com ID: {created_instance.id}")
        
        # Verificar se foi salva
        found = service.get_by_instance_name("test_direct_insert")
        print(f"[SUCCESS] Instância encontrada: ID={found.id}")
        
        # Limpar teste
        from infrastructure.repositories.mysql_repository import MySQLResourceRepository
        db = MySQLResourceRepository()
        db.execute("DELETE FROM whatsapp_instances WHERE instance_name = %s", ("test_direct_insert",))
        print("[INFO] Dados de teste removidos")
        
    except Exception as e:
        print(f"[ERROR] Erro: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_direct_insert()