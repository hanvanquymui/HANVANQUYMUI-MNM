from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# --- 1. THÊM THƯ VIỆN ĐỂ XỬ LÝ ẢNH ---
from fastapi.staticfiles import StaticFiles 
import os
# -------------------------------------

# Import tất cả các chức năng (Router)
# (Lưu ý: Tôi đã chỉnh lại 'notifications' cho đúng tên file chuẩn của dự án)
from app.routers import (
    users, 
    auth, 
    services, 
    bookings, 
    reviews, 
    payments, 
    notification, 
    providers, 
    admin
)

app = FastAPI() 

# Cấu hình CORS (Cho phép Frontend kết nối)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. CẤU HÌNH ĐỂ XEM ẢNH ĐÃ UPLOAD (QUAN TRỌNG) ---
# Kiểm tra nếu chưa có thư mục 'uploads' thì tạo mới
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Gán đường dẫn '/static' trỏ vào thư mục 'uploads'
# Khi truy cập http://localhost:8000/static/anh.jpg -> Server sẽ lấy file từ thư mục uploads
app.mount("/static", StaticFiles(directory="uploads"), name="static")
# --------------------------------------------------

# Kết nối các chức năng (Router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(services.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(payments.router)
app.include_router(notification.router)
app.include_router(providers.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Server is running!"}