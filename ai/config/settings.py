"""
Cấu hình trung tâm cho hệ thống Scholar AI
"""
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Cấu hình ứng dụng"""
    
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Qdrant Configuration
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "scholar-ai")
    
    # Embedding Model
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
    
    # Data Processing
    SCHOOLS_DIRECTORY: str = os.getenv("SCHOOLS_DIRECTORY", "data/schools")
    MAX_CHUNK_SIZE: int = int(os.getenv("MAX_CHUNK_SIZE", "1200"))
    
    # API Configuration
    FLASK_HOST: str = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT: int = int(os.getenv("FLASK_PORT", "5000"))
    FLASK_DEBUG: bool = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    
    # RAG Configuration
    SEARCH_LIMIT: int = int(os.getenv("SEARCH_LIMIT", "10"))
    SCORE_THRESHOLD: float = float(os.getenv("SCORE_THRESHOLD", "0.5"))
    
    @classmethod
    def validate(cls) -> bool:
        """Validate required configuration"""
        if not cls.OPENAI_API_KEY:
            print("❌ OPENAI_API_KEY chưa được cấu hình")
            return False
        return True

# Global settings instance
settings = Settings()
