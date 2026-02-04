# Docker Guide - Todo App

## Cấu trúc Docker Compose files

| File | Mục đích |
|------|----------|
| `docker-compose.yml` | Chính - Production ready |
| `docker-compose.dev.yml` | Development - chỉ chạy DB |
| `docker-compose.prod.yml` | Production với nginx reverse proxy |

## Workflow học Docker

### Bước 1: Hiểu Dockerfile

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# Install dependencies & build TypeScript

# Stage 2: Production
FROM node:20-alpine AS production
# Copy build artifacts only
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
# Build React app with Vite
# Serve with nginx
```

### Bước 2: Health Checks

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U todo"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Backend chỉ start khi DB healthy:

```yaml
depends_on:
  postgres:
    condition: service_healthy
```

### Bước 3: Volumes

Persist dữ liệu PostgreSQL:

```yaml
volumes:
  postgres_data:
    name: todo_postgres_data
```

### Bước 4: Networks

```yaml
networks:
  todo-network:
    name: todo_network
    driver: bridge
```

Services trong cùng network có thể giao tiếp qua tên service.

## Commands thường dùng

```bash
# Build và start
docker-compose up --build -d

# Xem logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Exec vào container
docker exec -it todo-backend sh
docker exec -it todo-postgres psql -U todo -d tododb

# Rebuild một service
docker-compose up -d --build backend

# Scale (nếu cần nhiều instances)
docker-compose up -d --scale backend=3

# Cleanup
docker-compose down -v    # Xóa cả volumes
docker-compose rm -f      # Xóa containers
docker system prune -a    # Xóa tất cả unused resources
```

## Debugging Docker

```bash
# Xem resource usage
docker stats

# Inspect container
docker inspect todo-backend

# Xem logs của container
docker logs todo-backend --tail 100 -f

# Copy file từ container
docker cp todo-backend:/app/package.json ./

# Copy file vào container
docker cp ./local-file.txt todo-backend:/app/
```

## Best Practices học được

1. **Multi-stage builds** - Giảm image size
2. **Non-root user** - Tăng security
3. **Health checks** - Đảm bảo services ready
4. **Named volumes** - Persist data dễ dàng
5. **Custom networks** - Isolation giữa services
6. **Environment variables** - Config flexibly
7. **.dockerignore** - Tăng build speed
