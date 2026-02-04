# Phase 1: Chuẩn bị AWS Resources

## Mục tiêu
Tạo và cấu hình AWS RDS PostgreSQL database cho production.

## Bước 1: Tạo AWS RDS PostgreSQL Instance

### 1.1 Đăng nhập AWS Console
- Truy cập https://console.aws.amazon.com/
- Chọn region (khuyến nghị: ap-southeast-1 - Singapore)

### 1.2 Tạo RDS Database
1. Vào Services → RDS → Databases
2. Click "Create database"
3. Cấu hình:

**Engine options:**
- Engine type: PostgreSQL
- Engine version: 16.x (newest)

**Template:**
- Free tier (cho dev/test) hoặc Production

**Settings:**
- DB instance identifier: `todo-app-db`
- Master username: `todo_admin`
- Master password: [Tạo password mạnh, lưu lại]

**Instance configuration:**
- DB instance class: db.t3.micro (free tier) hoặc db.t3.small

**Storage:**
- Allocated storage: 20 GB (free tier: 20 GB)
- Storage autoscaling: Enable (nếu production)

**Availability & durability:**
- Multi-AZ deployment: No (dev) / Yes (production)

**Connectivity:**
- VPC: Default VPC
- Public access: Yes (cho App Runner)
- VPC security group: Tạo mới
- Database port: 5432
- VPC security group name: `todo-rds-sg`

**Database authentication:**
- Password authentication

**Additional configuration:**
- Initial database name: `tododb`
- Backup retention: 7 days

4. Click "Create database"
5. Chờ 5-10 phút để database tạo xong

## Bước 2: Cấu hình Security Group

### 2.1 Cho phép App Runner truy cập
1. Vào RDS → Databases → todo-app-db
2. Tab "Connectivity & security"
3. Click vào VPC security group
4. Add inbound rule:
   - Type: PostgreSQL
   - Protocol: TCP
   - Port: 5432
   - Source: 0.0.0.0/0 (hoặc IP cụ thể)

**Lưu lại:**
- Database endpoint: `[xyz].ap-southeast-1.rds.amazonaws.com`
- Port: 5432
- DB name: `tododb`
- Username: `todo_admin`

## Bước 3: Test Connection

```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client

# Test connection
psql -h [ENDPOINT] -U todo_admin -d tododb -p 5432
```

## Environment Variables cần lưu

```bash
DATABASE_URL=postgresql://todo_admin:[PASSWORD]@[ENDPOINT]:5432/tododb
```

## Success Criteria
- [ ] RDS PostgreSQL instance running
- [ ] Kết nối database thành công
- [ ] Có database endpoint URL
- [ ] Security group đã cấu hình
