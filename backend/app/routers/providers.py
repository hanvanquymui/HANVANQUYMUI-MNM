from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, ConfigDict
from app.database import get_db
from app.models.provider import Provider

router = APIRouter(prefix="/api/v1/providers", tags=["Providers"])

class ProviderResponse(BaseModel):
    id: int
    name: str
    specialty: str
    model_config = ConfigDict(from_attributes=True)

@router.get("/", response_model=List[ProviderResponse])
def get_all_providers(db: Session = Depends(get_db)):
    return db.query(Provider).all()