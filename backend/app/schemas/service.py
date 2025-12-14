from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ServiceCreate(BaseModel):
    name: str
    price: str
    image: str
    description: Optional[str] = None

class ServiceResponse(BaseModel):
    id: int
    name: str
    price: str
    image: str
    description: Optional[str]

    class Config:
        from_attributes = True