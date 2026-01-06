import secrets
import string
import base64
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from infrastructure.config.env_manager import env
from application.services.whatsapp_instance_service import WhatsAppInstanceService
from infrastructure.repositories.whatsapp_instance_repository import WhatsAppInstanceRepository
from domain.entities.whatsapp_instance import WhatsAppInstanceCreate
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
    api_url = env.get("URL_EVOLUTION_API", "https://comunication-with-client-evolution-api.t37hka.easypanel.host")
    evolution_api_key = env.get("EVOLUTION_API_KEY", "429683C4C977415CAAFCCE10F7D57E11")
    
    random_str = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
    instance_name = f"kea_{random_str}"
    
    logger.info(f"Criando instância: {instance_name}")

    try:
        # 1. Chamar Evolution API
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {"apikey": evolution_api_key, "Content-Type": "application/json"}
            payload = {"instanceName": instance_name, "qrcode": True, "integration": "WHATSAPP-BAILEYS"}
            
            response = await client.post(f"{api_url}/instance/create", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            qrcode_data = data.get("qrcode", {})
            base64_qr = qrcode_data.get("base64") if isinstance(qrcode_data, dict) else None
            token = data.get("token")  # Extrair token da resposta
            
            logger.info(f"Token recebido da API: {token}")
            logger.info(f"QR Code recebido: {'Sim' if base64_qr else 'Não'}")
            logger.info(f"Chaves da resposta: {list(data.keys())}")
            
            if not base64_qr:
                raise HTTPException(status_code=502, detail="QR Code não retornado")
        
        # 2. Salvar no banco IMEDIATAMENTE
        logger.info(f"Salvando {instance_name} no banco...")
        
        repository = WhatsAppInstanceRepository()
        service = WhatsAppInstanceService(repository)
        
        instance_data = WhatsAppInstanceCreate(
            user_id=user.id,
            kea_client_id=getattr(user, 'kea_client_id', None),
            instance_name=instance_name,
            qr_code=base64_qr,
            evolution_api_key=token,  # Salvar token da resposta
            status=True
        )
        
        logger.info(f"Dados da instância a serem salvos: {instance_data.dict()}")
        
        created_instance = service.create_instance(instance_data)
        logger.info(f"✅ SUCESSO: Instância salva com ID {created_instance.id}")
        logger.info(f"Token salvo: {created_instance.evolution_api_key}")
        
        return {"qrcode": base64_qr}
        
    except httpx.HTTPStatusError as e:
        logger.error(f"Evolution API error: {e.response.status_code}")
        raise HTTPException(status_code=502, detail="Erro na Evolution API")
    except Exception as e:
        logger.error(f"Erro geral: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
