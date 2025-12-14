const API_URL = "http://127.0.0.1:8000"; 

// --- 1. KHỞI TẠO ỨNG DỤNG ---
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function checkLoginStatus() {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    
    if (token) {
        if (role === 'admin') {
            renderAdminDashboard(); 
        } else {
            renderDashboard(); 
        }
    } else {
        renderLogin();
    }
}

// ==========================================
//      PHẦN GIAO DIỆN AUTH (ĐẸP HƠN)
// ==========================================

// Ảnh nền cho trang đăng nhập/đăng ký
const AUTH_BG_URL = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

function renderLogin() {
    const app = document.getElementById('app');
    
    // CSS nội bộ cho trang login đẹp
    const style = `
        <style>
            .auth-container {
                min-height: 100vh;
                background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${AUTH_BG_URL}');
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .auth-card {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 40px;
                width: 100%;
                max-width: 450px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            }
            .auth-logo {
                font-size: 2rem;
                font-weight: bold;
                color: #198754;
                text-align: center;
                margin-bottom: 10px;
            }
            .auth-title {
                text-align: center;
                color: #555;
                margin-bottom: 30px;
                font-weight: 500;
            }
            .form-control {
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 20px;
            }
            .btn-auth {
                border-radius: 10px;
                padding: 12px;
                font-weight: bold;
                background: linear-gradient(to right, #198754, #20c997);
                border: none;
            }
            .btn-auth:hover {
                opacity: 0.9;
                transform: translateY(-2px);
                transition: all 0.3s;
            }
        </style>
    `;

    app.innerHTML = style + `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">🌱 SPA HÀN PHƯỢNG</div>
                <h4 class="auth-title">Đăng Nhập Hệ Thống</h4>
                
                <form onsubmit="handleLogin(event)">
                    <div class="mb-3">
                        <input id="loginEmail" class="form-control" placeholder="Email của bạn" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" id="loginPassword" class="form-control" placeholder="Mật khẩu" required>
                    </div>
                    <button class="btn btn-primary w-100 btn-auth text-white">ĐĂNG NHẬP NGAY</button>
                </form>

                <div class="text-center mt-4">
                    <p class="text-muted small">Chưa có tài khoản?</p>
                    <a href="#" class="text-success fw-bold text-decoration-none" onclick="renderRegister()">Đăng ký tài khoản mới</a>
                </div>
            </div>
        </div>
    `;
}

