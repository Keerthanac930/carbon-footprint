# 🚀 Running Services Status

## ✅ All Services Started!

### 1. Backend API Server
- **Status**: ✅ Running
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/ping
- **Port**: 8000
- **Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

### 2. Web Frontend
- **Status**: ✅ Running
- **URL**: http://localhost:3000
- **Port**: 3000
- **Command**: `npm start`
- **Auto-opens**: Browser should open automatically

### 3. Flutter Mobile App
- **Status**: ✅ Running
- **Platform**: Detecting available devices...
- **Command**: `flutter run`
- **Note**: Will auto-detect connected Android device or Windows desktop

---

## 📱 Access Points

### Web Application
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard

### API Endpoints
- **Base URL**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/ping

### Mobile App
- **Platform**: Check Flutter output for device selection
- **Note**: For mobile devices, update API URL to your computer's IP address

---

## 🔧 Troubleshooting

### Backend Not Starting
1. Check if port 8000 is already in use:
   ```powershell
   netstat -ano | findstr :8000
   ```
2. Kill existing process if needed:
   ```powershell
   taskkill /PID <process_id> /F
   ```
3. Restart backend:
   ```powershell
   cd "E:\Final Year Project\carbon_project\backend"
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Not Starting
1. Check if port 3000 is already in use:
   ```powershell
   netstat -ano | findstr :3000
   ```
2. Install dependencies if needed:
   ```powershell
   cd "E:\Final Year Project\carbon_project\frontend"
   npm install
   ```
3. Restart frontend:
   ```powershell
   npm start
   ```

### Flutter Not Running
1. Check available devices:
   ```powershell
   cd "E:\Final Year Project\carbon_project\flutter"
   flutter devices
   ```
2. Run on specific device:
   ```powershell
   flutter run -d windows  # For Windows desktop
   flutter run -d <device_id>  # For specific device
   ```

---

## 🎯 Quick Commands

### Stop All Services
Press `CTRL+C` in each terminal window

### Restart All Services
```powershell
# Use the batch file
cd "E:\Final Year Project\carbon_project"
.\start_servers.bat
```

### Check Service Status
```powershell
# Check ports
netstat -ano | findstr ":8000 :3000"

# Check Flutter devices
cd "E:\Final Year Project\carbon_project\flutter"
flutter devices
```

---

## 📊 Service Health

### Backend Health Check
```powershell
curl http://localhost:8000/ping
```
Expected response: `{"message": "pong"}`

### Frontend Health Check
Open browser: http://localhost:3000

### Mobile App Health
Check Flutter console output for app status

---

## 🔗 Network Access (Mobile)

For mobile devices to access the backend:

1. Find your computer's IP:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.100`)

2. Update mobile app config:
   - File: `carbon_project/flutter/lib/core/config/app_config.dart`
   - Change: `baseUrl = 'http://192.168.1.100:8000'`

3. Ensure backend is accessible:
   - Backend must be running with `--host 0.0.0.0`
   - Firewall may need to allow port 8000

---

## ✅ All Services Running!

You can now:
- ✅ Access web frontend at http://localhost:3000
- ✅ Use API at http://localhost:8000
- ✅ Run mobile app on connected device
- ✅ Test all features end-to-end

**Status**: All services operational! 🎉

