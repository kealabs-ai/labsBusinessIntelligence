from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from application.services.contact_service import ContactService
from application.services.auth_service import AuthService
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    auth_service = AuthService()
    user = await auth_service.get_current_user(credentials.credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/test")
async def test_contacts():
    """
    Test endpoint to verify contacts API is working (no auth required)
    """
    return {"message": "Contacts API is working", "status": "ok"}

@router.get("/")
async def get_contacts(user=Depends(get_current_user)):
    """
    Buscar todos os contatos ativos
    """
    try:
        service = ContactService()
        contacts = service.get_all_contacts(user.id)
        return {
            "success": True,
            "data": [contact.dict() for contact in contacts] if contacts else []
        }
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        return {
            "success": False,
            "data": [],
            "error": str(e)
        }