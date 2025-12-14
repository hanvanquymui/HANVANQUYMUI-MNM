from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.database import get_db
from app.models.booking import Booking
from app.models.notification import Notification

# --- KHỞI TẠO ROUTER ---
router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"])

# --- MODELS ---
# Định nghĩa dữ liệu đơn hàng khi gửi lên
class BookingRequest(BaseModel):
    user_email: str
    service_name: str
    booking_time: str
    provider_name: str # Đã có: Nhận tên nhân viên từ Frontend

# Định nghĩa dữ liệu trả về (Response Model)
class BookingResponse(BaseModel):
    id: int
    user_email: str  # <--- QUAN TRỌNG: Thêm dòng này để hiện tên khách!
    service_name: str
    booking_time: str
    status: str
    payment_status: Optional[str] = "Chưa thanh toán"
    provider_name: Optional[str] = "Mặc định" # Trả về tên nhân viên
    
    # Cấu hình Pydantic V2
    model_config = ConfigDict(from_attributes=True) 

# --- API FUNCTIONS ---

# API 1: Tạo Đơn hàng (CẬP NHẬT: Lưu provider_name)
@router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingRequest, db: Session = Depends(get_db)):
    # 1. Tạo Booking
    new_booking = Booking(
        user_email=booking.user_email,
        service_name=booking.service_name,
        booking_time=booking.booking_time,
        provider_name=booking.provider_name # <--- QUAN TRỌNG: Lưu tên nhân viên vào DB
    )
    db.add(new_booking)
    db.commit() # Commit để có ID
    
    # 2. TẠO THÔNG BÁO TỰ ĐỘNG (Cập nhật nội dung có tên nhân viên)
    msg = f"Đặt lịch '{booking.service_name}' với chuyên viên '{booking.provider_name}' thành công. Đơn hàng đang chờ xác nhận."
    new_noti = Notification(
        user_email=booking.user_email,
        message=msg,
        is_read=False # Mới tạo là CHƯA ĐỌC
    )
    db.add(new_noti)
    db.commit() # Lưu thông báo
    
    db.refresh(new_booking)
    return new_booking

# API 2: Lấy danh sách đơn hàng (GIỮ NGUYÊN)
@router.get("/my-bookings/{email}", response_model=List[BookingResponse])
def get_my_bookings(email: str, db: Session = Depends(get_db)):
    # Tìm tất cả đơn hàng có email trùng khớp, sắp xếp mới nhất lên đầu
    return db.query(Booking).filter(Booking.user_email == email).order_by(Booking.id.desc()).all()

# API 3: Hủy đơn hàng (GIỮ NGUYÊN)
@router.put("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    # 1. Tìm đơn hàng
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # 2. Kiểm tra điều kiện hủy
    if booking.status == "Hoàn thành" or booking.status == "Đã hủy":
        raise HTTPException(status_code=400, detail="Không thể hủy đơn hàng này")

    # 3. Cập nhật trạng thái
    booking.status = "Đã hủy"
    
    # Xử lý trạng thái thanh toán khi hủy
    if booking.payment_status == "Đã thanh toán":
        booking.payment_status = "Đã hủy (Chờ hoàn tiền)"
    else:
        booking.payment_status = "Đã hủy"

    # 4. TẠO THÔNG BÁO: Xác nhận hủy
    msg = f"Đơn hàng '{booking.service_name}' (ID: {booking_id}) đã được hủy thành công."
    new_noti = Notification(
        user_email=booking.user_email,
        message=msg,
        is_read=False
    )
    db.add(new_noti)
    
    db.commit()
    return {"message": "Đã hủy đơn hàng thành công"}