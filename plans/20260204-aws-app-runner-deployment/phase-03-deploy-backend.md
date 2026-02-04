# Phase 3: Deploy Backend lên AWS App Runner

## Mục tiêu
Deploy backend service lên AWS App Runner.

## Bước 1: Push code lên GitHub

### 1.1 Tạo repository trên GitHub
1. Vào GitHub → New repository
2. Name: `todo-app-backend` (hoặc dùng monorepo)
3. Description: Todo App Backend API
4. Public/Private (tùy chọn)

### 1.2 Push backend code

```bash
# Đảm bảo đã có .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
EOF

# Init git (nếu chưa có)
cd /home/hiepht/Desktop/Test/BE-tranning
git init
git add .
git commit -m "Initial commit: Add Todo App backend"

# Push to GitHub
git remote add origin https://github.com/USERNAME/todo-app.git
git branch -M main
git push -u origin main
```

## Bước 2: Tạo App Runner Service cho Backend

### 2.1 Vào AWS App Runner
1. AWS Console → App Runner
2. Click "Create service"

### 2.2 Source configuration
- **Source repository**: GitHub
- Connect GitHub account (first time)
- Repository: `todo-app` (chọn repo vừa push)
- Branch: `main`
- **Deployment settings**: Automatic

### 2.3 Build configuration
**Option A: Use configuration file** (Khuyến nghị)
- Build configuration: Configuration file
- Configuration file path: `backend/apprunner.yaml` (hoặc root path nếu monorepo)

**Option B: Manual**
- Build configuration: Build settings
- Runtime: Node.js 20
- Build command:
  ```bash
  cd backend && npm ci && npx prisma generate && npm run build
  ```
- Start command:
  ```bash
  cd backend && npx prisma migrate deploy && npm start
  ```

### 2.4 Service configuration
**Service name:** `todo-backend`

**Environment variables:**
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://todo_admin:[PASSWORD]@[ENDPOINT]:5432/tododb
FRONTEND_URL=https://todo-app-frontend.ap-southeast-1.awsapprunner.com
```

**Networking:**
- Health check path: `/health`
- Health check interval: 10 seconds

**Security:**
- Instance role: Default (hoặc tạo role mới)

## Bước 3: Deploy

1. Click "Create and deploy"
2. App Runner sẽ:
   - Clone code từ GitHub
   - Build Docker image
   - Deploy service
   - Cung cấp URL

3. Quá trình mất 5-10 phút

## Bước 4: Verify Deployment

### 4.1 Kiểm tra logs
1. Vào App Runner → todo-backend
2. Tab "Logs"
3. Kiểm tra:
   - Build successful
   - Prisma migrations chạy thành công
   - Server start trên port 3000

### 4.2 Test API
```bash
# Test health endpoint
curl https://[SERVICE-ID].ap-southeast-1.awsapprunner.com/health

# Test todos API
curl https://[SERVICE-ID].ap-southeast-1.awsapprunner.com/api/todos
```

### 4.3 Test với Postman/Thunder Client
- GET: `https://[URL]/api/todos`
- POST: `https://[URL]/api/todos` (body: `{"title": "Test from App Runner"}`)

## Troubleshooting

### Issue: Database connection failed
**Solution:**
- Check DATABASE_URL đúng
- Check RDS security group cho phép App Runner IP

### Issue: Prisma migrations fail
**Solution:**
- Add command `npx prisma migrate deploy` vào start command
- Check DATABASE_URL có đúng database name

### Issue: Build fail
**Solution:**
- Check logs tab để xem error
- Ensure package.json có tất cả dependencies
- Ensure tsconfig.json path đúng

## Success Criteria
- [ ] App Runner service running
- [ ] Health check trả về 200 OK
- [ ] API endpoints hoạt động
- [ ] Database connection thành công
- [ ] Logs không có errors

## Lưu lại thông tin
```
Backend URL: https://[SERVICE-ID].ap-southeast-1.awsapprunner.com
Service ARN: arn:aws:apprunner:...
```
