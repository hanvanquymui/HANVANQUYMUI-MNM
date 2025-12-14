from sqlalchemy import Column, Integer, String, Boolean, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255))
    message = Column(Text)
    is_read = Column(Boolean, default=False) # Mặc định là CHƯA ĐỌC
    created_at = Column(TIMESTAMP, server_default=func.now())