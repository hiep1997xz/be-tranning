# Phase 5: Deploy Frontend lên AWS App Runner

## Mục tiêu
Deploy frontend React app lên AWS App Runner.

## Bước 1: Commit và Push frontend code

```bash
cd /home/hiepht/Desktop/Test/BE-tranning

# Add frontend changes
git add frontend/
git commit -m "Add frontend configuration for AWS App Runner deployment"

# Push to GitHub
git push origin main
```

## Bước 2: Tạo App Runner Service cho Frontend

### 2.1 Vào AWS App Runner
1. AWS Console → App Runner
2. Click "Create service"

### 2.2 Source configuration
- **Source repository**: GitHub
- Repository: `todo-app` (cùng repo với backend - monorepo)
- Branch: `main`
- **Deployment settings**: Automatic

### 2.3 Build configuration

**Option A: Use Dockerfile** (Khuyến nghị)
- Build configuration: Build settings
- Runtime: Docker
- Build context: `/frontend`
- Dockerfile path: `Dockerfile` (relative to build context)

**Option B: Use configuration file**
- Build configuration: Configuration file
- Runtime: Docker
- Configuration file path: `frontend/apprunner.yaml`

### 2.4 Service configuration

**Service name:** `todo-frontend`

**Environment variables:**
```bash
# Không cần nếu build với .env.production
# Hoặc:
VITE_API_URL=https://[BACKEND-URL]/api
```

**Networking:**
- Health check path: `/`
- Health check protocol: HTTP

**Security:**
- Instance role: Default

## Bước 3: Deploy Frontend

1. Click "Create and deploy"
2. App Runner sẽ:
   - Clone code
   - Build Docker image
   - Build React app (npm run build)
   - Serve với nginx
   - Cung cấp URL

3. Quá trình mất 3-5 phút

## Bước 4: Configure nginx để gọi Backend

### 4.1 Rebuild với nginx config đã update

Nếu cần update nginx config sau khi đã deploy:

1. Update `frontend/nginx.conf` với backend URL:
```nginx
location /api/ {
    proxy_pass https://[BACKEND-URL];
    # ... config
}
```

2. Commit và push:
```bash
git add frontend/nginx.conf
git commit -m "Update nginx config for backend proxy"
git push origin main
```

3. App Runner sẽ tự động redeploy

### 4.2 Hoặc cấu hình CORS và gọi trực tiếp

Backend CORS config:
```typescript
const allowedOrigins = [
  'https://[FRONTEND-URL].ap-southeast-1.awsapprunner.com'
];
```

## Bước 5: Verify Deployment

### 5.1 Kiểm tra frontend
```bash
# Mở browser
https://[FRONTEND-SERVICE-ID].ap-southeast-1.awsapprunner.com

# Hoặc test với curl
curl https://[FRONTEND-SERVICE-ID].ap-southeast-1.awsapprunner.com
```

### 5.2 Test API calls từ frontend
1. Mở DevTools → Network tab
2. Thêm một todo item
3. Kiểm tra request đến `/api/todos`
4. Verify response data

### 5.3 Check logs
1. App Runner → todo-frontend
2. Tab "Logs"
3. Xem nginx access logs và error logs

## Troubleshooting

### Issue: Frontend không load được API
**Solutions:**
- Check nginx proxy_pass URL đúng backend
- Hoặc check CORS ở backend allow frontend domain
- Check browser console có CORS errors không

### Issue: 404 errors
**Solutions:**
- Check nginx `try_files` config
- Verify React router setup

### Issue: Static assets 404
**Solutions:**
- Check nginx root path: `/usr/share/nginx/html`
- Verify build output copied đúng

## Bước 6: Test Full Application

### Checklist
- [ ] Frontend loads successfully
- [ ] API calls work (CRUD todos)
- [ ] Images/static assets load
- [ ] No CORS errors in console
- [ ] No 404 errors
- [ ] Responsive design works

## Success Criteria
- [ ] App Runner service running
- [ ] Frontend accessible via HTTPS URL
- [ ] API calls work properly
- [ ] Todos can be created/updated/deleted
- [ ] No console errors

## URLs đã lưu
```
Backend: https://[BACKEND-ID].ap-southeast-1.awsapprunner.com
Frontend: https://[FRONTEND-ID].ap-southeast-1.awsapprunner.com
```

## Next Steps
- Phase 6: Configure custom domain
- Phase 7: Setup CI/CD pipeline
