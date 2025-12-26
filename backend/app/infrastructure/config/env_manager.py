import os
from typing import Optional
from dotenv import load_dotenv, find_dotenv
import os
import logging

logger = logging.getLogger(__name__)

class EnvManager:
    _instance = None
    _loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._loaded:
            # Try to load the project's backend `.env` file from different possible locations
            try:
                # Path to the directory of the current file (env_manager.py)
                current_dir = os.path.dirname(__file__)
                
                # Path to the backend directory: .../backend
                backend_dir = os.path.abspath(os.path.join(current_dir, '..', '..', '..'))
                
                # Path to the root project directory: .../ (e.g., LabsBusinessIntelligence)
                project_root_dir = os.path.abspath(os.path.join(backend_dir, '..'))

                # List of paths to check for the .env file
                dotenv_paths_to_check = [
                    os.path.join(backend_dir, '.env'),
                    os.path.join(project_root_dir, '.env')
                ]

                loaded_path = None
                for path in dotenv_paths_to_check:
                    if os.path.exists(path):
                        load_dotenv(dotenv_path=path)
                        loaded_path = path
                        break
                
                if loaded_path:
                    logger.info(f"Loaded .env file from: {loaded_path}")
                else:
                    # Fallback to find_dotenv if no specific path is found
                    found_path = find_dotenv()
                    if found_path:
                        load_dotenv(found_path)
                        logger.info(f"Loaded .env file using find_dotenv(): {found_path}")
                    else:
                        logger.warning("No .env file found in standard locations or through find_dotenv().")

            except Exception as e:
                logger.exception("Failed to load .env file via EnvManager; falling back to generic load_dotenv().")
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