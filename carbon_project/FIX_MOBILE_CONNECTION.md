# Fix Mobile App Connection Issue

## Problem
Mobile app shows "Server timeout. Please retry once the connection is stable."

## Solution Steps

### 1. Verify Backend is Running
- Backend should be running on `0.0.0.0:8000` (already running ✅)
- Check: http://10.96.102.50:8000/ping should return `{"status":"ok","message":"pong"}`

### 2. Verify Config File
The config file at `carbon_project/flutter/assets/config/server_config.json` should have:
```json
{
  "apiBaseUrl": "http://10.96.102.50:8000"
}
```

### 3. Rebuild the Mobile App
The app needs to be rebuilt to pick up the config changes:

**Option A: Quick Rebuild (Recommended)**
```bash
cd "E:\Final Year Project\carbon_project\flutter"
flutter clean
flutter pub get
flutter build apk --release
```

**Option B: Reinstall on Phone**
After rebuilding, you need to reinstall the APK on your phone:
1. Stop the APK server (if running)
2. Rebuild APK (see Option A)
3. Restart APK server: `python serve_apk.py`
4. Scan QR code again and reinstall

### 4. Verify Network Connection
- Ensure phone and computer are on the same Wi-Fi network
- Phone IP should be in the same subnet (e.g., 10.96.102.x)
- Test from phone browser: http://10.96.102.50:8000/ping

### 5. Check Firewall
Windows Firewall might be blocking connections. To allow:
```powershell
New-NetFirewallRule -DisplayName "Python Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

### 6. Test Connection from Phone
1. Open phone browser
2. Go to: http://10.96.102.50:8000/ping
3. Should see: `{"status":"ok","message":"pong"}`
4. If this works, the app should work too after rebuild

## Quick Fix Script
Run this to rebuild and restart everything:
```bash
cd "E:\Final Year Project\carbon_project\flutter"
flutter clean
flutter pub get
flutter build apk --release
cd ..
python serve_apk.py
```

Then scan the QR code again and reinstall the app.

