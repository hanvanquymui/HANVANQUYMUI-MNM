import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Service Booking Platform"
    PROJECT_VERSION: str = "1.0.0"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret_fail_safe")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

settings = Settings()