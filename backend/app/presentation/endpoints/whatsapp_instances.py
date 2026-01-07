from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from domain.entities.whatsapp_instance import WhatsAppInstance, WhatsAppInstanceCreate, WhatsAppInstanceQuery
from application.services.whatsapp_instance_service import WhatsAppInstanceService
from application.services.auth_service import AuthService
from infrastructure.repositories.whatsapp_instance_repository import WhatsAppInstanceRepository
from infrastructure.repositories.mysql_repository import MySQLResourceRepository

router = APIRouter(prefix="/whatsapp-instances", tags=["WhatsApp Instances"])
security = HTTPBearer()
auth_service = AuthService()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return {"user_id": user.id, "role_id": user.role_id, "kea_client_id": user.kea_client_id}


def get_whatsapp_instance_service() -> WhatsAppInstanceService:
    repository = WhatsAppInstanceRepository()
    return WhatsAppInstanceService(repository)


@router.get("/latest-instance")
async def get_latest_instance(
    current_user: dict = Depends(get_current_user),
    service: WhatsAppInstanceService = Depends(get_whatsapp_instance_service)
):
    """Retorna o último instance_name do usuário logado e kea_client_id"""
    try:
        instance_name = service.get_latest_instance_name(
            user_id=current_user["user_id"],
            kea_client_id=current_user["kea_client_id"]
        )
        if not instance_name:
            raise HTTPException(status_code=404, detail="Nenhuma instância encontrada")
        return {"instance_name": instance_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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


@router.get("/debug/{instance_name}")
async def debug_instance(
    instance_name: str,
    service: WhatsAppInstanceService = Depends(get_whatsapp_instance_service)
):
    """Debug: mostra dados completos da instância"""
    try:
        instance = service.get_by_instance_name(instance_name)
        return {
            "id": instance.id,
            "user_id": instance.user_id,
            "kea_client_id": instance.kea_client_id,
            "instance_name": instance.instance_name,
            "has_qr_code": bool(instance.qr_code),
            "has_evolution_api_key": bool(instance.evolution_api_key),
            "evolution_api_key_preview": instance.evolution_api_key[:10] + "..." if instance.evolution_api_key else None,
            "status": instance.status,
            "created_at": str(instance.created_at)
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/update-token/{instance_name}")
async def update_instance_token(
    instance_name: str,
    token: str,
    service: WhatsAppInstanceService = Depends(get_whatsapp_instance_service)
):
    """Atualiza o token da instância com o valor retornado da API"""
    success = service.update_evolution_api_key(instance_name, token)
    if not success:
        raise HTTPException(status_code=404, detail="Instância não encontrada")
    return {"message": "Token atualizado com sucesso"}


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