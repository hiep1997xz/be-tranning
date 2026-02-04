# Todo App - Docker Learning Project

Dự án CRUD đơn giản để học Docker với Node.js/Express backend, React frontend, và PostgreSQL database.

## Kiến trúc

```
┌─────────┐     ┌─────────┐     ┌────────────┐
│ Frontend│────>│ Backend │────>│ PostgreSQL │
│ (React) │     │(Express)│     │            │
└─────────┘     └─────────┘     └────────────┘
   Port 80        Port 3000        Port 5432
```

## Các tính năng

- Thêm công việc mới
- Xem danh sách công việc
- Đánh dấu hoàn thành
- Xóa công việc
- Persist dữ liệu với PostgreSQL

## Học Docker với dự án này

### 1. Multi-stage builds
Backend và Frontend dùng multi-stage builds để optimize image size.

### 2. Docker Compose
Orchestrate 3 services với networking và volumes.

### 3. Health checks
PostgreSQL service có health check để đảm bảo database ready trước khi backend start.

### 4. Non-root user
Backend chạy với non-root user để tăng security.

## Cách chạy

```bash
# Build và start tất cả services
docker-compose up --build

# Stop services
docker-compose down

# Xóa volumes (xóa dữ liệu)
docker-compose down -v
```

## Truy cập

- Frontend: http://localhost
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

## Docker commands hữu ích

```bash
# Xem logs
docker-compose logs -f

# Xem running containers
docker ps

# Exec vào container
docker exec -it todo-backend sh

# Xem resource usage
docker stats
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | /api/todos | Lấy danh sách |
| GET    | /api/todos/:id | Lấy chi tiết |
| POST   | /api/todos | Tạo mới |
| PUT    | /api/todos/:id | Cập nhật |
| DELETE | /api/todos/:id | Xóa |
