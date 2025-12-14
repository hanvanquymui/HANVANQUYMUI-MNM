from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.booking import Booking
from app.routers.bookings import BookingResponse 

# Quan trọng: prefix phải đúng là "/api/v1/admin"
router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])

# Quan trọng: đường dẫn con phải là "/all-bookings"
@router.get("/all-bookings", response_model=List[BookingResponse])
def get_all_bookings_admin(db: Session = Depends(get_db)):
    # Lấy tất cả đơn hàng, mới nhất lên đầu
    return db.query(Booking).order_by(Booking.id.desc()).all()