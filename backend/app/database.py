from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:Admin%40123@127.0.0.1/spa_booking_db"

# 1. Tạo Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

# 2. Tạo SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Base
Base = declarative_base()

# 4. Hàm lấy DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()