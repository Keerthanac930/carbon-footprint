# 🚀 Your Personal Deployment Guide

## Your Account Details

✅ **GitHub**: https://github.com/Keerthanac930/carbon-footprint  
✅ **Render**: keerthanac3399@gmail.com  
✅ **Vercel**: Team - keerthana-cs-projects  
✅ **Database**: TiDB Cloud (MySQL compatible)

---

## 🗄️ STEP 1: Database Setup (TiDB Cloud)

### 1.1 Access Your TiDB Cluster
- **URL**: https://tidbcloud.com/clusters/10428321177133583866/overview
- **Login**: keerthanac426@gmail.com
- **Username**: Keerthana C

### 1.2 Get Connection Details
1. Open your TiDB cluster dashboard
2. Click **"Connect"** or **"Connection Info"**
3. You'll see:
   - **Host**: `xxx.tidbcloud.com` (copy this)
   - **Port**: Usually `4000` for TiDB
   - **Username**: Your TiDB username
   - **Password**: Your TiDB password
   - **Database**: We'll create `carbon_footprint_db`

### 1.3 Create Database
1. In TiDB Cloud console, go to **"SQL Editor"** or **"Console"**
2. Run this SQL:
```sql
CREATE DATABASE IF NOT EXISTS carbon_footprint_db;
USE carbon_footprint_db;
```

### 1.4 Initialize Schema
1. Open SQL Editor in TiDB Cloud
2. Copy contents from `backend/database/schema.sql`
3. Paste and run in TiDB console
4. Also run `backend/database/gamification_schema.sql` if it exists

**Save these connection details - you'll need them for Render:**
- Host: `xxx.tidbcloud.com`
- Port: `4000`
- Username: `your-tidb-username`
- Password: `your-tidb-password`
- Database: `carbon_footprint_db`

---

## ⚙️ STEP 2: Backend Deployment (Render)

### 2.1 Login to Render
1. Go to: https://render.com
2. Click **"Get Started"** or **"Log In"**
3. Login with: **keerthanac3399@gmail.com**
4. Password: (your password)

### 2.2 Connect GitHub
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"**
3. Authorize Render to access your GitHub
4. Select repository: **Keerthanac930/carbon-footprint**

### 2.3 Configure Backend

**Basic Settings:**
- **Name**: `carbon-footprint-backend`
- **Region**: `Oregon (US West)` or closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
Click **"Add Environment Variable"** for each:

```
DB_HOST=your-tidb-host.tidbcloud.com
DB_PORT=4000
DB_USER=your-tidb-username
DB_PASSWORD=your-tidb-password
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://username:password@host:4000/carbon_footprint_db
```

**Generate SECRET_KEY:**
Run this locally:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output and add:
```
SECRET_KEY=paste-generated-key-here
```

**More Environment Variables:**
```
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Carbon Footprint Calculator
APP_VERSION=1.0.0
DEBUG=False
ENVIRONMENT=production
ALLOWED_ORIGINS=https://carbon-footprint-frontend.vercel.app
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=100
```

