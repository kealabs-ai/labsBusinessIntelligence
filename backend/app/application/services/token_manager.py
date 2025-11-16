from datetime import datetime, timedelta
from jose import JWTError, jwt
from domain.entities.token import Token
import hashlib
import os

class TokenManager:
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        return cls.get_password_hash(plain_password) == hashed_password
    
    @classmethod
    def get_password_hash(cls, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()
    
    @classmethod
    def create_access_token(cls, user_id: int, is_active: bool = True) -> Token:
        expire = datetime.utcnow() + timedelta(minutes=cls.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {
            "sub": str(user_id),
            "exp": expire,
            "is_active": is_active
        }
        encoded_jwt = jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
        
        return Token(
            access_token=encoded_jwt,
            expires_at=expire,
            user_id=user_id,
            is_active=is_active
        )
    
    @classmethod
    def verify_token(cls, token: str) -> dict:
        try:
            payload = jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
            user_id: str = payload.get("sub")
            is_active: bool = payload.get("is_active", True)
            
            if user_id is None or not is_active:
                return None
                
            return {"user_id": int(user_id), "is_active": is_active}
        except JWTError:
            return None