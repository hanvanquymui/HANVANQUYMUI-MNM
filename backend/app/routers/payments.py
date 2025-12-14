from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.booking import Booking
from app.models.notification import Notification

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])

@router.put("/{booking_id}/pay")
def user_request_payment(booking_id: int, db: Session = Depends(get_db)):
    # 1. Tìm đơn hàng
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # 2. Logic mới: Khách bấm thanh toán -> Chuyển sang "Chờ xác nhận"
    # Admin sẽ là người bấm nút "Duyệt" sau này
    booking.payment_status = "Chờ xác nhận"
    
    # 3. Gửi thông báo xác nhận đã gửi yêu cầu
    msg = f"Yêu cầu thanh toán cho dịch vụ '{booking.service_name}' đã được gửi. Vui lòng chờ Admin xác nhận."
    new_noti = Notification(
        user_email=booking.user_email,
        message=msg,
        is_read=False
    )
    db.add(new_noti)
    
    db.commit()
    
    return {"message": "Đã gửi yêu cầu thanh toán. Vui lòng chờ Admin xác nhận!"}