**Important Notes:**
- Replace `your-tidb-*` with actual TiDB Cloud values
- Update `ALLOWED_ORIGINS` after frontend is deployed (we'll do this later)
- Use the generated SECRET_KEY

### 2.4 Deploy Backend
1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install Python dependencies
   - Start your service
3. Wait 5-10 minutes (first deployment takes longer)
4. Your backend URL will be: `https://carbon-footprint-backend.onrender.com`

### 2.5 Test Backend
Once deployed, test these URLs:
- Health: `https://carbon-footprint-backend.onrender.com/health`
- Ping: `https://carbon-footprint-backend.onrender.com/ping`
- API Docs: `https://carbon-footprint-backend.onrender.com/docs`

✅ **Save your backend URL** - you'll need it for frontend!

---

## 🎨 STEP 3: Frontend Deployment (Vercel)

### 3.1 Access Vercel Team
1. Go to: https://vercel.com/new?teamSlug=keerthana-cs-projects
2. Or login at: https://vercel.com
3. Make sure you're in team: **keerthana-cs-projects**

### 3.2 Import Project
1. Click **"Add New"** → **"Project"**
2. Click **"Import Git Repository"**
3. Select: **Keerthanac930/carbon-footprint**
4. Click **"Import"**

### 3.3 Configure Frontend

**Project Settings:**
- **Framework Preset**: `React`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `build` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Environment Variables:**
Click **"Add"** button and add:

```
REACT_APP_API_URL=https://carbon-footprint-backend.onrender.com
```

**Important:**
- Use your actual Render backend URL from Step 2.5
- This tells frontend where to find your API

### 3.4 Deploy Frontend
1. Click **"Deploy"**
2. Vercel will:
   - Install npm packages
   - Build React app
   - Deploy to CDN
3. Wait 2-3 minutes
4. Your frontend URL: `https://carbon-footprint-frontend.vercel.app` (or similar)

✅ **Save your frontend URL** - you'll need it for CORS!

---

## 🔗 STEP 4: Update CORS Settings

### 4.1 Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service: `carbon-footprint-backend`
3. Go to **"Environment"** tab
4. Find `ALLOWED_ORIGINS` variable
5. Update it to your Vercel frontend URL:
   ```
   ALLOWED_ORIGINS=https://your-actual-frontend-url.vercel.app
   ```
6. Click **"Save Changes"**
7. Render will auto-redeploy (takes 2-3 minutes)

### 4.2 Verify CORS
1. Open your frontend URL
2. Try to register/login
3. Check browser console (F12) for errors
4. Should work without CORS errors!

---

## ✅ STEP 5: Testing Your Deployment

### Test Checklist:

1. **Backend Health**
   - [ ] Open: `https://carbon-footprint-backend.onrender.com/health`
   - [ ] Should show: `{"status": "healthy", "message": "API is running"}`

2. **API Documentation**
   - [ ] Open: `https://carbon-footprint-backend.onrender.com/docs`
   - [ ] Should show Swagger UI

3. **Frontend Loads**
   - [ ] Open your Vercel frontend URL
   - [ ] Should show login/signup page

4. **Registration**
   - [ ] Click "Sign Up"
   - [ ] Fill form and submit
   - [ ] Should create account successfully

5. **Login**
   - [ ] Login with created account
   - [ ] Should redirect to dashboard

6. **Calculator**
   - [ ] Fill carbon calculator form
   - [ ] Submit calculation
   - [ ] Should show results

7. **Database**
   - [ ] Check TiDB Cloud console
   - [ ] Verify data is being saved

---

## 📋 Environment Variables Summary

### Backend (Render) - Required:
```
DB_HOST=xxx.tidbcloud.com
DB_PORT=4000
DB_USER=your-tidb-username
DB_PASSWORD=your-tidb-password
DB_NAME=carbon_footprint_db
SECRET_KEY=your-generated-secret-key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
DEBUG=False
```

### Frontend (Vercel) - Required:
```
REACT_APP_API_URL=https://carbon-footprint-backend.onrender.com
```

---

## 🔧 Troubleshooting

### Backend Won't Start
1. Check Render logs (click "Logs" tab)
2. Verify all environment variables are set
3. Check database connection string format
4. Verify TiDB Cloud allows connections from Render

### Database Connection Fails
1. Verify TiDB credentials are correct
2. Check TiDB Cloud firewall/whitelist settings
3. Test connection string format:
   ```
   mysql+pymysql://username:password@host:4000/database
   ```
4. Make sure database `carbon_footprint_db` exists

### Frontend Can't Connect to Backend
1. Verify `REACT_APP_API_URL` is correct
2. Check CORS settings in backend
3. Open browser console (F12) for errors
4. Verify backend is running (check health endpoint)

### Build Fails
1. Check build logs in Render/Vercel
2. Verify `requirements.txt` is complete
3. Check for Python version compatibility
4. Verify all dependencies are listed

---

## 🎉 Your Live URLs

After successful deployment:

- **Backend API**: `https://carbon-footprint-backend.onrender.com`
- **Frontend App**: `https://carbon-footprint-frontend.vercel.app` (or similar)
- **API Documentation**: `https://carbon-footprint-backend.onrender.com/docs`
- **Health Check**: `https://carbon-footprint-backend.onrender.com/health`

---

## 📝 Quick Reference

### Generate Secret Key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Test Backend:
```bash
curl https://carbon-footprint-backend.onrender.com/ping
```

### Test Frontend:
Just open the Vercel URL in browser!

---

## 🚀 Next Steps

1. ✅ Complete database setup in TiDB Cloud
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel
4. ✅ Update CORS settings
5. ✅ Test all functionality
6. ✅ Share your live project URLs!

---

## 💡 Tips

- **Monitor Usage**: Check Render/Vercel dashboards for usage
- **Logs**: Use Render/Vercel logs for debugging
- **Updates**: Push to GitHub main branch = auto-deploy
- **Environment Variables**: Keep them secure, never commit to GitHub
- **Backup**: Regularly backup your database

---

**Good luck with your deployment! 🎉**

If you need help at any step, let me know!

