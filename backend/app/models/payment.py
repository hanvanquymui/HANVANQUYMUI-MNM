from sqlalchemy import Column, Integer, String, Float, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id")) # Liên kết với đơn hàng
    amount = Column(String(50)) # Số tiền thanh toán
    payment_method = Column(String(50), default="Thẻ tín dụng") # Cách trả tiền
    transaction_id = Column(String(100), unique=True) # Mã giao dịch (Giả lập)
    payment_date = Column(TIMESTAMP, server_default=func.now())

    # Tạo quan hệ ngược lại để dễ truy vấn (Optional)
    booking = relationship("Booking")