# Hướng Dẫn Đẩy Code Lên Server (PuTTY)

## Part 1: Chuẩn Bị Trên Local Machine

### 1. Kiểm tra trạng thái Git
```bash
cd c:\Users\hoang\Downloads\farm-v2-main\farm-v2-main
git status
```

### 2. Commit các thay đổi
```bash
git add .
git commit -m "Update: Hide upload certificate section, add color palette for task icons"
```

### 3. Push lên GitHub
```bash
git push origin main
```

---

## Part 2: Kết Nối Với Server Qua PuTTY

### 1. Kiểm tra SSH Connection
```bash
# Mở PuTTY hoặc Terminal SSH
# Kết nối với server
ssh user@your_server_ip
```

**Thông tin khác nhau theo server:**
- Nhập tên user
- Nhập mật khẩu

### 2. Điều Hướng Đến Thư Mục Project
```bash
cd /path/to/farm-v2-app
# Ví dụ: cd /home/ubuntu/farm-v2-app
# hoặc: cd /var/www/farm-v2-app
```

---

## Part 3: Pull Code Từ GitHub

### 1. Pull Code Mới Nhất
```bash
git pull origin main
```

### 2. Kiểm Tra Branch Hiện Tại
```bash
git branch -v
# Kết quả nên hiển thị: * main (kiểm tra commit mới nhất)
```

### 3. Xác Nhận Thay Đổi
```bash
git log --oneline -5
# Kiểm tra 5 commit gần nhất xem có commit mới không
```

---

## Part 4: Build Frontend (React/Vite)

### 1. Cài Đặt Dependencies (Nếu lần đầu)
```bash
npm install
```

### 2. Build Production
```bash
npm run build
```

### 3. Kiểm Tra Output
```bash
ls -la dist/
# Phải thấy: index.html, assets/
```

---

## Part 5: Khởi Động Backend (Django)

### 1. Điều Hướng Thư Mục Backend
```bash
cd farm_management
```

### 2. Kích Hoạt Virtual Environment
```bash
# Linux/Mac
source venv/bin/activate

# Windows CMD (nếu SSH vào Windows)
venv\Scripts\activate
```

### 3. Cài Dependencies Django
```bash
pip install -r requirements.txt
```

### 4. Chạy Migrations
```bash
python manage.py migrate
```

### 5. Collect Static Files (Nếu Production)
```bash
python manage.py collectstatic --noinput
```

### 6. Khởi Động Django
```bash
# Development
python manage.py runserver 0.0.0.0:8000

# Production (dùng gunicorn)
gunicorn farm_management.wsgi:application --bind 0.0.0.0:8000
```

---

## Part 6: Kiểm Tra Dữ Liệu

### A. Database - Kiểm Tra Task Icons
```bash
python manage.py shell
```

Trong shell:
```python
from api.models import TaskIcon
print(f"Total icons: {TaskIcon.objects.count()}")
for icon in TaskIcon.objects.all():
    print(f"  ✓ {icon.name} ({icon.icon_name}) - {len(icon.color_variants)} colors")
```

### B. Database - Kiểm Tra Task Categories
```python
from api.models import TaskCategory
print(f"Total categories: {TaskCategory.objects.count()}")
for cat in TaskCategory.objects.all():
    print(f"  ✓ {cat.name}")
```

### C. Database - Kiểm Tra Task Configs
```python
from api.models import Task
print(f"Total tasks: {Task.objects.count()}")
for task in Task.objects.all():
    print(f"  ✓ {task.name} ({task.icon}) - Materials: {task.requires_materials}")
```

### D. Kiểm Tra API Endpoints
```bash
# Từ Local hoặc Server Terminal
curl http://localhost:8000/task-icons/
# Phải return JSON với danh sách icons
```

---

## Part 7: Restart Services (Nếu Production)

### 1. Restart Nginx (Nếu dùng)
```bash
sudo systemctl restart nginx
```

### 2. Restart Supervisord (Nếu dùng)
```bash
sudo systemctl restart supervisor
```

### 3. Restart Docker (Nếu chạy trong Container)
```bash
docker-compose restart
```

---

## Part 8: Kiểm Tra Cuối Cùng

### Từ Local Machine:

1. **Frontend**: Reload browser → Phải thấy icon selector với 42 màu
2. **Backend API**: 
   ```bash
   curl https://your_server/api/task-icons/
   # Phải thấy danh sách 13 icons
   ```

3. **Data Integrity**:
   - ✅ 13 Task Icons trong database
   - ✅ Task Categories tồn tại
   - ✅ Task Configs lưu trữ icon_name
   - ✅ Color palettes hiển thị correctjson

---

## Part 9: Troubleshooting

### A. "git pull origin main" bị lỗi
```bash
# Kiểm tra status
git status

# Reset nếu có conflict
git reset --hard HEAD
git pull origin main
```

### B. "npm run build" lỗi
```bash
# Clean cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### C. "python manage.py migrate" lỗi
```bash
# Kiểm tra migration status
python manage.py showmigrations api

# Delete database nếu cần reset
rm db.sqlite3
python manage.py migrate
python manage.py seed_icons.py
```

### D. API return 500 error
```bash
# Kiểm tra logs
tail -100 /var/log/nginx/error.log  # Nginx
tail -100 /var/log/gunicorn/error.log  # Gunicorn (nếu dùng)

# Restart backend
sudo systemctl restart gunicorn
```

---

## Quick Deploy Script

Tạo file `deploy.sh` trên server:

```bash
#!/bin/bash

# Navigate to project
cd /path/to/farm-v2-app

# Pull latest code
git pull origin main

# Frontend
npm install
npm run build

# Backend
cd farm_management
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Restart services
sudo systemctl restart nginx
sudo systemctl restart gunicorn

echo "✅ Deployment successful!"
```

Chạy:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Checklist Cuối Cùng

- [ ] Code pushed to GitHub (main branch)
- [ ] SSH kết nối vào server
- [ ] `git pull origin main` thành công
- [ ] `npm run build` hoàn tất không lỗi
- [ ] Django migrations chạy thành công
- [ ] 13 Task Icons trong database
- [ ] Frontend hiển thị 42 màu
- [ ] API `/task-icons/` return đúng dữ liệu
- [ ] Tất cả services running

---

## Liên Hệ Admin Khi Cần

- **SSH issues**: Check server credentials
- **Database errors**: Verify Django settings
- **Build failed**: Check Node.js version (need 16+)
- **Port conflicts**: Verify ports 3000/8000 not in use
