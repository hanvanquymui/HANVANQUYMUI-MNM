from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255))
    service_name = Column(String(255))
    booking_time = Column(String(255))
    status = Column(String(50), default="Chờ xác nhận")
    
    # Cột trạng thái thanh toán
    payment_status = Column(String(50), default="Chưa thanh toán")
    
# --- CỘT MỚI: Tên nhân viên ---
    provider_name = Column(String(255), default="Mặc định")
    # ------------------------------

    created_at = Column(TIMESTAMP, server_default=func.now())