import os
from typing import Optional
from dotenv import load_dotenv
import os
import logging

class EnvManager:
    _instance = None
    _loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._loaded:
            # Try to load the project's backend `.env` first (robust when running
            # from a different working directory). Fall back to default behavior
            # so `load_dotenv()` can pick up environment files elsewhere.
            try:
                base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
                dotenv_path = os.path.join(base_dir, '.env')
                if os.path.exists(dotenv_path):
                    load_dotenv(dotenv_path)
                else:
                    load_dotenv()
            except Exception:
                # Ensure we still attempt a generic load if anything unexpected happens
                load_dotenv()
            self._loaded = True
    
    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        return os.getenv(key, default)
    
    def get_required(self, key: str) -> str:
        value = os.getenv(key)
        if value is None:
            raise ValueError(f"Required environment variable '{key}' not found")
        return value
    
    def get_bool(self, key: str, default: bool = False) -> bool:
        value = self.get(key)
        if value is None:
            return default
        return value.lower() in ('true', '1', 'yes', 'on')
    
    def get_int(self, key: str, default: Optional[int] = None) -> Optional[int]:
        value = self.get(key)
        if value is None:
            return default
        try:
            return int(value)
        except ValueError:
            return default
    
    # Configuration getters - no sensitive data exposed
    def get_database_config(self) -> dict:
        return {
            'host': self.get('MYSQL_HOST', 'localhost'),
            'port': self.get_int('MYSQL_PORT', 3306),
            'database': self.get('MYSQL_DATABASE', 'labs_bi')
        }
    
    def get_jwt_config(self) -> dict:
        return {
            'algorithm': self.get('JWT_ALGORITHM', 'HS256'),
            'expiration_hours': self.get_int('JWT_EXPIRATION_HOURS', 24)
        }

# Global instance
env = EnvManager()