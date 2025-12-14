from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.utils.security import get_password_hash 

router = APIRouter(prefix="/api/v1/users", tags=["Users"])

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

@router.post("/register")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Kiểm tra email
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký!")
    
    # 2. Mã hóa mật khẩu
    hashed_pass = get_password_hash(user.password)
    
    # 3. Tạo User
    new_user = User(
        email=user.email, 
        hashed_password=hashed_pass, 
        full_name=user.full_name,
        role="user" 
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Đăng ký thành công", "email": new_user.email}