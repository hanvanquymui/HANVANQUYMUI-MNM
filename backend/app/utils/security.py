from passlib.context import CryptContext

# Cấu hình thuật toán mã hóa
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 1. Hàm kiểm tra mật khẩu (Dùng cho Đăng nhập)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 2. Hàm mã hóa mật khẩu (Dùng cho Đăng ký)
def get_password_hash(password):
    return pwd_context.hash(password)