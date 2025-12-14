from sqlalchemy import Column, Integer, String
from app.database import Base

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))      # Tên nhân viên (VD: Nguyễn Văn A)
    specialty = Column(String(255)) # Chuyên môn (VD: Massage)