from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models.user import User
from app.utils.security import verify_password
from app.utils.jwt_handler import create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Tìm user theo email
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Sai email hoặc mật khẩu")
    
    # 2. Kiểm tra mật khẩu (Dùng hashed_password)
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Sai email hoặc mật khẩu")
    
    # 3. Tạo token
    access_token = create_access_token(data={"sub": user.email})
    
    # 4. TRẢ VỀ KẾT QUẢ (QUAN TRỌNG: PHẢI CÓ DÒNG ROLE)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role,           # <--- ĐÂY LÀ DÒNG BẠN ĐANG THIẾU
        "user_email": user.email,
        "full_name": user.full_name
    }