# Quick Deployment Checklist

## 🗄️ DATABASE (Azure MySQL) - 15 minutes

### Create & Configure
- [ ] Create Azure Account (azure.microsoft.com/free)
- [ ] Create Resource Group: `careerpath-rg`
- [ ] Create MySQL Server: `careerpath-db-server`
  ```
  Location: Your region
  Version: MySQL 8.0
  Admin: adminuser
  Password: Save securely!
  ```
- [ ] Configure Server Parameters (character_set, collation, timezone)
- [ ] Enable "Allow access to Azure services"
- [ ] Add your IP to firewall
- [ ] Create database: `careerpath`
- [ ] Create user: `careerpath_user` with privileges

### Save These Values
```
📌 MYSQL_HOST=careerpath-db-server.mysql.database.azure.com
📌 MYSQL_PORT=3306
📌 MYSQL_DATABASE=careerpath
📌 MYSQL_USER=careerpath_user@careerpath-db-server
📌 MYSQL_PASSWORD=Your_Password
```

---

## 🚀 FRONTEND (Vercel) - 5 minutes

### Deploy
- [ ] Go to vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import Git Repository: `CareerPath-...`
- [ ] Framework: **Vite**
- [ ] Root Directory: `./client`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Node.js Version: **20.x**

### Environment Variables
- [ ] Add `VITE_API_URL=https://careerpath-backend-[random].onrender.com/api`
  (Update this after Render deployment)

### After Deploy
```
📌 FRONTEND_URL=https://careerpath-[random].vercel.app
```

---

## ⚙️ BACKEND (Render) - 10 minutes

### Create Web Service
- [ ] Go to render.com/dashboard
- [ ] New → Web Service
- [ ] Connect GitHub: `CareerPath-...`
- [ ] Name: `careerpath-backend`
- [ ] Environment: **Docker**
- [ ] Region: Your closest region
- [ ] Branch: `main`

### Environment Variables
Copy-paste all these:
```env
APP_NAME=CareerPath
APP_ENV=production
APP_DEBUG=false
APP_URL=https://careerpath-backend-[random].onrender.com
DB_CONNECTION=mysql
DB_HOST=careerpath-db-server.mysql.database.azure.com
DB_PORT=3306
DB_DATABASE=careerpath
DB_USERNAME=careerpath_user@careerpath-db-server
DB_PASSWORD=Your_Azure_Password
JWT_SECRET=Generate_Random_String_32_Chars_Min!@#$%
SANCTUM_STATEFUL_DOMAINS=careerpath-[random].vercel.app
MAIL_MAILER=log
```

### Verify Dockerfile
```dockerfile
# Check your Dockerfile has this at end:
EXPOSE 8000
ENV PORT=8000
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"]
```

### After Deploy
```
📌 BACKEND_URL=https://careerpath-backend-[random].onrender.com
```

---

## 🔗 CONNECT EVERYTHING - 5 minutes

### Update Vercel with Backend URL
1. Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_API_URL=https://careerpath-backend-[random].onrender.com/api`
3. Redeploy

### Update Backend CORS
1. Edit `config/cors.php`:
```php
'allowed_origins' => [
    'https://careerpath-[random].vercel.app',
],
```
2. Push to GitHub
3. Render auto-redeploys

### Update Backend Database
1. Go to Render Backend → Shell
2. Run: `php artisan migrate`
3. Check logs for success

---

## ✅ TEST CONNECTIONS - 5 minutes

### Test Frontend → Backend
```bash
# In browser console:
fetch('https://careerpath-backend-[...].onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))

# Should return 200 OK
```

### Test Backend → Database
1. Render Dashboard → Logs
2. Look for: "Migration completed"
3. No connection errors

### Test Live Application
1. Go to `https://careerpath-[random].vercel.app`
2. Try Login/Register
3. Open DevTools → Network
4. Check API calls succeed

---

## 🎯 Quick Reference

| What | Where | Link |
|------|-------|------|
| Azure Portal | MySQL Server | portal.azure.com |
| Vercel Dashboard | Frontend | vercel.com/dashboard |
| Render Dashboard | Backend | render.com/dashboard |
| GitHub Repository | Code | github.com/Rafi12234/CareerPath-... |

---

## 🆘 IF SOMETHING BREAKS

### Frontend not loading
```
1. Check Vercel deployment logs
2. Verify VITE_API_URL environment variable
3. Check browser console for errors
```

### Backend won't start
```
1. Check Render logs for errors
2. Verify environment variables set
3. Test Dockerfile builds locally: docker build -t test .
```

### Can't connect to database
```
1. Test connection string locally
2. Check Azure firewall allows Render IP
3. Verify DB credentials in Render env vars
```

### CORS errors
```
1. Check browser console shows full error
2. Verify frontend URL in backend CORS config
3. Ensure protocol matches (https not http)
```

---

## 📞 Helpful Commands

```bash
# Test database locally before Azure
mysql -h localhost -u root -p

# Build Docker image locally
docker build -t careerpath:test .

# Test Docker image
docker run -p 8000:8000 -e APP_ENV=local careerpath:test

# View Render logs
curl https://api.render.com/v1/services/[service-id]/logs

# Verify backend health
curl https://careerpath-backend-[...].onrender.com/api/health
```

---

**Total Setup Time: ~35-40 minutes**

✅ All deployments complete and connected!
