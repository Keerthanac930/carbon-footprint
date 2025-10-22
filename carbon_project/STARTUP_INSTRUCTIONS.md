# 🚀 Carbon Footprint Calculator - Startup Instructions

## ✅ All Issues Have Been Fixed!

### What Was Fixed:
1. ✅ API Base URL corrected from `localhost:8001` to `localhost:8000`
2. ✅ CORS configured for both `localhost:3000` and `localhost:3001`
3. ✅ Fetch timeout reduced from 30s to 5s
4. ✅ Proper error handling with try/catch and alerts added
5. ✅ ML model loading moved to async startup event (faster startup)
6. ✅ `/ping` endpoint added for quick connectivity testing
7. ✅ Clear startup success messages added
8. ✅ Button styling with cursor-pointer and responsive states verified

---

## 🎯 Quick Start (EASIEST METHOD)

### Option 1: Use the Automated Startup Script
1. Navigate to the `carbon_project` folder
2. Double-click `start_servers.bat`
3. Wait for both servers to start (check the command windows)
4. Open your browser to http://localhost:3000

---

## 📋 Manual Start (If Automated Script Doesn't Work)

### Step 1: Start the Backend

Open a terminal/command prompt and run:

```bash
cd "E:\Final Year Project\carbon_project\backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Wait for these messages:**
```
🚀 Starting Carbon Footprint API...
============================================================
✅ Database tables created/verified
📦 Loading ML model...
✅ ML model loaded successfully
============================================================
✅ Backend ready on http://localhost:8000
📋 API Documentation: http://localhost:8000/docs
🔗 Test endpoint: http://localhost:8000/ping
============================================================
```

### Step 2: Test Backend Connection

Open a NEW terminal and run:

```bash
cd "E:\Final Year Project\carbon_project"
python test_connection.py
```

**Expected Output:**
```
✅ Connection OK: {'status': 'ok', 'message': 'pong'}
✅ Health check OK: {'status': 'healthy', 'message': 'API is running'}
✅ /auth/register endpoint is accessible
✅ /auth/login endpoint is accessible
✅ CORS configured for http://localhost:3000
✅ CORS configured for http://localhost:3001
```

### Step 3: Start the Frontend

Open a NEW terminal and run:

```bash
cd "E:\Final Year Project\carbon_project\frontend"
npm start
```

The frontend will open automatically at http://localhost:3000

---

## 🧪 Testing the Application

### 1. Test Backend Connectivity
```bash
# From carbon_project directory
python test_connection.py
```

### 2. Test in Browser
1. Open http://localhost:8000/ping - Should see: `{"status":"ok","message":"pong"}`
2. Open http://localhost:8000/docs - Should see the API documentation
3. Open http://localhost:3000 - Should see the frontend

### 3. Test Sign Up / Sign In
1. Go to http://localhost:3000
2. Click "Create Account"
3. Fill in:
   - Email: test@example.com
   - Name: Test User
   - Password: password123 (min 8 characters)
   - Confirm Password: password123
4. Click "Create Account"
5. You should be redirected to the dashboard

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" or "TypeError: Failed to fetch"

**Cause:** Backend is not running or not accessible

**Solution:**
1. Make sure backend is running on port 8000
2. Check the backend terminal for errors
3. Run `python test_connection.py` to verify connectivity
4. Make sure you started backend from the `backend` directory

### Issue: "ModuleNotFoundError: No module named 'app'"

**Cause:** Backend started from wrong directory

**Solution:**
```bash
# Must be in the backend directory
cd "E:\Final Year Project\carbon_project\backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Issue: Port 8000 already in use

**Solution:**
1. Find the process: `netstat -ano | findstr :8000`
2. Kill the process: `taskkill /PID <process_id> /F`
3. Or restart your computer

### Issue: Port 3000 already in use

**Solution:**
1. Stop the existing React app
2. Or use a different port by setting PORT=3001 before npm start

---

## 📊 Server Status Checklist

Before testing Sign In/Sign Up, verify:

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000 or 3001
- [ ] `http://localhost:8000/ping` returns `{"status":"ok"}`
- [ ] `http://localhost:8000/health` returns health status
- [ ] No errors in backend terminal
- [ ] No errors in frontend terminal
- [ ] Browser console shows no CORS errors

---

## 🎨 Frontend Configuration

**File:** `carbon_project/frontend/src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8000';  // ✅ Correct
this.timeout = 5000;  // 5 seconds timeout ✅
```

## 🔐 Backend Configuration

**File:** `carbon_project/backend/app/config.py`

```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",   # ✅
    "http://localhost:3001",   # ✅
    "http://127.0.0.1:3000",  # ✅
    "http://127.0.0.1:3001",  # ✅
]
```

---

## 📁 Important Files

- `start_servers.bat` - Automated startup script
- `backend/start_backend.bat` - Backend only startup
- `test_connection.py` - Connection testing tool
- `quick_test_backend.py` - Backend import test

---

## 🎯 Expected Behavior

1. **Backend starts in ~5-8 seconds** (ML model loading)
2. **Frontend starts in ~15-30 seconds** (React compilation)
3. **Sign In/Sign Up buttons work immediately** (no 30s timeout)
4. **Error messages are clear and helpful**
5. **Buttons have proper hover effects**

---

## ✨ What's New

- ⚡ **Faster startup**: ML model loads asynchronously
- 🔍 **Better testing**: `/ping` endpoint for quick checks
- ⏱️ **Shorter timeouts**: 5 seconds instead of 30 seconds
- 💬 **Better errors**: Clear messages with connection hints
- 📊 **Startup messages**: Know exactly when servers are ready

---

## 🆘 Still Having Issues?

1. **Check backend terminal** for any Python errors
2. **Check frontend terminal** for any npm errors
3. **Check browser console** (F12) for JavaScript errors
4. **Run test_connection.py** to verify backend is accessible
5. **Verify you're in the correct directories** when starting servers

---

## 📞 Support

If you continue to have issues:
1. Take a screenshot of the error
2. Copy the exact error message from the terminal
3. Note which step you're stuck on
4. Share this information for further assistance

---

**Last Updated:** October 21, 2025
**Version:** 2.0 (Optimized)

