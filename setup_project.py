import os

# Cấu trúc dự án dựa trên bản thiết kế của bạn
structure = {
    "backend": [
        "requirements.txt",
        "README.md",
        "app/__init__.py",
        "app/main.py",
        "app/config.py",
        "app/database.py",
        "app/dependencies.py",
        
        # Models
        "app/models/__init__.py",
        "app/models/user.py",
        "app/models/provider.py",
        "app/models/service.py",
        "app/models/booking.py",
        "app/models/payment.py",
        "app/models/review.py",
        
        # Schemas
        "app/schemas/__init__.py",
        "app/schemas/user.py",
        "app/schemas/provider.py",
        "app/schemas/service.py",
        "app/schemas/booking.py",
        "app/schemas/review.py",
        "app/schemas/payment.py",
        
        # Routers
        "app/routers/__init__.py",
        "app/routers/auth.py",
        "app/routers/providers.py",
        "app/routers/services.py",
        "app/routers/bookings.py",
        "app/routers/reviews.py",
        "app/routers/payments.py",
        "app/routers/admin.py",
        
        # Utils
        "app/utils/__init__.py",
        "app/utils/jwt_handler.py",
        "app/utils/calendar.py",
        "app/utils/notifications.py",
        "app/utils/permissions.py",
        
        # Migrations & Tests
        "migrations/__init__.py", # Alembic thường tự tạo, nhưng cứ để đây giữ chỗ
        "tests/__init__.py",
    ]
}

def create_structure():
    print("🚀 Đang khởi tạo hệ thống Service Booking Platform...")
    
    for base_dir, files in structure.items():
        # Tạo thư mục gốc
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)
            print(f"✅ Created directory: {base_dir}")

        for file_path in files:
            full_path = os.path.join(base_dir, file_path.replace("backend/", ""))
            
            # Tạo các thư mục con nếu chưa tồn tại
            directory = os.path.dirname(full_path)
            if not os.path.exists(directory):
                os.makedirs(directory)
                print(f"✅ Created directory: {directory}")
            
            # Tạo file rỗng
            if not os.path.exists(full_path):
                with open(full_path, 'w', encoding='utf-8') as f:
                    # Ghi nội dung mẫu vào requirements.txt để tiết kiệm thời gian
                    if "requirements.txt" in full_path:
                        f.write("fastapi\nuvicorn\nsqlalchemy\npsycopg2-binary\nalembic\npython-dotenv\npydantic[email]\npython-multipart\npasslib[bcrypt]\npython-jose[cryptography]\n")
                    # Ghi nội dung mẫu vào main.py
                    elif "main.py" in full_path:
                        f.write("from fastapi import FastAPI\n\napp = FastAPI(title='Service Booking Platform')\n\n@app.get('/')\ndef read_root():\n    return {'message': 'System Operational'}")
                    else:
                        pass # File rỗng
                print(f"📄 Created file: {full_path}")
            else:
                print(f"⚠️ File already exists: {full_path}")

    print("\n🔥 Hoàn tất! Cấu trúc backend đã sẵn sàng.")
    print("👉 Bước tiếp theo: cd backend && pip install -r requirements.txt")

if __name__ == "__main__":
    create_structure()