function renderRegister() {
    const app = document.getElementById('app');
    
    // Dùng chung style với login
    app.innerHTML = `
        <div class="auth-container" style="min-height: 100vh; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${AUTH_BG_URL}'); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center;">
             <style>
                .auth-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 40px;
                    width: 100%;
                    max-width: 450px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                }
                .form-control { border-radius: 10px; padding: 12px; margin-bottom: 15px; }
                .btn-auth { border-radius: 10px; padding: 12px; font-weight: bold; background: linear-gradient(to right, #198754, #20c997); border: none; }
            </style>
            <div class="auth-card">
                <div style="font-size: 2rem; font-weight: bold; color: #198754; text-align: center; margin-bottom: 10px;">🌱 SPA HÀN PHƯỢNG</div>
                <h4 class="text-center text-muted mb-4">Đăng Ký Thành Viên</h4>
                
                <form onsubmit="handleRegister(event)">
                    <div class="mb-3">
                        <input id="regName" class="form-control" placeholder="Họ và tên đầy đủ" required>
                    </div>
                    <div class="mb-3">
                        <input id="regEmail" class="form-control" placeholder="Email" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" id="regPass" class="form-control" placeholder="Mật khẩu" required>
                    </div>
                    <button class="btn btn-primary w-100 btn-auth text-white">ĐĂNG KÝ</button>
                </form>

                <div class="text-center mt-4">
                    <p class="text-muted small">Đã có tài khoản?</p>
                    <a href="#" class="text-success fw-bold text-decoration-none" onclick="renderLogin()">Quay lại Đăng nhập</a>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(e){
    e.preventDefault();
    const em=document.getElementById('loginEmail').value, pw=document.getElementById('loginPassword').value;
    const fd=new URLSearchParams(); fd.append('username',em); fd.append('password',pw);
    
    try {
        const r = await fetch(`${API_URL}/api/v1/auth/login`,{method:'POST',body:fd});
        const d = await r.json();
        
        if(r.ok){
            localStorage.setItem('access_token', d.access_token);
            localStorage.setItem('user_email', em); 
            localStorage.setItem('user_role', d.role);
            localStorage.setItem('full_name', d.full_name || 'Khách hàng'); 
            checkLoginStatus(); 
        } else {
            alert("❌ " + (d.detail || "Sai email hoặc mật khẩu!"));
        }
    } catch(e) { alert("Lỗi kết nối Server"); }
}

async function handleRegister(e) {
    e.preventDefault(); 
    const em = document.getElementById('regEmail').value; 
    const pw = document.getElementById('regPass').value; 
    const nm = document.getElementById('regName').value;
    
    if (!em || !pw || !nm) return alert('❌ Vui lòng điền đầy đủ thông tin!');
    
    try {
        const r = await fetch(`${API_URL}/api/v1/users/register`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({email: em, password: pw, full_name: nm}) 
        });
        const d = await r.json();
        
        if (r.ok) { 
            alert('✅ Đăng ký thành công! Vui lòng đăng nhập.'); 
            renderLogin(); 
        } else { 
            alert(`❌ ${d.detail || 'Lỗi đăng ký'}`); 
        }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
}

// ==========================================
//      PHẦN ADMIN (GIỮ NGUYÊN)
// ==========================================

async function renderAdminDashboard() {
    const app = document.getElementById('app');
    const email = localStorage.getItem('user_email');

    app.innerHTML = `
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark text-white rounded">
                <div>
                    <h3 class="m-0">🛡️ Admin Dashboard</h3>
                    <small>Xin chào: ${email}</small>
                </div>
                <button id="btnLogout" class="btn btn-danger btn-sm">Đăng Xuất</button>
            </div>
            
            <ul class="nav nav-tabs mb-3" id="adminTabs">
                <li class="nav-item"><button class="nav-link active fw-bold" onclick="switchAdminTab('bookings')">📅 Quản Lý Đơn Hàng</button></li>
                <li class="nav-item"><button class="nav-link fw-bold text-success" onclick="switchAdminTab('services')">💆‍♀️ Quản Lý Dịch Vụ</button></li>
            </ul>

            <div id="tab-bookings" class="card shadow">
                <div class="card-body">
                    <h5 class="card-title text-primary">Danh sách đặt chỗ</h5>
                    <div id="admin-bookings-content" class="table-responsive"><div class="text-center"><div class="spinner-border text-primary"></div></div></div>
                </div>
            </div>

            <div id="tab-services" class="card shadow" style="display:none;">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-3">
                        <h5 class="card-title text-success">Danh sách Dịch vụ hiện có</h5>
                        <button class="btn btn-success" onclick="new bootstrap.Modal(document.getElementById('addServiceModal')).show()">➕ Thêm Dịch Vụ Mới</button>
                    </div>
                    <div id="admin-services-content" class="row">Loading...</div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="addServiceModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header bg-success text-white"><h5 class="modal-title">Thêm Dịch Vụ Mới</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body">
            <form id="formAddService" onsubmit="handleCreateService(event)">
                <div class="mb-3"><label>Tên dịch vụ:</label><input type="text" id="svName" class="form-control" required></div>
                <div class="mb-3"><label>Giá tiền:</label><input type="text" id="svPrice" class="form-control" required></div>
                <div class="mb-3"><label>Mô tả:</label><textarea id="svDesc" class="form-control" rows="3"></textarea></div>
                <div class="mb-3"><label>Ảnh minh họa:</label><input type="file" id="svFile" class="form-control" accept="image/*" required></div>
                <button type="submit" class="btn btn-success w-100">Lưu Dịch Vụ</button>
            </form>
        </div></div></div></div>
    `;

    document.getElementById('btnLogout').addEventListener('click', handleLogout);
    loadAllBookingsForAdmin();
    loadAdminServices(); 
}

window.switchAdminTab = function(tabName) {
    const tabBookings = document.getElementById('tab-bookings');
    const tabServices = document.getElementById('tab-services');
    const btns = document.querySelectorAll('#adminTabs .nav-link');

    if (tabName === 'bookings') {
        tabBookings.style.display = 'block'; tabServices.style.display = 'none';
        btns[0].classList.add('active'); btns[1].classList.remove('active');
    } else {
        tabBookings.style.display = 'none'; tabServices.style.display = 'block';
        btns[0].classList.remove('active'); btns[1].classList.add('active');
    }
}

async function loadAdminServices() {
    const container = document.getElementById('admin-services-content');
    try {
        const res = await fetch(`${API_URL}/api/v1/services/`);
        const services = await res.json();
        container.innerHTML = services.map(s => `
            <div class="col-md-4 mb-3"><div class="card h-100 shadow-sm">
                <img src="${s.image}" class="card-img-top" style="height:150px; object-fit:cover" onerror="this.src='https://via.placeholder.com/150'">
                <div class="card-body p-2 text-center"><h6 class="fw-bold">${s.name}</h6><p class="text-danger mb-1 fw-bold">${s.price}</p><button class="btn btn-sm btn-outline-danger w-100" onclick="handleDeleteService(${s.id})">🗑️ Xóa</button></div>
            </div></div>`).join('');
    } catch(e) { container.innerHTML = '<p class="text-danger">Lỗi tải danh sách.</p>'; }
}

window.handleCreateService = async function(e) {
    e.preventDefault();
    const name = document.getElementById('svName').value; const price = document.getElementById('svPrice').value;
    const desc = document.getElementById('svDesc').value; const fileInput = document.getElementById('svFile');
    if(fileInput.files.length === 0) return alert("Vui lòng chọn ảnh!");
    const formData = new FormData();
    formData.append('name', name); formData.append('price', price);
    formData.append('description', desc); formData.append('file', fileInput.files[0]); 
    try {
        const res = await fetch(`${API_URL}/api/v1/services/`, { method: 'POST', body: formData });
        if (res.ok) { alert("✅ Thêm thành công!"); bootstrap.Modal.getInstance(document.getElementById('addServiceModal')).hide(); loadAdminServices(); } 
        else { alert("Lỗi khi lưu! Kiểm tra lại Server."); }
    } catch (err) { alert("Lỗi kết nối Server"); }
}

window.handleDeleteService = async function(id) {
    if(!confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    try { const res = await fetch(`${API_URL}/api/v1/services/${id}`, { method: 'DELETE' }); if(res.ok) { alert("Đã xóa!"); loadAdminServices(); } else { alert("Lỗi xóa."); } } catch(e) { alert("Lỗi kết nối."); }
}

async function loadAllBookingsForAdmin() {
    const container = document.getElementById('admin-bookings-content');
    try {
        const res = await fetch(`${API_URL}/api/v1/admin/all-bookings`);
        if (!res.ok) return container.innerHTML = '<p class="text-danger">Lỗi quyền!</p>';
        const bookings = await res.json();
        
        if (bookings.length === 0) return container.innerHTML = '<p class="text-center text-muted">Chưa có đơn hàng nào.</p>';
        
        let html = `<table class="table table-hover table-bordered align-middle mb-0 bg-white">
            <thead class="table-light"><tr><th>#ID</th><th>Khách Hàng</th><th>Dịch Vụ</th><th>Nhân Viên</th><th>Thời Gian</th><th>Trạng Thái</th><th>Thanh Toán</th><th>Hành Động</th></tr></thead>
            <tbody>`;
            
        bookings.forEach(b => {
            let statusBadge = b.status === 'Đã hủy' ? 'bg-danger' : (b.status === 'Đã xác nhận' ? 'bg-success' : 'bg-warning text-dark');
            let paymentBadge = b.payment_status === 'Đã thanh toán' ? '<span class="badge bg-success">💰 Đã nhận tiền</span>' : (b.payment_status.includes('Đã hủy') ? '<span class="badge bg-secondary">Hủy</span>' : (b.payment_status === 'Chờ xác nhận' ? '<span class="badge bg-warning text-dark">⏳ Chờ duyệt tiền</span>' : '<span class="badge bg-secondary">Chưa TT</span>'));
            
            let actionBtn = '';
            if (b.payment_status === 'Chờ xác nhận') {
                 actionBtn = `<button class="btn btn-sm btn-outline-success fw-bold" onclick="adminConfirmPayment(${b.id})">✅ Duyệt Tiền</button>`;
            } else if (b.status === 'Chờ xác nhận') {
                 actionBtn = `<button class="btn btn-sm btn-primary" onclick="adminConfirmBooking(${b.id})">Duyệt Đơn</button>`; 
            } else {
                 actionBtn = '<span class="text-muted">--</span>';
            }

            html += `<tr><td class="fw-bold text-center">${b.id}</td><td>${b.user_email || 'Ẩn danh'}</td><td class="text-primary">${b.service_name}</td><td>${b.provider_name || 'Mặc định'}</td><td>${b.booking_time.replace('T', ' ')}</td><td><span class="badge ${statusBadge}">${b.status}</span></td><td class="text-center">${paymentBadge}</td><td class="text-center">${actionBtn}</td></tr>`;
        });
        container.innerHTML = html + `</tbody></table>`;
    } catch(e) { container.innerHTML = '<p class="text-danger">Lỗi kết nối server.</p>'; }
}

window.adminConfirmPayment = async function(id) {
    if(!confirm("Xác nhận đã nhận tiền?")) return;
    try {
        const res = await fetch(`${API_URL}/api/v1/admin/confirm-payment/${id}`, { method: 'PUT' });
        if(res.ok) { alert("Đã duyệt!"); loadAllBookingsForAdmin(); }
    } catch(e) { alert("Lỗi kết nối."); }
}

window.adminConfirmBooking = async function(id) { alert("Chức năng duyệt đơn đang cập nhật."); }

// ==========================================
//      PHẦN KHÁCH HÀNG (GIỮ NGUYÊN)
// ==========================================

async function renderDashboard() {
    const app = document.getElementById('app');
    const userEmail = localStorage.getItem('user_email');
    
    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div class="container">
                <a class="navbar-brand fw-bold text-success fs-3" href="#" onclick="switchUserTab('home')">🌱 SPA LOGO</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span class="navbar-toggler-icon"></span></button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="nav-link active fw-bold" href="#" onclick="switchUserTab('home')">🏠 Trang chủ</a></li>
                        <li class="nav-item"><a class="nav-link fw-bold" href="#" onclick="switchUserTab('services')">💆‍♀️ Dịch vụ</a></li>
                        <li class="nav-item"><a class="nav-link fw-bold text-primary" href="#" onclick="renderUserProfile()">👤 Thông tin tài khoản</a></li>
                    </ul>
                    <div class="d-flex align-items-center gap-3">
                        <div class="dropdown position-static"> 
                            <button class="btn btn-outline-warning position-relative border-0" type="button" id="notiBtn" data-bs-toggle="dropdown" onclick="loadNotifications()">
                                🔔 <span class="fw-bold">Thông báo</span>
                                <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle text-white" id="notiBadge" style="display:none; font-size: 8px;"></span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end p-2 shadow" id="notiList" style="width: 300px; max-height: 400px; overflow-y: auto;"><li>Loading...</li></ul>
                        </div>
                        <div class="border-start ps-3 d-flex align-items-center gap-2">
                            <small class="text-muted fst-italic">${userEmail}</small>
                            <button onclick="handleLogout()" class="btn btn-danger btn-sm rounded-pill px-3">Thoát</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div id="main-content" class="container mt-4" style="min-height: 500px;"></div>

        <footer class="mt-5 border-top pt-4 pb-4 bg-dark text-white">
            <div class="container">
                <div class="row">
                    <div class="col-md-6"><h5>🌱 SPA HÀN PHƯỢNG</h5><p>Nơi thư giãn và chăm sóc sắc đẹp uy tín.</p></div>
                    <div class="col-md-6 text-md-end"><p class="m-1">📞 Hotline: <strong>0388139968</strong></p><p class="m-1">📘 Facebook: <strong>Hưng Hàn</strong></p></div>
                </div>
                <div class="text-center mt-3 small text-secondary">&copy; 2025 Spa Booking System.</div>
            </div>
        </footer>

        <!-- MODAL ĐẶT LỊCH -->
        <div class="modal fade" id="bookingModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content">
            <div class="modal-header bg-primary text-white"><h5 class="modal-title">Đặt Lịch</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body"><h5 id="modalServiceName" class="text-primary fw-bold mb-3"></h5><label class="fw-bold">📅 Chọn thời gian:</label><input type="datetime-local" id="bookingTime" class="form-control mb-3" required><label class="fw-bold">👤 Chọn nhân viên:</label><select id="bookingProvider" class="form-select"><option value="Mặc định">-- Chọn nhân viên --</option></select></div><div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button><button class="btn btn-success" onclick="submitBooking()">Xác Nhận</button></div>
        </div></div></div>

        <!-- MODAL REVIEW -->
        <div class="modal fade" id="reviewModal" tabindex="-1"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header bg-warning text-dark"><h5 class="modal-title">Đánh Giá: <span id="reviewServiceName"></span></h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><div class="card mb-3 p-3 bg-light border-warning"><h6>✍️ Viết cảm nhận:</h6><select id="reviewRating" class="form-select w-auto mb-2"><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option><option value="2">⭐⭐</option><option value="1">⭐</option></select><textarea id="reviewComment" class="form-control mb-2" placeholder="Nhập bình luận..."></textarea><button class="btn btn-warning" onclick="submitReview()">Gửi</button></div><hr><div id="reviews-list" class="mt-2" style="max-height: 300px; overflow-y: auto;"><p class="text-center">Đang tải...</p></div></div></div></div></div>

        <!-- MODAL THANH TOÁN QR -->
        <div class="modal fade" id="paymentModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">Thanh Toán Chuyển Khoản</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-3">Vui lòng quét mã QR dưới đây để thanh toán:</p>
                        <img src="assets/QR.jpg" alt="QR Code Ngân Hàng" class="img-fluid mb-3 border shadow-sm" style="max-height: 300px;" onerror="this.src='https://via.placeholder.com/300?text=QR+Code+Missing'">
                        <div class="alert alert-info mt-2"><strong>Nội dung chuyển khoản:</strong><br><span id="paymentNote" class="fw-bold text-danger fs-5">SPA ...</span></div>
                        <p class="small text-muted">Sau khi chuyển khoản, vui lòng bấm nút xác nhận bên dưới.</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button class="btn btn-success fw-bold px-4" onclick="confirmTransfer()">✅ Đã Chuyển Khoản</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btnLogout')?.addEventListener('click', handleLogout);
    checkUnreadNotifications();
    renderUserHome();
}

window.switchUserTab = function(tabName) {
    if (tabName === 'home') renderUserHome();
    else if (tabName === 'services') loadServices();
}

function renderUserHome() {
    const bannerUrl = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    document.getElementById('main-content').innerHTML = `
        <div class="p-5 mb-4 rounded-3 text-white text-center shadow position-relative" 
             style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${bannerUrl}'); 
                    background-size: cover; background-position: center; height: 400px; 
                    display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <h1 class="display-4 fw-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">Chào mừng đến với Spa Hàn Phượng</h1>
            <p class="fs-4 mb-4" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.7);">Thư giãn - Làm đẹp - Chăm sóc sức khỏe toàn diện</p>
            <button class="btn btn-success btn-lg fw-bold px-5 shadow" onclick="switchUserTab('services')">Đặt Dịch Vụ Ngay</button>
        </div>
        <div class="row text-center mt-4">
            <div class="col-md-4"><div class="card p-4 shadow-sm border-0 h-100"><h3>🏆</h3><h5>Chất lượng cao</h5><p class="text-muted">Đội ngũ chuyên nghiệp.</p></div></div>
            <div class="col-md-4"><div class="card p-4 shadow-sm border-0 h-100"><h3>🌿</h3><h5>Sản phẩm tự nhiên</h5><p class="text-muted">An toàn cho da.</p></div></div>
            <div class="col-md-4"><div class="card p-4 shadow-sm border-0 h-100"><h3>💰</h3><h5>Giá cả hợp lý</h5><p class="text-muted">Nhiều ưu đãi.</p></div></div>
        </div>
    `;
}

async function renderUserProfile() {
    const content = document.getElementById('main-content');
    const email = localStorage.getItem('user_email');
    const fullName = localStorage.getItem('full_name') || 'Khách hàng thân thiết'; 
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-success text-white text-center py-3"><h5 class="m-0">👤 Hồ Sơ Của Bạn</h5></div>
                    <div class="card-body text-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" class="img-fluid rounded-circle mb-3 border border-3 border-success p-1" style="width: 100px;">
                        <h5 class="fw-bold">${fullName}</h5>
                        <p class="text-muted mb-1">📧 ${email}</p>
                        <hr><div class="d-grid"><button class="btn btn-outline-success" onclick="alert('Tính năng này sẽ sớm ra mắt!')">🔑 Đổi mật khẩu</button></div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white border-bottom"><h5 class="m-0 text-success fw-bold">📜 Lịch Sử Đặt Chỗ & Thanh Toán</h5></div>
                    <div class="card-body p-0"><div id="history-content" class="table-responsive"><div class="text-center p-4"><div class="spinner-border text-success"></div></div></div></div>
                </div>
            </div>
        </div>
    `;
    loadUserHistoryTable();
}

