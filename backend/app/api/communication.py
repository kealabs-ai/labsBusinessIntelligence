from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from application.services.auth_service import AuthService
from infrastructure.config.env_manager import env
import httpx
import logging
import traceback

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()

class ChatClientRequest(BaseModel):
    where: dict

class SendMessageRequest(BaseModel):
    number: Optional[str] = None
    text: Optional[str] = None
    key: Optional[dict] = None
    message: Optional[dict] = None
    
    class Config:
        extra = "allow"
    
    def get_number_and_text(self):
        # Se number e text estão diretamente no payload
        if self.number and self.text:
            return self.number, self.text
        
        # Extrair da estrutura complexa
        number = None
        text = None
        
        if self.key and "remoteJid" in self.key:
            remote_jid = self.key["remoteJid"]
            number = remote_jid.replace("@s.whatsapp.net", "")
        
        if self.message and "extendedTextMessage" in self.message:
            text = self.message["extendedTextMessage"].get("text")
        
        return number, text

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/env-check")
async def check_environment():
    return {
        "URL_EVOLUTION_API": env.get("URL_EVOLUTION_API", "https://comunication-with-client-evolution-api.t37hka.easypanel.host"),
        "API_KEY_exists": bool(env.get("API_KEY")),
        "INSTANCE_exists": bool(env.get("INSTANCE")),
        "API_KEY_value": "***",
        "INSTANCE_value": env.get("INSTANCE"),
        "env_file_configured": True
    }

@router.post("/chat-client")
async def chat_client(request: ChatClientRequest, user=Depends(get_current_user)):
    try:
        # Obter variáveis de ambiente
        current_api_key = env.get("API_KEY")
        current_instance = env.get("INSTANCE")
        # Log minimal info about credentials (do NOT log secret values)
        logger.info(f"Evolution API creds loaded: API_KEY_exists={bool(current_api_key)}, API_KEY_len={len(current_api_key) if current_api_key else 0}, INSTANCE={current_instance}")
        
        if not current_api_key or not current_instance:
            logger.error("Evolution API credentials not configured (API_KEY or INSTANCE missing)")
            raise HTTPException(status_code=503, detail="Evolution API service not configured")
        
        headers = {
            "Content-Type": "application/json",
            "apikey": current_api_key,
            "instance": current_instance
        }
        
        url = f"{env.get('URL_EVOLUTION_API', 'https://comunication-with-client-evolution-api.t37hka.easypanel.host')}/chat/findMessages/{current_instance}"
        logger.info(f"Making request to: {url}")
        logger.info(f"Request payload: {request.dict()}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                json=request.dict(),
                headers=headers
            )
            logger.info(f"Response status: {response.status_code}")
            response.raise_for_status()
            data = response.json()
            logger.info(f"Response data keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
            
            # Tratar estrutura de response esperada
            if isinstance(data, dict) and "messages" in data:
                return {
                    "success": True,
                    "messages": {
                        "total": data["messages"].get("total", 0),
                        "pages": data["messages"].get("pages", 1),
                        "currentPage": data["messages"].get("currentPage", 1),
                        "records": data["messages"].get("records", [])
                    }
                }
            else:
                return {"success": False, "data": data}
                
    except httpx.TimeoutException as e:
        logger.error(f"Timeout Error: {str(e)}")
        raise HTTPException(status_code=408, detail="Request timeout")
    except httpx.RequestError as e:
        logger.error(f"Request Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP Status Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"HTTP error: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat_client: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)} - Check logs for details")



@router.post("/send-message-client")
async def send_message_client(request: SendMessageRequest, user=Depends(get_current_user)):
    try:
        # Obter variáveis de ambiente
        current_api_key = env.get("API_KEY")
        current_instance = env.get("INSTANCE")
        # Log minimal info about credentials (do NOT log secret values)
        logger.info(f"Evolution API creds loaded: API_KEY_exists={bool(current_api_key)}, API_KEY_len={len(current_api_key) if current_api_key else 0}, INSTANCE={current_instance}")
        
        if not current_api_key or not current_instance:
            logger.error("Evolution API credentials not configured (API_KEY or INSTANCE missing)")
            raise HTTPException(status_code=503, detail="Evolution API service not configured")
        
        headers = {
            "Content-Type": "application/json",
            "apikey": current_api_key,
            "instance": current_instance
        }
        
        url = f"{env.get('URL_EVOLUTION_API', 'https://comunication-with-client-evolution-api.t37hka.easypanel.host')}/message/sendText/{current_instance}"
        logger.info(f"Making request to: {url}")
        
        # Extrair number e text do request
        number, text = request.get_number_and_text()
        
        if not number or not text:
            raise HTTPException(status_code=400, detail="Missing number or text")
        
        payload = {"number": number, "text": text}
        logger.info(f"Request payload: {payload}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                json=payload,
                headers=headers
            )
            logger.info(f"Response status: {response.status_code}")
            
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"Evolution API Error: {response.status_code} - {error_text}")
                try:
                    error_json = response.json()
                    return {"success": False, "error": error_json, "status_code": response.status_code}
                except:
                    return {"success": False, "error": error_text, "status_code": response.status_code}
            
            data = response.json()
            logger.info(f"Response data: {data}")
            
            return {"success": True, "data": data}
                
    except httpx.TimeoutException as e:
        logger.error(f"Timeout Error: {str(e)}")
        raise HTTPException(status_code=408, detail="Request timeout")
    except httpx.RequestError as e:
        logger.error(f"Request Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP Status Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"HTTP error: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in send_message_client: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)} - Check logs for details")