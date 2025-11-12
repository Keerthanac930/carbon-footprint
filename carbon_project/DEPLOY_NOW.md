# 🚀 DEPLOY NOW - Step by Step (PlanetScale)

## ⚡ Quick Deployment Steps

### STEP 1: Setup PlanetScale Database (5 minutes)

1. **Go to PlanetScale**: https://app.planetscale.com/new
2. **Sign up/Login** with GitHub (recommended) or email
3. **Create Organization** (if first time):
   - Name: `keerthana-cs` or your choice
   - Click "Create organization"

4. **Create Database**:
   - Click "Create database"
   - **Name**: `carbon_footprint_db`
   - **Region**: Choose closest (US East recommended)
   - **Plan**: Hobby (Free) - 5GB storage
   - Click "Create database"

5. **Get Connection Details**:
   - Click on your database: `carbon_footprint_db`
   - Click "Connect" button
   - Select "General" connection string
   - **Copy these values** (you'll need them):
     - Host: `xxx.psdb.cloud`
     - Username: `xxx`
     - Password: `xxx` (click "Show password")
     - Database: `carbon_footprint_db`
     - Port: `3306` (standard MySQL port)

6. **Initialize Database Schema**:
   - Click "Console" tab in PlanetScale
   - Copy entire content from `backend/setup_planetscale.sql`
   - Paste and run in PlanetScale console

---

### STEP 2: Generate Secret Key (30 seconds)

**Run this command locally:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Copy the output** - you'll need it for Render!

---

### STEP 3: Deploy Backend on Render (5 minutes)

1. **Open**: https://render.com
2. **Login**: keerthanac3399@gmail.com
3. **Click**: "New +" → "Web Service"
4. **Connect GitHub**: Authorize and select `Keerthanac930/carbon-footprint`
5. **Configure**:
   - Name: `carbon-footprint-backend`
   - Region: `Oregon (US West)`
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

6. **Add Environment Variables** (click "Add Environment Variable" for each):

```
DB_HOST=your-planetscale-host.psdb.cloud
DB_PORT=3306
DB_USER=your-planetscale-username-from-step-1
DB_PASSWORD=your-planetscale-password-from-step-1
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://username:password@host:3306/carbon_footprint_db
SECRET_KEY=paste-generated-key-from-step-2
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

7. **Click**: "Create Web Service"
8. **Wait**: 5-10 minutes for deployment
9. **Copy Backend URL**: `https://carbon-footprint-backend.onrender.com`

---

### STEP 4: Deploy Frontend on Vercel (3 minutes)

1. **Open**: https://vercel.com/new?teamSlug=keerthana-cs-projects
2. **Click**: "Import Git Repository"
3. **Select**: `Keerthanac930/carbon-footprint`
4. **Configure**:
   - Framework Preset: `React`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto)
   - Output Directory: `build` (auto)

5. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://carbon-footprint-backend.onrender.com` (from Step 3)

6. **Click**: "Deploy"
7. **Wait**: 2-3 minutes
8. **Copy Frontend URL**: `https://xxx.vercel.app`

---

### STEP 5: Update CORS (1 minute)

1. **Go back to Render**: Open backend service
2. **Environment Tab**: Find `ALLOWED_ORIGINS`
3. **Update**: Replace with your actual Vercel frontend URL
4. **Save**: Auto-redeploys

---

### STEP 6: Test (2 minutes)

1. **Backend**: https://carbon-footprint-backend.onrender.com/health
2. **Frontend**: Open your Vercel URL
3. **Test**: Register → Login → Calculator

---

## ✅ DONE!

Your project is now live! 🎉