async function loadUserHistoryTable() {
    const email = localStorage.getItem('user_email');
    const container = document.getElementById('history-content');
    try {
        const res = await fetch(`${API_URL}/api/v1/bookings/my-bookings/${email}`);
        const data = await res.json();
        if(data.length === 0) { container.innerHTML = '<div class="p-4 text-center text-muted">Bạn chưa đặt dịch vụ nào.</div>'; return; }
        
        let html = `<table class="table table-hover align-middle mb-0"><thead class="table-light"><tr><th>Dịch Vụ</th><th>Ngày Giờ</th><th>Trạng Thái</th><th>Hành Động</th></tr></thead><tbody>`;
        
        data.forEach(b => {
            let actionBtns = '';
            if (b.payment_status === 'Đã thanh toán') actionBtns += '<span class="badge bg-success">✅ Đã TT</span>';
            else if (b.payment_status === 'Chờ xác nhận') actionBtns += '<span class="badge bg-warning text-dark">⏳ Chờ duyệt</span>';
            else if (b.status !== 'Đã hủy') actionBtns += `<button class="btn btn-sm btn-success me-1" onclick="openPaymentQR(${b.id})">💸 TT</button>`;
            
            if (b.status !== 'Đã hủy' && b.status !== 'Hoàn thành' && b.payment_status !== 'Đã thanh toán') actionBtns += `<button class="btn btn-sm btn-outline-danger" onclick="cancelBooking(${b.id})">❌ Hủy</button>`;
            else if (b.status === 'Đã hủy') actionBtns += '<span class="text-muted small">Đã hủy</span>';

            html += `<tr><td><span class="fw-bold text-primary">${b.service_name}</span><br><small class="text-muted">${b.provider_name}</small></td><td>${b.booking_time.replace('T', ' ')}</td><td><span class="badge ${b.status==='Đã hủy'?'bg-danger':(b.status==='Đã xác nhận'?'bg-success':'bg-warning text-dark')}">${b.status}</span></td><td>${actionBtns}</td></tr>`;
        });
        html += `</tbody></table>`;
        container.innerHTML = html;
    } catch(e) { container.innerHTML = '<div class="p-4 text-danger text-center">Lỗi tải lịch sử.</div>'; }
}

