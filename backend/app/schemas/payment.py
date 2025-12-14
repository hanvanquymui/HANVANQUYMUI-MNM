from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaymentCreate(BaseModel):
    booking_id: int
    amount: str
    payment_method: str

class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: str
    payment_method: str
    transaction_id: str
    payment_date: datetime

    class Config:
        from_attributes = True