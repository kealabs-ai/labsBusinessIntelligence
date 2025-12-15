from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from application.services.agendamento_service import AgendamentoService
from application.services.auth_service import AuthService
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

class AgendamentoRequest(BaseModel):
    cliente: str
    servico: str
    data: str
    hora: str
    valor: Optional[float] = None
    whatsapp_number: Optional[str] = None
    custom_message: Optional[str] = None
    enable_notification: bool = False
    notification_quantity: int = 1
    notification_unit: str = 'dias'
    notification_date: Optional[datetime] = None
    client_id: Optional[int] = None
    service_id: Optional[int] = None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/test")
async def test_agendamentos():
    """
    Test endpoint to verify agendamentos API is working (no auth required)
    """
    return {"message": "Agendamentos API is working", "status": "ok"}

@router.post("/")
async def create_agendamento(request: AgendamentoRequest, user=Depends(get_current_user)):
    """
    Criar novo agendamento
    """
    logger.info("POST /agendamentos/ called")
    logger.info(f"Request data: {request.dict()}")
    try:
        service = AgendamentoService()
        agendamento = await service.create_agendamento(request.dict(), user.id, request.client_id, request.service_id)
        logger.info(f"Agendamento created successfully: {agendamento.dict()}")
        return {"success": True, "data": agendamento.dict()}
    except Exception as e:
        logger.error(f"Error creating agendamento: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_agendamentos(
    page: int = 1, 
    limit: int = 10, 
    search: str = None,
    date: str = None,
    user=Depends(get_current_user)
):
    """
    Buscar agendamentos filtrados por user_id e kea_client_id
    """
    logger.info(f"GET /agendamentos/ called - page: {page}, limit: {limit}, search: {search}, date: {date}")
    try:
        service = AgendamentoService()
        result = service.get_all_agendamentos(page, limit, search, user.id, date, user.kea_client_id)
        
        # Adicionar unit_name aos dados retornados
        items_with_unit = []
        for agendamento in result.get("items", []):
            agendamento_dict = agendamento.dict()
            agendamento_dict['unit_name'] = getattr(agendamento, 'unit_name', 'Sem unidade')
            items_with_unit.append(agendamento_dict)
        
        return {
            "success": True,
            "items": items_with_unit,
            "total": result.get("total", 0),
            "page": result.get("page", page),
            "limit": result.get("limit", limit),
            "pages": result.get("pages", 1)
        }
    except Exception as e:
        logger.error(f"Error fetching agendamentos: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{agendamento_id}")
async def get_agendamento(agendamento_id: int, user=Depends(get_current_user)):
    """
    Buscar agendamento por ID
    """
    try:
        service = AgendamentoService()
        agendamento = service.get_agendamento_by_id(agendamento_id)
        if not agendamento:
            raise HTTPException(status_code=404, detail="Agendamento não encontrado")
        return {"success": True, "data": agendamento.dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching agendamento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{agendamento_id}/update")
async def update_agendamento(agendamento_id: int, request: AgendamentoRequest, user=Depends(get_current_user)):
    """
    Atualizar agendamento
    """
    logger.info(f"POST /agendamentos/{agendamento_id}/update called")
    try:
        service = AgendamentoService()
        agendamento = service.update_agendamento(agendamento_id, request.dict(), user.id)
        if not agendamento:
            raise HTTPException(status_code=404, detail="Agendamento não encontrado")
        return {"success": True, "data": agendamento.dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating agendamento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{agendamento_id}/delete")
async def delete_agendamento(agendamento_id: int, user=Depends(get_current_user)):
    """
    Inativar agendamento
    """
    logger.info(f"POST /agendamentos/{agendamento_id}/delete called")
    try:
        service = AgendamentoService()
        service.delete_agendamento(agendamento_id)
        return {"success": True, "message": "Agendamento inativado com sucesso"}
    except Exception as e:
        logger.error(f"Error deleting agendamento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))