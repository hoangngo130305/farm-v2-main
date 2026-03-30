# Farm Management API - Django Backend

API backend dành cho ứng dụng quản lý nông trại, được xây dựng với Django REST Framework và MariaDB.

## Cài đặt

### 1. Clone và thiết lập môi trường

```bash
cd farm_management
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

### 3. Cấu hình Database

Cập nhật trong `farm_management/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'farm_management',
        'USER': 'root',
        'PASSWORD': 'your_password',  # Đổi mật khẩu của bạn
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

### 4. Chạy migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Tạo superuser (cho Django Admin)

```bash
python manage.py createsuperuser
```

### 6. Load dữ liệu từ schema.sql (nếu cần)

```bash
# Chạy SQL schema từ file schema.sql
mysql -u root -p farm_management < ../schema.sql
```

### 7. Chạy server

```bash
python manage.py runserver
```

Server sẽ chạy tại: `http://localhost:8000`

## API Endpoints

### Admins (Quản lý)

- `POST /api/admins/login/` - Đăng nhập admin
- `POST /api/admins/register/` - Đăng ký admin
- `GET /api/admins/` - Danh sách admins
- `GET /api/admins/{id}/` - Chi tiết admin
- `PUT /api/admins/{id}/` - Cập nhật admin
- `DELETE /api/admins/{id}/` - Xóa admin

### Farmers (Nông dân)

- `POST /api/farmers/login/` - Đăng nhập nông dân
- `POST /api/farmers/register/` - Đăng ký nông dân
- `GET /api/farmers/` - Danh sách nông dân
- `GET /api/farmers/{id}/` - Chi tiết nông dân
- `PUT /api/farmers/{id}/` - Cập nhật nông dân

### Farm Logs (Nhật ký hoạt động)

- `GET /api/farm-logs/` - Danh sách nhật ký
- `POST /api/farm-logs/` - Tạo nhật ký mới
- `GET /api/farm-logs/{id}/` - Chi tiết nhật ký
- `PUT /api/farm-logs/{id}/` - Cập nhật nhật ký
- `DELETE /api/farm-logs/{id}/` - Xóa nhật ký
- `GET /api/farm-logs/by_farmer/?farmer_id=1` - Lấy nhật ký của nông dân
- `GET /api/farm-logs/by_lot/?lot_id=1` - Lấy nhật ký của lô
- `GET /api/farm-logs/by_stage/?stage_id=1` - Lấy nhật ký của giai đoạn

### Incident Reports (Báo cáo sự cố)

- `GET /api/incident-reports/` - Danh sách báo cáo
- `POST /api/incident-reports/` - Tạo báo cáo mới
- `GET /api/incident-reports/{id}/` - Chi tiết báo cáo
- `PUT /api/incident-reports/{id}/` - Cập nhật báo cáo
- `DELETE /api/incident-reports/{id}/` - Xóa báo cáo
- `GET /api/incident-reports/by_farmer/?farmer_id=1` - Lấy báo cáo của nông dân
- `GET /api/incident-reports/by_lot/?lot_id=1` - Lấy báo cáo của lô
- `GET /api/incident-reports/unresolved/` - Lấy báo cáo chưa xử lý

### Stages (Giai đoạn)

- `GET /api/stages/` - Danh sách giai đoạn
- `POST /api/stages/` - Tạo giai đoạn mới
- `GET /api/stages/{id}/` - Chi tiết giai đoạn

### Lots (Lô đất)

- `GET /api/lots/` - Danh sách lô đất
- `POST /api/lots/` - Tạo lô mới
- `GET /api/lots/{id}/` - Chi tiết lô

### Planting Zones (Khu vực trồng)

- `GET /api/planting-zones/` - Danh sách khu vực
- `POST /api/planting-zones/` - Tạo khu vực mới
- `GET /api/planting-zones/{id}/` - Chi tiết khu vực

### Tasks (Hoạt động)

- `GET /api/tasks/` - Danh sách hoạt động
- `POST /api/tasks/` - Tạo hoạt động mới
- `GET /api/tasks/?requires_materials=true` - Lọc hoạt động

### Task Categories (Nhóm hoạt động)

- `GET /api/task-categories/` - Danh sách nhóm
- `POST /api/task-categories/` - Tạo nhóm mới

### Materials (Vật tư)

- `GET /api/materials/` - Danh sách vật tư
- `POST /api/materials/` - Tạo vật tư mới
- `GET /api/materials/?type=Phân%20bón` - Lọc vật tư
- `GET /api/materials/low_stock/` - Vật tư tồn kho thấp

## Ví dụ Request/Response

### 1. Login Admin

