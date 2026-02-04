# Phase 2: Cấu hình Backend cho App Runner

## Mục tiêu
Chuẩn bị backend code để deploy lên AWS App Runner.

## Cấu trúc Backend hiện tại
```
backend/
├── src/
│   └── index.ts (Express server)
├── prisma/
│   └── schema.prisma
├── Dockerfile (✓ đã có)
├── docker-entrypoint.sh (✓ đã có)
└── package.json
```

## Bước 1: Tạo App Runner configuration file

Tạo file `backend/apprunner.yaml`:

```yaml
version: 1.0
runtime: nodejs20
build:
  commands:
    build:
      - npm ci
      - npx prisma generate
      - npx prisma migrate deploy
      - npm run build
  env:
    - name: NODE_ENV
      value: production
run:
  command: npm start
  network: port:3000
  env:
    - name: PORT
      value: 3000
```

## Bước 2: Cấu hình Health Check

Backend đã có health check endpoint ✓
```typescript
// src/index.ts
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

## Bước 3: Cấu hình CORS cho Production

Update `backend/src/index.ts`:

```typescript
// Sửa dòng này
app.use(cors());

// Thành
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://todo-app-frontend.ap-southeast-1.awsapprunner.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

## Bước 4: Tạo .env.production.example

```bash
# Database
DATABASE_URL=postgresql://todo_admin:password@db-endpoint:5432/tododb

# Server
NODE_ENV=production
PORT=3000

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

## Bước 5: Tạo Dockerfile cho App Runner (nếu cần)

Dockerfile hiện tại đã tương thích với App Runner ✓

## Bước 6: Update Prisma schema cho production

`backend/prisma/schema.prisma` - Không cần thay đổi

## Success Criteria
- [ ] App Runner configuration file tạo xong
- [ ] CORS cấu hình cho production domain
- [ ] Health check endpoint hoạt động
- [ ] Dockerfile compatible với App Runner
- [ ] Environment variables document sẵn sàng
