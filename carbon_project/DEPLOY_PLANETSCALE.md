# 🚀 DEPLOY NOW - PlanetScale Edition

## ⚡ Quick Deployment Steps with PlanetScale

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
   - Or use MySQL Workbench/command line
   - Run SQL from `backend/database/schema.sql`
   - Or use the simplified version below

**Save these connection details:**
- Host: `xxx.psdb.cloud`
- Username: `xxx`
- Password: `xxx`
- Database: `carbon_footprint_db`
- Port: `3306`

---

### STEP 2: Generate Secret Key (30 seconds)

**Already generated for you:**
```
SECRET_KEY=6un26lzx3cNN5OJRibQ46QCFuDZWneIaOd2Ua34yAJM
```

Or generate new one:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

### STEP 3: Deploy Backend on Render (10 minutes)

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
DB_USER=your-planetscale-username
DB_PASSWORD=your-planetscale-password
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://username:password@host:3306/carbon_footprint_db
SECRET_KEY=6un26lzx3cNN5OJRibQ46QCFuDZWneIaOd2Ua34yAJM
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
- Replace `your-planetscale-*` with actual values from Step 1
- In DATABASE_URL, replace `username`, `password`, `host` with actual values
- Update `ALLOWED_ORIGINS` after frontend is deployed (Step 4)

7. **Click**: "Create Web Service"
8. **Wait**: 5-10 minutes for deployment
9. **Copy Backend URL**: `https://carbon-footprint-backend.onrender.com`

**Test Backend:**
- Health: `https://carbon-footprint-backend.onrender.com/health`
- API Docs: `https://carbon-footprint-backend.onrender.com/docs`

---

### STEP 4: Deploy Frontend on Vercel (5 minutes)

1. **Open**: https://vercel.com/new?teamSlug=keerthana-cs-projects
2. **Click**: "Import Git Repository"
3. **Select**: `Keerthanac930/carbon-footprint`
4. **Configure**:
   - Framework Preset: `React`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)

5. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://carbon-footprint-backend.onrender.com` (your actual backend URL from Step 3)

6. **Click**: "Deploy"
7. **Wait**: 2-3 minutes
8. **Copy Frontend URL**: `https://xxx.vercel.app`

---

### STEP 5: Update CORS (2 minutes)

1. **Go back to Render**: Open backend service
2. **Environment Tab**: Find `ALLOWED_ORIGINS`
3. **Update**: Replace with your actual Vercel frontend URL:
   ```
   ALLOWED_ORIGINS=https://your-actual-frontend-url.vercel.app
   ```
4. **Save**: Auto-redeploys (takes 2-3 minutes)

---

### STEP 6: Initialize Database Schema (5 minutes)

**Option 1: Using PlanetScale Console** (Easiest)
1. Go to PlanetScale dashboard
2. Click on `carbon_footprint_db` database
3. Click "Console" tab
4. Copy entire content from `backend/database/schema.sql`
5. Paste and run in console

**Option 2: Using MySQL Workbench**
1. Connect to PlanetScale using connection string
2. Run `backend/database/schema.sql`

**Option 3: Using Command Line**
```bash
mysql -h your-host.psdb.cloud -u your-username -p carbon_footprint_db < backend/database/schema.sql
```

---

### STEP 7: Test Everything (3 minutes)

1. **Backend Health**: 
   - Open: `https://carbon-footprint-backend.onrender.com/health`
   - Should show: `{"status": "healthy", "message": "API is running"}`

2. **API Documentation**:
   - Open: `https://carbon-footprint-backend.onrender.com/docs`
   - Should show Swagger UI

3. **Frontend**:
   - Open your Vercel URL
   - Should show login/signup page

4. **Test Registration**:
   - Click "Sign Up"
   - Fill form and submit
   - Should create account successfully

5. **Test Login**:
   - Login with created account
   - Should redirect to dashboard

6. **Test Calculator**:
   - Fill carbon calculator form
   - Submit calculation
   - Should show results

7. **Verify Database**:
   - Check PlanetScale console
   - Verify data is being saved

---

## 📋 Environment Variables Summary

### Backend (Render) - Copy These:
```
DB_HOST=xxx.psdb.cloud
DB_PORT=3306
DB_USER=xxx
DB_PASSWORD=xxx
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://username:password@host:3306/carbon_footprint_db
SECRET_KEY=6un26lzx3cNN5OJRibQ46QCFuDZWneIaOd2Ua34yAJM
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Carbon Footprint Calculator
APP_VERSION=1.0.0
DEBUG=False
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=100
```

### Frontend (Vercel) - Copy This:
```
REACT_APP_API_URL=https://carbon-footprint-backend.onrender.com
```

---

## 🔧 PlanetScale Connection String Format

**Standard Format:**
```
mysql+pymysql://username:password@host:3306/database_name
```

**Example:**
```
mysql+pymysql://abc123:xyz789@aws.connect.psdb.cloud:3306/carbon_footprint_db
```

**Important:**
- PlanetScale uses port `3306` (standard MySQL)
- Host format: `xxx.psdb.cloud`
- Use `pymysql` driver (already in requirements.txt)

---

## ✅ Checklist

- [ ] PlanetScale database created
- [ ] Connection details saved
- [ ] Database schema initialized
- [ ] Backend deployed on Render
- [ ] All environment variables set in Render
- [ ] Frontend deployed on Vercel
- [ ] REACT_APP_API_URL set in Vercel
- [ ] CORS updated with frontend URL
- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Calculator works
- [ ] Data saves to database

---

## 🎉 Your Live URLs

After deployment:
- **Backend**: `https://carbon-footprint-backend.onrender.com`
- **Frontend**: `https://carbon-footprint-frontend.vercel.app` (or similar)
- **API Docs**: `https://carbon-footprint-backend.onrender.com/docs`
- **Database**: PlanetScale dashboard

---

## 🆘 Troubleshooting

### PlanetScale Connection Issues
- Verify connection string format
- Check password is correct (click "Show password" in PlanetScale)
- Ensure database name matches exactly
- Check firewall/network settings

### Backend Won't Start
- Check Render logs
- Verify all environment variables are set
- Check database connection string
- Verify SECRET_KEY is set

### Frontend Can't Connect
- Verify REACT_APP_API_URL is correct
- Check CORS settings
- Open browser console (F12) for errors
- Verify backend is running

---

## 💡 Tips

- **PlanetScale Free Tier**: 5GB storage, 1 billion rows/month - plenty for your project!
- **Auto-deploy**: Push to GitHub main branch = auto-deploy on Render/Vercel
- **Branching**: PlanetScale supports database branching (like Git!)
- **Monitoring**: Check Render/Vercel dashboards for usage
- **Logs**: Use Render logs for debugging backend issues

---

**Ready to deploy? Start with Step 1! 🚀**