```bash
POST /api/admins/login/
Content-Type: application/json

{
  "phone": "0999999999",
  "pin": "0000"
}

Response:
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Quản trị viên",
    "phone": "0999999999",
    "google_email": null,
    "created_at": "2026-03-27T10:00:00Z"
  }
}
```

### 2. Login Farmer

```bash
POST /api/farmers/login/
Content-Type: application/json

{
  "phone": "0987654321",
  "pin": "1234"
}

Response:
{
  "status": "success",
  "data": {
    "id": 1,
    "full_name": "Nguyễn Văn A",
    "phone": "0987654321",
    "cccd": "001090123456",
    "managed_lot": "Lô 1",
    "created_at": "2026-03-27T10:00:00Z"
  }
}
```

### 3. Tạo nhật ký mới

```bash
POST /api/farm-logs/
Content-Type: application/json

{
  "farmer": 1,
  "stage": 1,
  "lot": 1,
  "datetime": "2026-03-27T14:30:00",
  "task": 1,
  "pest": "Rêu",
  "method": "Champion",
  "active_ingredient": "Copper Hydroxide",
  "dosage": "2kg / 1000 lít nước",
  "quarantine_time": "7 Ngày",
  "images": ["https://example.com/image1.jpg"]
}

Response:
{
  "id": 1,
  "farmer": 1,
  "farmer_name": "Nguyễn Văn A",
  "task": 1,
  "task_name": "Rửa vườn",
  "lot": 1,
  "lot_name": "Lô 1",
  "datetime": "2026-03-27T14:30:00Z",
  "pest": "Rêu",
  "method": "Champion",
  "created_at": "2026-03-27T14:31:00Z"
}
```

### 4. Tạo báo cáo sự cố

```bash
POST /api/incident-reports/
Content-Type: application/json

{
  "farmer": 1,
  "lot": 1,
  "datetime": "2026-03-27T15:00:00",
  "report_type": "Sâu bệnh",
  "description": "Phát hiện rệp sáp trên lá non",
  "images": ["https://example.com/image1.jpg"]
}

Response:
{
  "id": 1,
  "farmer": 1,
  "farmer_name": "Nguyễn Văn A",
  "lot": 1,
  "lot_name": "Lô 1",
  "datetime": "2026-03-27T15:00:00Z",
  "report_type": "Sâu bệnh",
  "description": "Phát hiện rệp sáp trên lá non",
  "created_at": "2026-03-27T15:01:00Z"
}
```

## Google OAuth Integration

### Admin/Farmer Login với Google ID

```bash
POST /api/admins/login/
{
  "google_id": "google_user_id_12345"
}

POST /api/farmers/login/
{
  "google_id": "google_user_id_12345"
}
```

## Filtering & Search

### Lọc theo điều kiện

```bash
GET /api/farm-logs/?farmer=1&stage=1&lot=1
GET /api/materials/?type=Phân%20bón&is_vietgap=true
GET /api/farmers/?managed_lot=Lô%201
```

### Search

```bash
GET /api/farm-logs/?search=Nguyễn
GET /api/materials/?search=Champion
GET /api/farmers/?search=Văn
```

### Pagination

```bash
GET /api/farm-logs/?page=2&page_size=20
```

## Admin Panel

Django admin panel có sẵn tại: `http://localhost:8000/admin/`

Đăng nhập bằng superuser account được tạo ở bước 5.

Admin panel cho phép quản lý:

- Admins: Tạo, sửa, xóa quản lý
- Farmers: Quản lý nông dân
- Farm Logs: Xem, sửa, xóa nhật ký
- Incident Reports: Quản lý báo cáo sự cố
- Tasks, Materials, Stages, Lots: Quản lý dữ liệu cơ bản

## Database Schema

Xem [schema.sql](../schema.sql) để hiểu cấu trúc database.

## Cấu trúc Project

```
farm_management/
├── manage.py
├── requirements.txt
├── api/
│   ├── models.py          # Django Models
│   ├── views.py           # ViewSets & Views
│   ├── serializers.py     # DRF Serializers
│   ├── admin.py           # Django Admin
│   ├── urls.py            # API URLs
│   └── migrations/
├── farm_management/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── schema.sql
```

## Frontend Integration

Để kết nối frontend React:

```javascript
const API_BASE = "http://localhost:8000/api";

// Login
const login = async (phone, pin) => {
  const response = await fetch(`${API_BASE}/farmers/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, pin }),
  });
  return response.json();
};

// Get Farm Logs
const getFarmLogs = async () => {
  const response = await fetch(`${API_BASE}/farm-logs/`);
  return response.json();
};
```

## Notes

- Tất cả timestamps ở dạng UTC
- Sử dụng Vietnamese locale và timezone
- CORS được bật cho tất cả origins (chỉ dùng cho development)
- Để production: Cập nhật CORS_ALLOWED_ORIGINS trong settings.py
