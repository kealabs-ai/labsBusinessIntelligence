from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.domain.entities.whatsapp_instance import WhatsAppInstance, WhatsAppInstanceCreate, WhatsAppInstanceQuery
from app.application.services.whatsapp_instance_service import WhatsAppInstanceService
from app.infrastructure.repositories.whatsapp_instance_repository import WhatsAppInstanceRepository
from app.infrastructure.database.database_factory import get_db

router = APIRouter(prefix="/whatsapp-instances", tags=["WhatsApp Instances"])


def get_whatsapp_instance_service(db: Session = Depends(get_db)) -> WhatsAppInstanceService:
    repository = WhatsAppInstanceRepository(db)
    return WhatsAppInstanceService(repository)


@router.post("/", response_model=WhatsAppInstance)
async def create_instance(
    instance_data: WhatsAppInstanceCreate,
    service: WhatsAppInstanceService = Depends(get_whatsapp_instance_service)
):
    """Cria uma nova instância WhatsApp"""
    try:
        return service.create_instance(instance_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[WhatsAppInstance])
async def get_instances(
    user_id: int = Query(..., description="ID do usuário"),
    kea_client_id: int = Query(None, description="ID do cliente KEA (opcional)"),
    service: WhatsAppInstanceService = Depends(get_whatsapp_instance_service)
):
    """Busca instâncias por user_id e opcionalmente kea_client_id"""
    query_params = WhatsAppInstanceQuery(user_id=user_id, kea_client_id=kea_client_id)
    return service.get_instances(query_params)


@router.get("/{instance_name}", response_model=WhatsAppInstance)
async def get_instance_by_name(
    instance_name: str,
    service: WhatsAppInstanceService = Depends(get_whatsapp_instance_service)
):
    """Busca instância por nome"""
    try:
        return service.get_by_instance_name(instance_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{instance_name}/status")
async def update_instance_status(
    instance_name: str,
    status: bool,
    service: WhatsAppInstanceService = Depends(get_whatsapp_instance_service)
):
    """Atualiza status da instância"""
    success = service.update_status(instance_name, status)
    if not success:
        raise HTTPException(status_code=404, detail="Instância não encontrada")
    return {"message": "Status atualizado com sucesso"}