let currentPaymentId = null;
window.openPaymentQR = function(id) { currentPaymentId = id; document.getElementById('paymentNote').innerText = `SPA BILL #${id}`; new bootstrap.Modal(document.getElementById('paymentModal')).show(); }
window.confirmTransfer = async function() { if (!currentPaymentId) return; try { const res = await fetch(`${API_URL}/api/v1/payments/${currentPaymentId}/pay`, {method: 'PUT'}); if (res.ok) { alert("Đã gửi yêu cầu! Vui lòng chờ Admin xác nhận."); bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide(); renderUserProfile(); checkUnreadNotifications(); } else { alert("Lỗi thanh toán."); } } catch(e) { alert("Lỗi kết nối."); } }

// --- LOGIC AUTH VÀ HÀM PHỤ (GIỮ NGUYÊN) ---

function handleLogout(){ if(confirm("Đăng xuất?")){ localStorage.clear(); renderLogin(); } }

async function loadServices() { 
    const content = document.getElementById('main-content');
    content.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-success"></div></div>';
    try { 
        const res = await fetch(`${API_URL}/api/v1/services/`); const s = await res.json(); 
        content.innerHTML = `
            <h3 class="text-success mb-4 text-center border-bottom pb-2">✨ Danh Sách Dịch Vụ ✨</h3>
            <div class="row g-4"> 
                ${s.map(i => `
                    <div class="col-md-4">
                        <div class="card h-100 shadow-sm hover-shadow border-0">
                            <img src="${i.image}" class="card-img-top" style="height:220px;object-fit:cover" onerror="this.src='https://via.placeholder.com/200'">
                            <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title fw-bold">${i.name}</h5>
                                <p class="text-danger fw-bold fs-5">${i.price}</p>
                                <p class="small text-muted flex-grow-1">${i.description || 'Chưa có mô tả'}</p>
                                <div class="d-grid gap-2 mt-auto">
                                    <button class="btn btn-primary" onclick="openBookingModal('${i.name}')">📅 Đặt Lịch</button>
                                    <button class="btn btn-outline-warning text-dark fw-bold" onclick="openReviewModal('${i.name}')">⭐ Xem Đánh Giá</button>
                                </div>
                            </div>
                        </div>
                    </div>`).join('')}
            </div>`; 
    } catch(e){ content.innerHTML = '<p class="text-danger text-center">Lỗi tải dịch vụ.</p>'; } 
}

