from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.database import get_db
from app.models.notification import Notification

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

# Model trả về
class NotificationResponse(BaseModel):
    id: int
    message: str
    is_read: bool
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d %H:%M:%S")
        }

# 1. API: Lấy tất cả thông báo (dùng để hiển thị trong Dropdown)
@router.get("/{user_email}", response_model=List[NotificationResponse])
def get_my_notifications(user_email: str, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_email == user_email)\
             .order_by(Notification.created_at.desc()).limit(10).all()

# 2. API: Lấy SỐ LƯỢNG thông báo chưa đọc (dùng cho chấm đỏ)
@router.get("/unread/{user_email}")
def get_unread_count(user_email: str, db: Session = Depends(get_db)):
    count = db.query(Notification).filter(
        Notification.user_email == user_email,
        Notification.is_read == False # Tìm những tin chưa đọc
    ).count()
    return {"unread_count": count}

# 3. API: Đánh dấu Đã đọc (khi user bấm vào chuông)
@router.put("/read/{user_email}")
def mark_all_as_read(user_email: str, db: Session = Depends(get_db)):
    db.query(Notification).filter(
        Notification.user_email == user_email,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "Đã đánh dấu tất cả thông báo là đã đọc"}