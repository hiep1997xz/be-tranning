# Phase 4: Cấu hình Frontend cho App Runner

## Mục tiêu
Chuẩn bị frontend React để deploy lên AWS App Runner.

## Cấu trúc Frontend hiện tại
```
frontend/
├── src/
│   ├── api/todo.ts (API calls)
│   ├── components/
│   └── pages/
├── Dockerfile (✓ đã có)
├── nginx.conf (✓ đã có)
└── package.json
```

## Bước 1: Cấu hình API URL cho Production

### 1.1 Tạo .env.production cho build

Tạo `frontend/.env.production`:

```bash
# API URL cho production (sau khi backend deploy xong)
VITE_API_URL=https://[BACKEND-URL]/api
```

Hoặc dùng .env.default:
```bash
VITE_API_URL=/api
```

### 1.2 Update API client để support proxy

`frontend/src/api/todo.ts` - Không cần thay đổi nếu dùng nginx proxy

## Bước 2: Cấu hình Nginx cho Production

Update `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy sang backend (nếu deploy cùng domain)
    location /api/ {
        proxy_pass https://[BACKEND-URL];
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_ssl_server_name on;

        # CORS headers (nếu cần)
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Bước 3: Tạo App Runner configuration

Tạo `frontend/apprunner.yaml`:

```yaml
version: 1.0
runtime: docker
build:
  commands:
    build:
      - npm ci
      - npm run build
```

Hoặc dùng Dockerfile (đã có sẵn):

`frontend/Dockerfile` - Không cần thay đổi ✓

## Bước 4: Tạo health check endpoint (optional)

React app không cần health check riêng, nginx sẽ handle.

## Bước 5: Optimize build size

### 5.1 Check package.json scripts
```json
{
  "scripts": {
    "build": "tsc && vite build"
  }
}
```

### 5.2 Optimize Vite config (nếu cần)

Tạo `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'axios': ['axios']
        }
      }
    }
  }
});
```

## Bước 6: Cấu hình .dockerignore (nếu chưa có)

`frontend/.dockerignore`:
```
node_modules
npm-debug.log
.env.local
.env.development
dist
.git
```

## Success Criteria
- [ ] API URL configured cho production
- [ ] Nginx config có API proxy
- [ ] Dockerfile optimized
- [ ] Build configuration sẵn sàng
- [ ] Environment variables documented

## Lưu ý quan trọng
- Frontend sẽ gọi backend qua `/api` path (nginx proxy)
- Hoặc trực tiếp gọi backend URL
- CORS cần được enable ở backend cho frontend domain
