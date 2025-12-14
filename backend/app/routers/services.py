from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid
from app.database import get_db
from app.models.service import Service

router = APIRouter(prefix="/api/v1/services", tags=["Services"])

@router.get("/")
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

# API THÊM DỊCH VỤ (CÓ UPLOAD ẢNH)
@router.post("/")
def create_service(
    name: str = Form(...),
    price: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...), # Nhận file ảnh
    db: Session = Depends(get_db)
):
    # 1. Đặt tên file ngẫu nhiên (tránh trùng tên)
    file_extension = file.filename.split(".")[-1]
    new_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/{new_filename}"
    
    # 2. Lưu file vào thư mục uploads
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 3. Tạo đường dẫn ảnh (URL)
    image_url = f"http://127.0.0.1:8000/static/{new_filename}"

    # 4. Lưu vào Database
    new_service = Service(
        name=name,
        price=price,
        description=description,
        image=image_url
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

# API XÓA DỊCH VỤ
@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ")
    
    db.delete(service)
    db.commit()
    return {"message": "Đã xóa dịch vụ"}