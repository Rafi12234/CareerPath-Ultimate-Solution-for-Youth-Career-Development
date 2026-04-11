# Complete Deployment Guide
## Database (Azure) + Frontend (Vercel) + Backend (Render)

---

## 📋 Table of Contents
1. [Database Deployment - Azure MySQL](#database-azure)
2. [Frontend Deployment - Vercel](#frontend-vercel)
3. [Backend Deployment - Render](#backend-render)
4. [Connection Configuration](#configuration)
5. [Testing & Monitoring](#testing)

---

## <a name="database-azure"></a>🗄️ Part 1: Deploy Database to Azure MySQL

### Prerequisites
- Azure Account (create at https://azure.microsoft.com/free)
- Azure CLI installed
- MySQL client tools

### Step 1: Create Azure MySQL Server

**Via Azure Portal:**
1. Log in to https://portal.azure.com
2. Click **Create a resource**
3. Search for **Azure Database for MySQL**
4. Click **Create**

**Fill in the form:**
```
Resource Group: Create new → "careerpath-rg"
Server Name: "careerpath-db-server" (must be globally unique)
Location: Choose closest to your users (e.g., East US, Southeast Asia)
Version: MySQL 8.0
Admin Username: "adminuser"
Admin Password: Create strong password (save this!)
  - Minimum 8 characters
  - Include uppercase, lowercase, numbers, special chars
```

### Step 2: Configure Server Parameters

1. After creation, go to **Server parameters**
2. Set these for Laravel compatibility:
   ```
   character_set_server = utf8mb4
   collation_server = utf8mb4_unicode_ci
   time_zone = '+00:00'
   ```
3. Click **Save**

### Step 3: Configure Firewall & Connection Security

1. Go to **Connection security**
2. Enable **Allow access to Azure services**: **ON**
3. Add your IP address:
   - Click **Add current client IP**
   - Your machine's IP will be added
4. Go to **SSL/TLS settings**
   - Minimum TLS version: **TLS 1.2**
   - **Enforce SSL connection**: **ON**

### Step 4: Create Database

**Option A: Using Azure Portal**
1. Go to **Databases**
2. Click **Create database**
3. Name: `careerpath`
4. Charset: `utf8mb4`
5. Collation: `utf8mb4_unicode_ci`

**Option B: Using MySQL CLI**
```bash
# Connect to Azure MySQL
mysql -h careerpath-db-server.mysql.database.azure.com -u adminuser@careerpath-db-server -p

# Create database
CREATE DATABASE careerpath CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'careerpath_user'@'%' IDENTIFIED BY 'Strong$Password123';
GRANT ALL PRIVILEGES ON careerpath.* TO 'careerpath_user'@'%';
FLUSH PRIVILEGES;
```

### Step 5: Get Connection Details

Go to **Connection strings**:
```
MYSQL_HOST: careerpath-db-server.mysql.database.azure.com
MYSQL_PORT: 3306
MYSQL_DATABASE: careerpath
MYSQL_USER: careerpath_user@careerpath-db-server
MYSQL_PASSWORD: Your_Strong_Password_123
```

**Save these - you'll need them for backend!**

---

## <a name="frontend-vercel"></a>🚀 Part 2: Deploy Frontend to Vercel

### Prerequisites
- Vercel Account (https://vercel.com/signup)
- GitHub Account with your repository
- Node.js 20+

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Search for `CareerPath-Ultimate-Solution-for-Youth-Career-Development`
5. Click **Import**

### Step 2: Configure Project

**Framework Preset:** Select **Vite**

**Build Settings:**
```
Framework: Vite
Root Directory: ./client
Build Command: npm run build
Output Directory: dist
Development Command: npm run dev
```

### Step 3: Environment Variables

Click **Environment Variables** and add:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

(You'll get the Render backend URL after deploying backend)

### Step 4: Configure Vercel Settings

**Advanced:**
- Node.js Version: **20.x**
- Install Command: `npm ci`

### Step 5: Deploy

Click **Deploy** - Vercel will:
1. Clone your repository
2. Install dependencies
3. Build the React app
4. Deploy to CDN

**Your frontend will be live at:**
```
https://careerpath-[random].vercel.app
```

### Step 6: Connect Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `app.careerpath.com`)
3. Update DNS records as Vercel instructs
4. SSL certificate auto-configured

---

## <a name="backend-render"></a>⚙️ Part 3: Deploy Backend to Render

### Prerequisites
- Render Account (https://dashboard.render.com/register)
- GitHub repository access
- Docker image or direct code deploy

### Step 1: Create MySQL Web Service

**IMPORTANT: Deploy database FIRST before backend!**

1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Select **Deploy from a Git repository**
4. Search for `CareerPath-Ultimate-Solution-for-Youth-Career-Development`
5. Click **Connect**

### Step 2: Configure Web Service

**Basic Settings:**
```
Name: careerpath-backend
Environment: Docker
Region: Oregon (or closest to your users)
Branch: main
```

**Build Command:**
```bash
docker build -t careerpath:latest .
```

**Start Command:**
```bash
docker run -p 8000:8000 -e PORT=8000 careerpath:latest
```

### Step 3: Set Environment Variables

Go to **Environment** and add:

```env
APP_NAME=CareerPath
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-render-backend.onrender.com

DB_CONNECTION=mysql
DB_HOST=careerpath-db-server.mysql.database.azure.com
DB_PORT=3306
DB_DATABASE=careerpath
DB_USERNAME=careerpath_user@careerpath-db-server
DB_PASSWORD=Your_Strong_Password_123

JWT_SECRET=generate_strong_random_string_here
SANCTUM_STATEFUL_DOMAINS=vercel-frontend-url.vercel.app

MAIL_MAILER=log
MAIL_HOST=localhost
MAIL_PORT=2525

VITE_API_URL=https://your-render-backend.onrender.com/api
```

### Step 4: Modify Dockerfile (if needed)

Your current `Dockerfile` needs one adjustment for Render:

```dockerfile
# Around line 45 in your Dockerfile, change:
EXPOSE 8000

# Add:
ENV PORT=8000
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"]
```

### Step 5: Deploy

Click **Create Web Service** - Render will:
1. Build Docker image
2. Push to registry
3. Deploy container
4. Assign URL

**Your backend will be live at:**
```
https://careerpath-backend-[random].onrender.com
```

### Step 6: Run Migrations

After first deploy:
1. Go to backend Render URL: `/api/status`
2. You should see 200 OK response
3. Migrations run automatically via Docker CMD

---

## <a name="configuration"></a>⚙️ Part 4: Connect Everything

### Step 1: Update Frontend .env

**File: `client/.env.production`**

```env
VITE_API_URL=https://careerpath-backend-[random].onrender.com/api
```

### Step 2: Update Backend Configuration

**Already done via environment variables on Render**

### Step 3: Update Render Backend URL in Frontend

1. Go to Vercel Dashboard
2. Click your project
3. Settings → Environment Variables
4. Update `VITE_API_URL` with your Render backend URL
5. Redeploy (Vercel auto-redeploys on env changes)

### Step 4: Test API Connection

```bash
# From your local machine:
curl https://careerpath-backend-[random].onrender.com/api/health

# Should return 200 OK with health check
```

### Step 5: Configure CORS on Backend

**File: `config/cors.php`**

```php
'allowed_origins' => [
    'https://careerpath-[random].vercel.app',
    'https://your-custom-domain.com',
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

Deploy this change to Render.

---

## <a name="testing"></a>✅ Part 5: Testing & Monitoring

### Test Frontend to Backend Connection

1. Open Frontend URL in browser
2. Open **Developer Tools** (F12)
3. Go to **Network** tab
4. Try login/signup
5. Check API call in Network tab:
   - URL should be `https://careerpath-backend-...onrender.com/api/...`
   - Status should be 200/201/etc

### Test Database Connection

From Render backend logs:
```bash
# View logs in Render Dashboard
# Should see: "Migration completed successfully"
```

### Monitor Performance

**Vercel:**
- Dashboard → Analytics
- View real-time metrics

**Render:**
- Dashboard → Backend → Metrics
- Monitor CPU, Memory, Requests

**Azure:**
- Portal → MySQL Server → Metrics
- Monitor connections, queries, CPU

---

## 🔐 Security Checklist

- [ ] Azure MySQL: Only allow Render backend IP
- [ ] Render: Set strong environment variables
- [ ] Vercel: No sensitive data in frontend
- [ ] Backend: CORS configured correctly
- [ ] HTTPS enforced everywhere
- [ ] Database backups enabled (Azure: Automatic daily)
- [ ] SSL/TLS 1.2+ enforced

---

## 🚨 Troubleshooting

### Frontend can't connect to backend
```
Issue: CORS errors in browser console
Solution: Check CORS config in config/cors.php
          Ensure Vercel domain added to allowed_origins
```

### Database connection fails
```
Issue: "Connection refused" errors
Solution: Check firewall rules in Azure
          Verify Render backend IP whitelisted
          Test connection string locally first
```

### Backend won't start on Render
```
Issue: "Application failed to start"
Solution: Check logs in Render dashboard
          Verify environment variables set
          Ensure Dockerfile is correct
```

### Migrations didn't run
```
Issue: Database has no tables
Solution: Manually run: php artisan migrate in Render shell
          Or add to docker-entrypoint.sh
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Vercel)                       │
│  https://careerpath-[random].vercel.app               │
│  - React + Vite                                          │
│  - Auto-deploys on push to main                         │
└───────────────────┬─────────────────────────────────────┘
                    │
        HTTP/S (REST API)
                    │
┌───────────────────▼─────────────────────────────────────┐
│                 BACKEND (Render)                         │
│  https://careerpath-[random].onrender.com             │
│  - Laravel + PHP-FPM                                     │
│  - Dockerized                                            │
│  - Auto-scales on demand                                │
└───────────────────┬─────────────────────────────────────┘
                    │
         MySQL Protocol (TLS)
                    │
┌───────────────────▼─────────────────────────────────────┐
│               DATABASE (Azure MySQL)                     │
│  careerpath-db-server.mysql.database.azure.com        │
│  - MySQL 8.0                                            │
│  - Auto-backups daily                                   │
│  - Firewall configured                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 Cost Estimation (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Azure MySQL | Basic B1s (1 vCore, 1GB) | ~$30-50 |
| Render | Starter Plan | ~$7/month |
| Vercel | Hobby (Free) | $0 |
| **Total** | | **~$40/month** |

---

## 🎓 Next Steps After Deployment

1. **Set up monitoring:**
   - Enable alerts for backend errors
   - Monitor database query performance
   - Track frontend user metrics

2. **Enable logging:**
   - Backend logs in Render
   - Database audit logs in Azure
   - Frontend error tracking (Sentry)

3. **Configure backups:**
   - Azure: Automatic daily backups (retention: 7 days)
   - Render: Manual backups via CLI
   - Database dumps: `mysqldump -h host -u user -p database > backup.sql`

4. **Set up CI/CD:**
   - GitHub Actions already configured ✅
   - Auto-deploys to Vercel on push ✅
   - Manual deployment for Render (or GitHub integration)

5. **Custom domains:**
   - Frontend: Add custom domain to Vercel
   - Backend: Add custom domain to Render
   - Update CORS accordingly

---

## 📞 Support Resources

- **Azure**: https://docs.microsoft.com/azure/mysql/
- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **Laravel**: https://laravel.com/docs
- **React**: https://react.dev/learn

---

**Last Updated:** April 11, 2026
**Author:** Rafi12234
