from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from application.services.auth_service import AuthService
from infrastructure.config.env_manager import env
import httpx
import asyncio
import logging
import traceback

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()


async def _post_with_retry(client: httpx.AsyncClient, url: str, json_body: dict, headers: dict, retries: int = 3, backoff: float = 0.5):
    last_exc = None
    for attempt in range(1, retries + 1):
        try:
            resp = await client.post(url, json=json_body, headers=headers)
            # Retry on 5xx (server) errors
            if 500 <= resp.status_code < 600 and attempt < retries:
                logger.warning(f"Attempt {attempt} got {resp.status_code}; retrying after {backoff} seconds")
                await asyncio.sleep(backoff)
                backoff *= 2
                continue
            return resp
        except httpx.RequestError as e:
            last_exc = e
            if attempt < retries:
                logger.warning(f"Request error on attempt {attempt}: {e}; retrying after {backoff} seconds")
                await asyncio.sleep(backoff)
                backoff *= 2
                continue
            raise
    if last_exc:
        raise last_exc
    return None

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
        # Normalize and minimal validation
        api_key_str = current_api_key.strip() if isinstance(current_api_key, str) else ""
        instance_str = current_instance.strip() if isinstance(current_instance, str) else ""
        # Log minimal info about credentials (do NOT log secret values)
        logger.info(f"Evolution API creds loaded: API_KEY_exists={bool(api_key_str)}, API_KEY_len={len(api_key_str)}, INSTANCE={instance_str}")

      #  if not api_key_str or not instance_str:
      #      logger.error("Evolution API credentials not configured (API_KEY or INSTANCE missing or empty)")
       #     raise HTTPException(status_code=503, detail="Evolution API service not configured")
        
        headers = {
            "Content-Type": "application/json",
            "apikey": current_api_key,
            "instance": current_instance
        }
        
        url = f"{env.get('URL_EVOLUTION_API', 'https://comunication-with-client-evolution-api.t37hka.easypanel.host')}/chat/findMessages/{current_instance}"
        logger.info(f"Making request to: {url}")
        logger.info(f"Request payload: {request.dict()}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await _post_with_retry(client, url, request.dict(), headers)
            logger.info(f"Response status: {response.status_code}")
            # Do not raise here; handle non-200/2xx explicitly so we can forward body
            if response.status_code < 200 or response.status_code >= 300:
                text = None
                try:
                    text = response.json()
                except Exception:
                    text = response.text
                logger.error(f"Evolution API returned error {response.status_code}: {text}")
                raise HTTPException(status_code=response.status_code, detail={"external_error": text})
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
        body = None
        try:
            body = e.response.json()
        except Exception:
            body = e.response.text
        logger.error(f"HTTP Status Error: {e.response.status_code} - {body}")
        raise HTTPException(status_code=e.response.status_code, detail={"external_error": body})
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
        # Normalize and minimal validation
        api_key_str = current_api_key.strip() if isinstance(current_api_key, str) else ""
        instance_str = current_instance.strip() if isinstance(current_instance, str) else ""
        # Log minimal info about credentials (do NOT log secret values)
        logger.info(f"Evolution API creds loaded: API_KEY_exists={bool(api_key_str)}, API_KEY_len={len(api_key_str)}, INSTANCE={instance_str}")

        if not api_key_str or not instance_str:
            logger.error("Evolution API credentials not configured (API_KEY or INSTANCE missing or empty)")
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
            response = await _post_with_retry(client, url, payload, headers)
            logger.info(f"Response status: {response.status_code}")
            
            if response.status_code < 200 or response.status_code >= 300:
                error_text = None
                try:
                    error_text = response.json()
                except Exception:
                    error_text = response.text
                logger.error(f"Evolution API Error: {response.status_code} - {error_text}")
                raise HTTPException(status_code=response.status_code, detail={"external_error": error_text})
            
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
        body = None
        try:
            body = e.response.json()
        except Exception:
            body = e.response.text
        logger.error(f"HTTP Status Error: {e.response.status_code} - {body}")
        raise HTTPException(status_code=e.response.status_code, detail={"external_error": body})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in send_message_client: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)} - Check logs for details")