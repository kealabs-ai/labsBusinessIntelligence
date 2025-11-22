from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from application.services.auth_service import AuthService
import httpx
import os
import logging
import traceback
from dotenv import load_dotenv
import pathlib

# Forçar carregamento do .env com caminho absoluto
env_path = pathlib.Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)
logger.info(f"Loading .env from: {env_path.absolute()}")
logger.info(f"Env file exists: {env_path.exists()}")

router = APIRouter()
security = HTTPBearer()

URL_EVOLUTION_API = os.getenv("URL_EVOLUTION_API", "https://comunication-with-client-evolution-api.t37hka.easypanel.host")
INSTANCE = os.getenv("INSTANCE")
API_KEY = os.getenv("API_KEY")

# Debug das variáveis
logger.info(f"Loading env vars - API_KEY: {bool(API_KEY)}, INSTANCE: {bool(INSTANCE)}")

class ChatClientRequest(BaseModel):
    where: dict

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/env-check")
async def check_environment():
    # Recarregar variáveis
    load_dotenv(dotenv_path=env_path, override=True)
    current_api_key = os.getenv("API_KEY")
    current_instance = os.getenv("INSTANCE")
    
    return {
        "URL_EVOLUTION_API": URL_EVOLUTION_API,
        "API_KEY_exists": bool(current_api_key),
        "INSTANCE_exists": bool(current_instance),
        "API_KEY_value": current_api_key[:10] + "..." if current_api_key else None,
        "INSTANCE_value": current_instance,
        "env_file_path": os.path.abspath(".env")
    }

@router.post("/chat-client")
async def chat_client(request: ChatClientRequest, user=Depends(get_current_user)):
    try:
        # Recarregar variáveis de ambiente
        load_dotenv(dotenv_path=env_path, override=True)
        current_api_key = os.getenv("API_KEY")
        current_instance = os.getenv("INSTANCE")
        
        # Validar variáveis de ambiente
        logger.info(f"API_KEY exists: {bool(current_api_key)}, INSTANCE exists: {bool(current_instance)}")
        if not current_api_key or not current_instance:
            missing = []
            if not current_api_key: missing.append("API_KEY")
            if not current_instance: missing.append("INSTANCE")
            raise HTTPException(status_code=500, detail=f"Missing environment variables: {', '.join(missing)}")
        
        headers = {
            "Content-Type": "application/json",
            "apikey": current_api_key,
            "instance": current_instance
        }
        
        url = f"{URL_EVOLUTION_API}/chat/findMessages/{current_instance}"
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