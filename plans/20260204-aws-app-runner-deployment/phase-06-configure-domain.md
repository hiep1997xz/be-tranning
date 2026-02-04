# Phase 6: Cấu hình Domain Tùy Chọn

## Mục tiêu
Cấu hình custom domain cho backend và frontend trên AWS App Runner.

## Bước 1: Mua Domain (nếu chưa có)

### Option A: Mua từ AWS Route 53
1. AWS Console → Route 53 → Registered domains
2. Click "Register domain"
3. Tìm domain name: `todoapp.example.com`
4. Add to cart → Complete purchase
5. Cost: ~$10-15/năm

### Option B: Dùng domain có sẵn
1. Go to domain provider (Namecheap, GoDaddy, etc.)
2. Manage DNS settings

## Bước 2: Tạo Public Hosted Zone

### 2.1 Tạo Hosted Zone trong Route 53
1. AWS Console → Route 53 → Hosted zones
2. Click "Create hosted zone"
3. Domain name: `todoapp.example.com`
4. Type: Public hosted zone
5. Click "Create hosted zone"

### 2.2 Get NS Records
Route 53 sẽ tạo 4 NS records như:
```
ns-123.awsdns-12.com
ns-456.awsdns-34.net
ns-789.awsdns-56.org
ns-012.awsdns-78.co.uk
```

### 2.3 Update Nameservers tại Domain Provider
1. Go to domain provider (Namecheap, GoDaddy, etc.)
2. Find DNS/Nameservers settings
3. Replace với 4 NS records từ Route 53
4. Save changes
5. Wait 24-48 hours để propagate

## Bước 3: Tạo Custom Domain trong App Runner

### 3.1 Backend Custom Domain
1. App Runner → todo-backend service
2. Tab "Custom domains"
3. Click "Add domain"
4. Choose: "Associate an existing custom domain" hoặc "Create a new one"
5. Domain: `api.todoapp.example.com`
6. Click "Next"

### 3.2 Frontend Custom Domain
1. App Runner → todo-frontend service
2. Tab "Custom domains"
3. Click "Add domain"
4. Domain: `todoapp.example.com` hoặc `www.todoapp.example.com`
5. Click "Next"

## Bước 4: Tạo DNS Records trong Route 53

### 4.1 Backend DNS Record
Trong hosted zone `todoapp.example.com`:

1. Click "Create record"
2. Name: `api`
3. Type: `A - Alias to App Runner service`
4. Alias to: todo-backend service
5. Click "Create record"

### 4.2 Frontend DNS Record
1. Click "Create record"
2. Name: `www` (hoặc root domain)
3. Type: `A - Alias to App Runner service`
4. Alias to: todo-frontend service
5. Click "Create record"

## Bước 5: Verify Domain

### 5.1 Check DNS Propagation
```bash
# Check backend
dig api.todoapp.example.com

# Check frontend
dig www.todoapp.example.com
```

### 5.2 Test HTTPS Certificate
App Runner tự động tạo SSL certificate với AWS Certificate Manager (ACM)

1. App Runner service → Custom domains
2. Wait until status: "Certificate available"
3. This takes 5-30 minutes

### 5.3 Test Applications
```bash
# Backend
curl https://api.todoapp.example.com/health

# Frontend
curl https://www.todoapp.example.com

# Or open in browser
```

## Bước 6: Update Environment Variables

### Backend CORS
Update backend environment variables trong App Runner:

```bash
FRONTEND_URL=https://www.todoapp.example.com
```

Redeploy service để apply changes.

### Frontend API URL
Update frontend nginx config hoặc rebuild:

```nginx
location /api/ {
    proxy_pass https://api.todoapp.example.com;
    # ...
}
```

Or rebuild with:
```bash
VITE_API_URL=https://api.todoapp.example.com/api
```

## Bước 7: Optional - Root Domain Redirect

Redirect root domain đến www:

### 7.1 Create S3 Bucket
1. S3 → Create bucket
2. Name: `todoapp.example.com`
3. Region: Same as App Runner
4. Uncheck "Block all public access"
5. Create

### 7.2 Configure Static Website
1. Bucket → Properties → Static website hosting
2. Enable hosting
3. Redirect requests: `https://www.todoapp.example.com`
4. Save

### 7.3 Add Route 53 Record
1. Hosted zone → Create record
2. Name: (blank) - root domain
3. Type: `A - Alias to S3`
4. Alias to: todoapp.example.com bucket
5. Create

## Success Criteria
- [ ] Domain accessible from internet
- [ ] HTTPS works with valid certificate
- [ ] Backend API accessible via custom domain
- [ ] Frontend accessible via custom domain
- [ ] CORS configured correctly
- [ ] All features work with new domains

## Final URLs
```
Frontend: https://www.todoapp.example.com
Backend API: https://api.todoapp.example.com
API Docs: https://api.todoapp.example.com/api/todos
```

## Troubleshooting

### Issue: Domain not resolving
**Solution:**
- Check NS records at domain provider
- Wait for DNS propagation (up to 48h)
- Use dig/nslookup to check DNS

### Issue: Certificate pending
**Solution:**
- Wait 30-60 minutes
- Check DNS validation record exists in Route 53

### Issue: CORS errors
**Solution:**
- Update FRONTEND_URL in backend
- Ensure backend CORS allows new domain
- Redeploy backend service

### Issue: Mixed content warnings
**Solution:**
- Ensure all requests use HTTPS
- Update nginx proxy_pass to use HTTPS