let currentService=""; window.openBookingModal = async function(name) { currentService = name; document.getElementById('modalServiceName').innerText = name; const providerSelect = document.getElementById('bookingProvider'); providerSelect.innerHTML = '<option value="Mặc định">Đang tải nhân viên...</option>'; try { const res = await fetch(`${API_URL}/api/v1/providers/`); const providers = await res.json(); let options = `<option value="Mặc định">-- Ngẫu nhiên (Mặc định) --</option>`; providers.forEach(p => { options += `<option value="${p.name}">${p.name} - ${p.specialty}</option>`; }); providerSelect.innerHTML = options; } catch(e) { providerSelect.innerHTML = '<option value="Mặc định">Lỗi tải nhân viên</option>'; } new bootstrap.Modal(document.getElementById('bookingModal')).show(); }

window.submitBooking = async function() { const t=document.getElementById('bookingTime').value, p=document.getElementById('bookingProvider').value, e=localStorage.getItem('user_email'); if(!t)return alert("Chọn giờ!"); const res = await fetch(`${API_URL}/api/v1/bookings/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_email:e,service_name:currentService,booking_time:t,provider_name:p})}); if(res.ok){alert("Đặt thành công!"); bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide(); checkUnreadNotifications();}else alert("Lỗi"); }

async function renderHistory() { renderUserProfile(); } 
async function cancelBooking(id) { if(!confirm("Hủy đơn này?")) return; await fetch(`${API_URL}/api/v1/bookings/${id}/cancel`, {method: 'PUT'}); alert("Đã hủy."); renderUserProfile(); checkUnreadNotifications(); }
async function checkUnreadNotifications() { const email = localStorage.getItem('user_email'); const badge = document.getElementById('notiBadge'); if (!badge) return; try { const res = await fetch(`${API_URL}/api/v1/notifications/unread/${email}`); const data = await res.json(); if(data.unread_count > 0) { badge.style.display = 'block'; badge.innerText = data.unread_count > 9 ? '9+' : data.unread_count; } else { badge.style.display = 'none'; } } catch(e) { badge.style.display = 'none'; } }
async function loadNotifications() { const email = localStorage.getItem('user_email'); const list = document.getElementById('notiList'); list.innerHTML = 'Loading...'; try { const res = await fetch(`${API_URL}/api/v1/notifications/${email}`); const notis = await res.json(); list.innerHTML = notis.length ? notis.map(n => `<li><div class="dropdown-item p-2 border-bottom" style="background-color: ${n.is_read?'white':'#fffbe3'}"><p class="m-0 small text-dark fw-bold">${n.message}</p><small class="text-muted">${n.created_at.replace('T',' ')}</small></div></li>`).join('') : '<li><p class="text-center m-2">Không có thông báo.</p></li>'; await fetch(`${API_URL}/api/v1/notifications/read/${email}`, { method: 'PUT' }); document.getElementById('notiBadge').style.display = 'none'; } catch(e) { list.innerHTML = 'Lỗi tải.'; } }
let currentReviewService=""; async function openReviewModal(n){currentReviewService=n;document.getElementById('reviewServiceName').innerText=n;new bootstrap.Modal(document.getElementById('reviewModal')).show();loadReviews(n);}
async function loadReviews(n){const l=document.getElementById('reviews-list');l.innerHTML='Loading...';const encodedName = encodeURIComponent(n); try { const r = await fetch(`${API_URL}/api/v1/reviews/${encodedName}`); const d = await r.json(); l.innerHTML = d.length ? d.map(x => `<div class="border-bottom p-2"><strong>${x.user_email}</strong>: ${x.comment} <span class="text-warning">${'⭐'.repeat(x.rating)}</span></div>`).join('') : '<p class="text-muted text-center">Chưa có đánh giá.</p>'; } catch(e) { l.innerHTML = 'Lỗi tải đánh giá.'; } }
async function submitReview(){const r=document.getElementById('reviewRating').value,c=document.getElementById('reviewComment').value,e=localStorage.getItem('user_email');if(!c){alert("Viết gì đó đi!");return;} try { const res = await fetch(`${API_URL}/api/v1/reviews/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_email:e, service_name:currentReviewService, rating:parseInt(r), comment:c})}); if(res.ok){ alert("Đã gửi!"); document.getElementById('reviewComment').value=''; loadReviews(currentReviewService); } else { alert("Lỗi"); } } catch(err) { alert("Lỗi kết nối."); } }
