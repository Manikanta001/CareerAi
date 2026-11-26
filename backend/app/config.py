import os
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerAI"
    MONGODB_URI: str = "mongodb://localhost:27017/"
    DATABASE_NAME: str = "careerai"
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    FRONTEND_URL: str = "http://localhost:5173"
    UPLOAD_DIR: str = "uploads"
    OPENAI_API_KEY: str = ""
    JUDGE0_URL: str = ""
    JUDGE0_API_KEY: str = ""
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(env_file=[ENV_PATH, ".env"], extra="ignore")

settings = Settings()

if settings.ENVIRONMENT.lower() == "production":
    if len(settings.JWT_SECRET) < 32 or settings.JWT_SECRET.lower().startswith(("change-this", "replace-with", "your-")):
        raise ValueError("Set a unique random JWT_SECRET of at least 32 characters in production")
if not settings.JWT_SECRET:
    settings.JWT_SECRET = "local-development-secret-change-before-deploying"

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
