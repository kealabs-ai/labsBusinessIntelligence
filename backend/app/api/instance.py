from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from infrastructure.config.env_manager import env
import httpx
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

class InstanceCreateResponse(BaseModel):
    qr_code_url: str

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Reutilize a lógica de autenticação existente
    from application.services.auth_service import AuthService
    user = await AuthService().get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.post("/create", response_model=InstanceCreateResponse)
async def create_instance(user=Depends(get_current_user)):
    # Chama Evolution API para criar nova instância e obter QR code
    api_url = env.get("URL_EVOLUTION_API", "https://comunication-with-client-evolution-api.t37hka.easypanel.host")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{api_url}/instance/create")
            if response.status_code != 200:
                logger.error(f"Evolution API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=502, detail="Erro ao criar instância na Evolution API")
            data = response.json()
            qr_url = data.get("qrCodeUrl") or data.get("qr_code_url") or data.get("qrcode_url") or data.get("qr_code") or data.get("qr")
            if not qr_url:
                raise HTTPException(status_code=500, detail="QR Code não retornado pela Evolution API")
            return {"qr_code_url": qr_url}
    except Exception as e:
        logger.error(f"Erro ao criar instância: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar instância")
