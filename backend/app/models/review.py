from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255))
    service_name = Column(String(255))
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())