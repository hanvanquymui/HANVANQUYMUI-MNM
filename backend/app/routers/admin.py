from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.database import get_db
from app.models.booking import Booking
from app.models.payment import Payment # <--- Import Model Thanh toán
from app.models.notification import Notification # <--- Import Model Thông báo
from app.routers.bookings import BookingResponse 

# Quan trọng: prefix phải đúng là "/api/v1/admin"
router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])

# Quan trọng: đường dẫn con phải là "/all-bookings"
@router.get("/all-bookings", response_model=List[BookingResponse])
def get_all_bookings_admin(db: Session = Depends(get_db)):
    # Lấy tất cả đơn hàng, mới nhất lên đầu
    return db.query(Booking).order_by(Booking.id.desc()).all()

# --- API MỚI: ADMIN DUYỆT THANH TOÁN ---
@router.put("/confirm-payment/{booking_id}")
def admin_confirm_payment(booking_id: int, db: Session = Depends(get_db)):
    # 1. Tìm đơn hàng
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # 2. Admin xác nhận -> Chuyển thành "Đã thanh toán"
    booking.payment_status = "Đã thanh toán"
    booking.status = "Đã xác nhận" # Đơn hàng cũng được xác nhận luôn
    
    # 3. Tạo bản ghi thanh toán (Lưu vào lịch sử Payments)
    new_payment = Payment(
        booking_id=booking.id,
        amount="500.000đ", # (Thực tế nên lấy giá từ bảng Service)
        payment_method="Chuyển khoản (Admin duyệt)",
        transaction_id=f"ADMIN-{str(uuid.uuid4())[:8]}" # Mã giao dịch giả lập
    )
    db.add(new_payment)

    # 4. Gửi thông báo cho khách hàng
    msg = f"Admin đã xác nhận thanh toán cho đơn hàng '{booking.service_name}'. Cảm ơn quý khách!"
    new_noti = Notification(
        user_email=booking.user_email,
        message=msg,
        is_read=False
    )
    db.add(new_noti)

    db.commit()
    return {"message": "Đã xác nhận thanh toán thành công!"}