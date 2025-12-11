from typing import Optional
from domain.entities.user import User
from domain.entities.token import Token
from infrastructure.database.factory import DatabaseFactory
from .token_manager import TokenManager

class AuthService:
    def __init__(self):
        self.user_repository = DatabaseFactory.get_user_repository()
    
    async def authenticate_user(self, username: str, password: str) -> Optional[tuple]:
        user = await self.user_repository.get_user_by_credentials(username)
        
        if not user or not user.is_active:
            return None
            
        if not TokenManager.verify_password(password, user.password_hash):
            return None
            
        token = TokenManager.create_access_token(user.id, user.is_active, user.role)
        return (token, user)
    
    async def get_current_user(self, token: str) -> Optional[User]:
        token_data = TokenManager.verify_token(token)
        if not token_data:
            return None
            
        user = await self.user_repository.get_user_by_id(token_data["user_id"])
        return user if user and user.is_active else None