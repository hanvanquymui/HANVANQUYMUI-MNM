import os

# Tên dự án (thư mục gốc sẽ được tạo nếu chưa có, hoặc tạo file trong thư mục hiện tại)
PROJECT_NAME = "." 

# Cấu trúc dự án Frontend: Key là tên file/folder, Value là nội dung (nếu là file) hoặc dict con (nếu là folder)
structure = {
    "index.html": """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Project</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <header>
        <h1>Welcome to Automation Frontend</h1>
    </header>

    <main>
        <div id="app"></div>
    </main>

    <footer>
        <p>&copy; 2024 Your Project</p>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>""",
    
    "assets": {
        "css": {
            "style.css": """/* Reset CSS cơ bản */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; line-height: 1.6; }
header, footer { padding: 20px; text-align: center; background: #f4f4f4; }
main { padding: 20px; min-height: 80vh; }
""",
            "responsive.css": """/* CSS cho Mobile/Tablet */
@media (max-width: 768px) {
    body { font-size: 14px; }
}
"""
        },
        "js": {
            "main.js": """// Main Entry Point
document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend đã sẵn sàng!');
    const app = document.getElementById('app');
    app.innerHTML = '<p>Nội dung được render từ JavaScript</p>';
});
""",
            "utils.js": """// Các hàm tiện ích (Helpers)
export function log(message) {
    console.log(`[LOG]: ${message}`);
}
"""
        },
        "images": {
            "icons": {}, # Thư mục rỗng
            "banners": {} # Thư mục rỗng
        },
        "fonts": {}
    },
    
    "pages": {
        "about.html": "<h1>About Us</h1>",
        "contact.html": "<h1>Contact Us</h1>"
    },

    "README.md": "# Frontend Project\n\nCấu trúc này được tạo tự động bởi Python script."
}

def create_structure(base_path, structure_dict):
    for name, content in structure_dict.items():
        path = os.path.join(base_path, name)
        
        if isinstance(content, dict):
            # Nếu là dictionary thì tạo thư mục
            os.makedirs(path, exist_ok=True)
            print(f"📂 Đã tạo thư mục: {path}")
            # Đệ quy để tạo con bên trong
            create_structure(path, content)
        else:
            # Nếu là string thì tạo file và ghi nội dung
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"📄 Đã tạo file: {path}")

if __name__ == "__main__":
    print("🚀 Bắt đầu khởi tạo dự án Frontend...")
    create_structure(PROJECT_NAME, structure)
    print("\n✅ Xong! Dự án Frontend của bạn đã sẵn sàng.")
    print("   Mở file index.html để kiểm tra ngay.")