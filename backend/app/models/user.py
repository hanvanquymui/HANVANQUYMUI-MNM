from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
import enum
from app.database import Base  # <--- Sửa đường dẫn import chuẩn

# Giữ lại Enum này (để sau này bạn mở rộng nếu muốn)
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PROVIDER = "provider"
    CUSTOMER = "customer"
    USER = "user" # Thêm cái này cho khớp với dữ liệu mặc định

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=True) # Cho phép null tạm thời để tránh lỗi data cũ
    email = Column(String(255), unique=True, index=True, nullable=False)
    
    # Giữ nguyên các trường nâng cao của bạn
    phone_number = Column(String(20), unique=True, index=True, nullable=True)
    
    # Quan trọng: Tên cột phải là hashed_password để khớp với auth.py và DB
    hashed_password = Column(String(255), nullable=False)
    
    # SỬA LẠI: Dùng String cho an toàn, tránh lỗi lệch Enum với Database
    # Mặc định là 'user' khớp với lệnh SQL ALTER TABLE
    role = Column(String(50), default="user") 
    
    # Các trường quản lý trạng thái
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())