# Frontend Project

Cấu trúc này được tạo tự động bởi Python script.

🌿 Hệ Thống Quản Lý & Đặt Lịch Spa (Spa Booking System)

Đây là đồ án xây dựng ứng dụng web trọn vẹn (Full-stack) giúp khách hàng đặt lịch dịch vụ Spa trực tuyến và cung cấp công cụ quản trị cho chủ cửa hàng.

🚀 Tính Năng Chính

👤 Khách hàng (User)

Tra cứu dịch vụ: Xem danh sách dịch vụ với hình ảnh, giá tiền và mô tả chi tiết.

Đặt lịch hẹn: Chọn dịch vụ, chọn nhân viên (Kỹ thuật viên) và khung giờ mong muốn.

Quản lý cá nhân: Xem lịch sử đặt chỗ, theo dõi trạng thái đơn hàng (Chờ xác nhận, Đã xác nhận, Đã hủy).

Tương tác: Thanh toán đơn hàng (giả lập), Viết đánh giá (Rating sao + Bình luận).

Thông báo: Nhận thông báo thời gian thực (Real-time Notification) khi đơn hàng được duyệt.

🛡️ Quản trị viên (Admin)

Dashboard: Xem tổng quan danh sách đơn hàng.

Quản lý Đơn hàng: Duyệt đơn hoặc Hủy đơn của khách.

Quản lý Dịch vụ (CMS): Thêm mới dịch vụ (hỗ trợ upload ảnh từ máy tính), Xóa dịch vụ.

🛠 Công Nghệ Sử Dụng

Backend: Python 3.9+, FastAPI Framework.

Database: MySQL.

Frontend: HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5.

Thư viện chính:

sqlalchemy: ORM làm việc với Database.

pydantic: Validate dữ liệu.

passlib[bcrypt]: Mã hóa mật khẩu an toàn.

python-jose: Tạo và xác thực JWT Token.

python-multipart: Xử lý upload file.

⚙️ Hướng Dẫn Cài Đặt

1. Yêu cầu môi trường

Python (phiên bản 3.9 trở lên).

MySQL Server (XAMPP hoặc MySQL Workbench).

Trình duyệt web (Chrome/Edge).

2. Cài đặt thư viện

Mở Terminal (Command Prompt) tại thư mục backend của dự án và chạy lệnh sau để cài đặt các thư viện cần thiết:

pip install fastapi uvicorn sqlalchemy pymysql passlib[bcrypt] python-jose[cryptography] python-multipart


Hoặc nếu có file requirements.txt:

pip install -r requirements.txt


3. Cấu hình Cơ sở dữ liệu (Database)

Mở MySQL Workbench.

Tạo một database mới tên là spa_booking_db.

Kiểm tra file cấu hình tại backend/app/database.py. Đảm bảo thông tin kết nối đúng với máy của bạn:

# Cấu trúc: mysql+pymysql://<user>:<password>@<host>/<db_name>
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:123456@127.0.0.1/spa_booking_db"


(Thay root và 123456 bằng tài khoản MySQL của bạn).

4. Khởi chạy Server (Backend)

Tại thư mục backend, chạy lệnh sau để bật API Server:

uvicorn app.main:app --reload


Nếu thành công, bạn sẽ thấy thông báo:

INFO: Application startup complete.
Uvicorn running on http://127.0.0.1:8000

🌐 Hướng Dẫn Sử Dụng

1. Truy cập trang web

Vào thư mục gốc dự án.

Mở file index.html bằng trình duyệt (hoặc dùng Live Server của VS Code).

2. Tài khoản Demo

Hệ thống đã phân quyền rõ ràng. Bạn có thể sử dụng các tài khoản sau (nếu đã tạo trong DB):

👮 Tài khoản Admin (Quản trị viên):

Email: admin@gmail.com

Mật khẩu: 123456

Quyền hạn: Truy cập Admin Dashboard, Quản lý dịch vụ & Đơn hàng.

👤 Tài khoản User (Khách hàng):

Bạn có thể tự đăng ký tài khoản mới ngay trên giao diện Web.

Quyền hạn: Đặt lịch, Xem lịch sử, Đánh giá.

📂 Cấu Trúc Thư Mục

HANVANQUYMUI-MNM/
├── assets/             # Tài nguyên Frontend (CSS, JS, Ảnh)
│   ├── css/style.css
│   └── js/main.js      # Logic chính của Frontend
├── backend/            # Mã nguồn Backend API
│   ├── app/
│   │   ├── models/     # Định nghĩa bảng Database
│   │   ├── routers/    # Định nghĩa các API (Endpoint)
│   │   ├── utils/      # Các hàm tiện ích (Bảo mật, Hash)
│   │   ├── database.py # Kết nối CSDL
│   │   └── main.py     # File khởi chạy chính
│   └── uploads/        # Thư mục chứa ảnh do Admin upload
├── index.html          # Trang chủ
└── README.md           # Hướng dẫn sử dụng


