from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict 
from typing import List, Optional
from datetime import datetime # <--- Import thêm datetime
from app.database import get_db
from app.models.review import Review

# --- KHỞI TẠO ROUTER ---
router = APIRouter(prefix="/api/v1/reviews", tags=["Reviews"])
# -----------------------

# Model dữ liệu gửi lên (Khách viết đánh giá)
class ReviewCreate(BaseModel):
    user_email: str
    service_name: str
    rating: int
    comment: str

# Model dữ liệu trả về (Hiện ra web)
class ReviewResponse(ReviewCreate):
    id: int
    # SỬA LỖI TẠI ĐÂY: Đổi từ str sang datetime để khớp với Database
    created_at: Optional[datetime] = None 
    
    # Cấu hình Pydantic V2
    model_config = ConfigDict(from_attributes=True)

# API 1: Gửi đánh giá mới
@router.post("/", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    new_review = Review(
        user_email=review.user_email,
        service_name=review.service_name,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

# API 2: Xem danh sách đánh giá của một dịch vụ
@router.get("/{service_name}", response_model=List[ReviewResponse])
def get_reviews_by_service(service_name: str, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.service_name == service_name).all()