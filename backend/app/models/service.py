from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    price = Column(String(50))
    image = Column(String(255)) 
    description = Column(Text, nullable=True) # <--- ĐÃ CÓ