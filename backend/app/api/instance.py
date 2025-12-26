import secrets
import string
import base64
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from infrastructure.config.env_manager import env
import httpx
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

class QRCodeBase64Response(BaseModel):
    qrcode: str

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Reutilize a lógica de autenticação existente
    from application.services.auth_service import AuthService
    user = await AuthService().get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.post("/create", response_model=QRCodeBase64Response)
async def create_instance(user=Depends(get_current_user)):
    # Chama Evolution API para criar nova instância e obter QR code
    api_url = env.get("URL_EVOLUTION_API", "https://comunication-with-client-evolution-api.t37hka.easypanel.host")
    evolution_api_key = env.get("EVOLUTION_API_KEY", "429683C4C977415CAAFCCE10F7D57E11")
    
    # Gera nome aleatório para a instância
    random_str = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
    instance_name = f"kea_{random_str}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {
                "apikey": evolution_api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "instanceName": instance_name,
                "qrcode": True,
            }
            response = await client.post(f"{api_url}/instance/create", json=payload, headers=headers)
            response.raise_for_status()

            data = response.json()
            
            # O endpoint da Evolution API com 'qrcode: true' retorna o QR code em um campo 'base64'
            base64_qr = data.get("base64")
            
            if not base64_qr:
                logger.error(f"Evolution API did not return 'base64' in response: {data}")
                raise HTTPException(status_code=502, detail="QR Code (base64) não retornado pela Evolution API")

            return {"qrcode": base64_qr}

    except httpx.HTTPStatusError as e:
        logger.error(f"Evolution API error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=502, detail="Erro ao criar instância na Evolution API")
    except Exception as e:
        logger.error(f"Erro ao criar instância: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar a criação da instância")
