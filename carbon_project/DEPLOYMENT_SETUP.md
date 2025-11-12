# 🚀 Deployment Setup for Keerthana C

## Your Deployment Details

- **GitHub Repository**: https://github.com/Keerthanac930/carbon-footprint
- **Render Account**: keerthanac3399@gmail.com
- **Vercel Team**: keerthana-cs-projects
- **Database**: TiDB Cloud (MySQL compatible)

---

## STEP 1: Database Setup (TiDB Cloud)

### 1.1 Access TiDB Cloud
- URL: https://tidbcloud.com/clusters/10428321177133583866/overview
- Login with: keerthanac426@gmail.com

### 1.2 Get Connection Details
1. Go to your TiDB cluster
2. Click "Connect" or "Connection Info"
3. Note down:
   - **Host**: (e.g., `gateway01.us-west-2.prod.aws.tidbcloud.com`)
   - **Port**: (usually `4000` for TiDB)
   - **Username**: (your username)
   - **Password**: (your password)
   - **Database**: (create one named `carbon_footprint_db`)

### 1.3 Create Database
Run this SQL in TiDB console:
```sql
CREATE DATABASE IF NOT EXISTS carbon_footprint_db;
USE carbon_footprint_db;
```

### 1.4 Initialize Schema
1. Go to TiDB Cloud console
2. Select `carbon_footprint_db` database
3. Run SQL from `backend/database/schema.sql`
4. Run SQL from `backend/database/gamification_schema.sql` (if exists)

---

## STEP 2: Backend Deployment (Render)

### 2.1 Login to Render
1. Go to https://render.com
2. Login with: **keerthanac3399@gmail.com**
3. Password: (your password)

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Click "Connect GitHub"
3. Authorize Render to access GitHub
4. Select repository: **Keerthanac930/carbon-footprint**

### 2.3 Configure Backend Service

**Basic Settings:**
- **Name**: `carbon-footprint-backend`
- **Region**: Choose closest (US East recommended)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
Click "Add Environment Variable" for each:

```
DB_HOST=your-tidb-host.tidbcloud.com
DB_PORT=4000
DB_USER=your-tidb-username
DB_PASSWORD=your-tidb-password
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://username:password@host:4000/carbon_footprint_db

SECRET_KEY=generate-this-with-python-secrets-token-urlsafe-32
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

**Important:**
- Replace `your-tidb-*` with actual TiDB Cloud credentials
- Generate SECRET_KEY: Run `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Update ALLOWED_ORIGINS after frontend is deployed

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Your backend URL: `https://carbon-footprint-backend.onrender.com`

### 2.5 Test Backend
- Health check: `https://carbon-footprint-backend.onrender.com/health`
- API docs: `https://carbon-footprint-backend.onrender.com/docs`

---

## STEP 3: Frontend Deployment (Vercel)

### 3.1 Login to Vercel
1. Go to https://vercel.com
2. Login with GitHub (same account: Keerthanac930)
3. Access team: **keerthana-cs-projects**

### 3.2 Import Project
1. Go to: https://vercel.com/new?teamSlug=keerthana-cs-projects
2. Click "Import Git Repository"
3. Select: **Keerthanac930/carbon-footprint**

### 3.3 Configure Frontend

**Project Settings:**
- **Framework Preset**: React
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

**Environment Variables:**
Click "Add" and add:

```
REACT_APP_API_URL=https://carbon-footprint-backend.onrender.com
```

**Important:**
- Use your actual Render backend URL
- This will be available after backend is deployed

### 3.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Your frontend URL: `https://carbon-footprint-frontend.vercel.app` (or similar)

### 3.5 Update Backend CORS
1. Go back to Render dashboard
2. Open backend service
3. Go to "Environment" tab
4. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```
5. Save (auto-redeploys)

---

## STEP 4: Generate Secret Key

Run this command locally:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and use it as `SECRET_KEY` in Render.

---

## STEP 5: Final Configuration

### Backend Environment Variables (Render)
```
DB_HOST=xxx.tidbcloud.com
DB_PORT=4000
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=carbon_footprint_db
SECRET_KEY=your-generated-secret-key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
DEBUG=False
```

### Frontend Environment Variables (Vercel)
```
REACT_APP_API_URL=https://carbon-footprint-backend.onrender.com
```

---

## Testing Checklist

- [ ] Backend health check works
- [ ] API docs accessible
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can login
- [ ] Calculator works
- [ ] Database saves data
- [ ] CORS allows frontend-backend communication

---

## Your Live URLs

After deployment:
- **Backend**: `https://carbon-footprint-backend.onrender.com`
- **Frontend**: `https://carbon-footprint-frontend.vercel.app` (or similar)
- **API Docs**: `https://carbon-footprint-backend.onrender.com/docs`

---

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify all environment variables are set
- Test database connection
- Check TiDB Cloud firewall settings

### Frontend Issues
- Verify REACT_APP_API_URL is correct
- Check browser console for errors
- Ensure CORS is configured
- Verify backend is running

### Database Issues
- Verify TiDB connection string
- Check database is initialized
- Test connection locally first
- Check firewall/network settings

---

## Next Steps

1. ✅ Set up TiDB Cloud database
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel
4. ✅ Configure environment variables
5. ✅ Test all functionality
6. ✅ Share your live URLs!

Good luck with your deployment! 🚀

