# Backend Login Issue - Fixed

## Problem
The backend server was not running, which caused login to fail with connection errors.

## Solution

### Step 1: Start the Backend Server

**Option A: Use the batch file (Easiest)**
```powershell
cd "E:\Final Year Project\carbon_project"
.\START_BACKEND.bat
```

**Option B: Manual start**
```powershell
cd "E:\Final Year Project\carbon_project\backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Option C: Use start_servers.bat (Starts both frontend and backend)**
```powershell
cd "E:\Final Year Project\carbon_project"
.\start_servers.bat
```

### Step 2: Verify Backend is Running

Wait 10-15 seconds for the server to start, then check:

1. **Open browser**: http://localhost:8000/ping
   - Should show: `{"status": "ok", "message": "pong"}`

2. **Check API docs**: http://localhost:8000/docs
   - Should show the FastAPI documentation

3. **Check server console**:
   - Should show: `✅ Backend ready on http://localhost:8000`

### Step 3: Test Login

1. Make sure frontend is running: http://localhost:3000
2. Go to login page
3. Use credentials from a registered account
4. If you don't have an account, register first at: http://localhost:3000/register

## Troubleshooting

### Backend won't start

1. **Check if port 8000 is already in use:**
   ```powershell
   netstat -ano | findstr :8000
   ```
   If something is using port 8000, close it or change the port in the command.

2. **Check Python installation:**
   ```powershell
   python --version
   ```
   Should show Python 3.x

3. **Check dependencies:**
   ```powershell
   cd "E:\Final Year Project\carbon_project\backend"
   pip install -r requirements.txt
   ```

4. **Check database connection:**
   - Make sure MySQL is running
   - Check database credentials in `.env` file or environment variables

### Login still not working

1. **Check browser console** (F12) for errors
2. **Check network tab** to see if requests are reaching the backend
3. **Verify API URL** in frontend: Should be `http://localhost:8000`
4. **Check CORS settings** - Backend should allow requests from `http://localhost:3000`

### Common Error Messages

- **"Failed to fetch"** or **"NetworkError"**
  - Backend is not running
  - Solution: Start the backend server

- **"Connection refused"**
  - Backend is not running or wrong port
  - Solution: Start backend on port 8000

- **"Invalid email or password"**
  - Wrong credentials or user doesn't exist
  - Solution: Register first or use correct credentials

- **"Email not found"**
  - User needs to register first
  - Solution: Go to /register and create an account

## Quick Start Commands

```powershell
# Terminal 1 - Backend
cd "E:\Final Year Project\carbon_project\backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend (in a new terminal)
cd "E:\Final Year Project\carbon_project\frontend"
npm start
```

## Verification Checklist

- [ ] Backend server is running (check http://localhost:8000/ping)
- [ ] Frontend server is running (check http://localhost:3000)
- [ ] Database is connected (check backend console for "✅ Database connectivity verified")
- [ ] User is registered (or register a new account)
- [ ] Using correct email and password
- [ ] No CORS errors in browser console

