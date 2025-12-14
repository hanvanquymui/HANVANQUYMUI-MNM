from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Class này dùng để nhận dữ liệu khi user đăng ký
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None

# Class này dùng để trả về dữ liệu (Giấu password đi)
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True