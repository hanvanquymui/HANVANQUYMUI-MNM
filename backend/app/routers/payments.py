from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.booking import Booking
from app.models.payment import Payment 
from app.models.notification import Notification # <--- ĐÃ THÊM IMPORT
import uuid 

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])

@router.put("/{booking_id}/pay")
def pay_booking(booking_id: int, db: Session = Depends(get_db)):
    # 1. Tìm đơn hàng
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # 2. Kiểm tra nếu đã thanh toán rồi thì thôi
    if booking.payment_status == "Đã thanh toán":
        return {"message": "Đơn này đã thanh toán rồi!"}

    # 3. Cập nhật trạng thái Booking
    booking.payment_status = "Đã thanh toán"
    booking.status = "Đã xác nhận"
    
    # 4. TẠO BẢN GHI THANH TOÁN (Lưu vào bảng Payments)
    new_payment = Payment(
        booking_id=booking.id,
        amount="500.000đ", # Trong thực tế sẽ lấy giá từ bảng Service
        payment_method="Thẻ Online",
        transaction_id=str(uuid.uuid4()) # Tạo mã ngẫu nhiên ví dụ: a1b2-c3d4...
    )
    db.add(new_payment)
    
    # 5. TẠO THÔNG BÁO TỰ ĐỘNG (BƯỚC BỊ THIẾU)
    msg = f"Thanh toán thành công cho dịch vụ '{booking.service_name}'. Đơn hàng ID: {booking.id} đã được xác nhận."
    new_noti = Notification(
        user_email=booking.user_email,
        message=msg,
        is_read=False # Mới tạo là CHƯA ĐỌC
    )
    db.add(new_noti)
    
    db.commit() # Commit tất cả Booking, Payment và Notification

    return {
        "message": "Thanh toán thành công!", 
        "payment_status": "Đã thanh toán",
        "transaction_id": new_payment.transaction_id
    }