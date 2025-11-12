# 🚀 Complete Render Deployment Guide

## Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account
- Render account (free tier)
- PlanetScale account (for MySQL database - free tier)

---

## PART 1: Database Setup (PlanetScale)

### Step 1: Create PlanetScale Account
1. Go to https://planetscale.com
2. Sign up with GitHub (recommended)
3. Verify email

### Step 2: Create Database
1. Click "Create database"
2. Name: `carbon_footprint_db`
3. Region: Choose closest to you
4. Plan: Hobby (Free)
5. Click "Create database"

### Step 3: Get Connection Details
1. Click on your database
2. Click "Connect" button
3. Select "General" connection string
4. Copy the connection details:
   - Host
   - Username
   - Password
   - Database name
   - Port (usually 3306)

### Step 4: Initialize Database Schema
1. Click "Console" tab in PlanetScale
2. Run your schema SQL from `backend/database/schema.sql`
3. Run `backend/database/gamification_schema.sql` if needed

**OR** use MySQL Workbench/command line:
```bash
mysql -h your-host -u your-user -p your-database < backend/database/schema.sql
```

---

## PART 2: Backend Deployment (Render)

### Step 1: Push Code to GitHub
```bash
cd "E:\Final Year Project"
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Verify email

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repository: `carbon-footprint` (or your repo name)

### Step 4: Configure Backend Service

**Basic Settings:**
- **Name**: `carbon-footprint-backend`
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: `carbon_project/backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
Click "Add Environment Variable" and add:

```
DB_HOST=your-planetscale-host.planetscale.com
DB_PORT=3306
DB_USER=your-planetscale-username
DB_PASSWORD=your-planetscale-password
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://username:password@host:3306/database_name

SECRET_KEY=generate-a-random-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

APP_NAME=Carbon Footprint Calculator
APP_VERSION=1.0.0
DEBUG=False
ENVIRONMENT=production

ALLOWED_ORIGINS=https://your-frontend.onrender.com

RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=100
```

**Important Notes:**
- Replace all `your-*` values with actual PlanetScale credentials
- Generate a strong SECRET_KEY (use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- Update `ALLOWED_ORIGINS` after frontend is deployed

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will:
   - Clone your repo
   - Install dependencies
   - Start your service
3. Wait for deployment (5-10 minutes)
4. Your backend URL: `https://carbon-footprint-backend.onrender.com`

### Step 6: Test Backend
1. Open: `https://your-backend.onrender.com/health`
2. Should return: `{"status": "healthy", "message": "API is running"}`
3. API Docs: `https://your-backend.onrender.com/docs`

---

## PART 3: Frontend Deployment (Render)

### Step 1: Update Frontend API URL
Create `.env.production` in `carbon_project/frontend/`:
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Step 2: Update package.json
Add to `scripts` section:
```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "serve": "serve -s build -l $PORT"
}
```

Install serve:
```bash
cd carbon_project/frontend
npm install --save-dev serve
```

### Step 3: Create Static Web Service on Render
1. Go to Render dashboard
2. Click "New +" → "Static Site"
3. Connect GitHub repository
4. Select your repository

**Configuration:**
- **Name**: `carbon-footprint-frontend`
- **Branch**: `main`
- **Root Directory**: `carbon_project/frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Step 4: Deploy Frontend
1. Click "Create Static Site"
2. Wait for build (3-5 minutes)
3. Your frontend URL: `https://carbon-footprint-frontend.onrender.com`

### Step 5: Update Backend CORS
1. Go to backend service in Render
2. Update environment variable:
   ```
   ALLOWED_ORIGINS=https://carbon-footprint-frontend.onrender.com
   ```
3. Redeploy backend (or it will auto-update)

---

## PART 4: Alternative - Frontend on Vercel (Recommended)

Vercel is better for React apps (unlimited free tier).

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### Step 2: Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Select repository

### Step 3: Configure
- **Framework Preset**: React
- **Root Directory**: `carbon_project/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Your frontend URL: `https://your-project.vercel.app`

---

## Environment Variables Summary

### Backend (Render)
```
DB_HOST=xxx.planetscale.com
DB_PORT=3306
DB_USER=xxx
DB_PASSWORD=xxx
DB_NAME=carbon_footprint_db
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=https://your-frontend.vercel.app
DEBUG=False
```

### Frontend (Vercel/Render)
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## Testing Your Deployment

### 1. Test Backend
```bash
curl https://your-backend.onrender.com/health
curl https://your-backend.onrender.com/ping
```

### 2. Test Frontend
- Open frontend URL in browser
- Try to register/login
- Test calculator functionality

### 3. Test Database Connection
- Register a new user
- Check if data is saved
- View in PlanetScale console

---

## Troubleshooting

### Backend Won't Start
- Check Render logs
- Verify all environment variables are set
- Check database connection string
- Verify Python version compatibility

### Database Connection Fails
- Verify PlanetScale credentials
- Check if database is initialized
- Test connection string locally
- Check firewall/network settings

### Frontend Can't Connect to Backend
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Verify backend is running
- Check browser console for errors

### Build Fails
- Check `requirements.txt` is complete
- Verify all dependencies are listed
- Check build logs for specific errors
- Ensure Python version is compatible

---

## Cost Estimate

**Free Tier:**
- Render: 750 hours/month (enough for 24/7)
- Vercel: Unlimited
- PlanetScale: 5GB storage (free with GitHub Student Pack)

**Total Cost: $0/month** ✅

---

## Next Steps

1. ✅ Database setup on PlanetScale
2. ✅ Backend deployed on Render
3. ✅ Frontend deployed on Vercel/Render
4. ✅ Environment variables configured
5. ✅ CORS settings updated
6. ✅ Test all functionality
7. ✅ Share your live URLs!

---

## Your Live URLs

After deployment, you'll have:
- **Backend**: `https://carbon-footprint-backend.onrender.com`
- **Frontend**: `https://carbon-footprint-frontend.vercel.app`
- **API Docs**: `https://carbon-footprint-backend.onrender.com/docs`

🎉 **Your project is now live!**

