from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    user_email: str
    service_name: str
    booking_time: str

class BookingResponse(BaseModel):
    id: int
    user_email: str
    service_name: str
    booking_time: str
    status: str
    payment_status: Optional[str] = "Chưa thanh toán"
    created_at: datetime

    class Config:
        from_attributes = True