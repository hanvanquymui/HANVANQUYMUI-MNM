from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ProviderCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    description: Optional[str] = None

class ProviderResponse(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str]
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
