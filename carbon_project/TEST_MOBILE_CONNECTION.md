# Test Mobile App Connection

## Quick Test Steps

### 1. Test Backend from Phone Browser
On your phone's browser, open:
```
http://10.96.102.50:8000/ping
```

**Expected Result:** Should see `{"status":"ok","message":"pong"}`

**If this works:** The backend is accessible and the mobile app should work after rebuild.

**If this doesn't work:** 
- Check that phone and computer are on the same Wi-Fi network
- Check Windows Firewall settings
- Verify backend is running on `0.0.0.0:8000` (not just `127.0.0.1:8000`)

### 2. Test Login Endpoint
On your phone's browser, you can't easily test POST, but you can verify the endpoint exists:
```
http://10.96.102.50:8000/docs
```

This should show the API documentation.

### 3. Check Mobile App Config
The mobile app config file should have:
```json
{
  "apiBaseUrl": "http://10.96.102.50:8000"
}
```

**Important:** The app must be rebuilt after changing this config!

### 4. Rebuild Mobile App
```bash
cd "E:\Final Year Project\carbon_project\flutter"
flutter clean
flutter pub get
flutter build apk --release
```

Then reinstall on your phone.

### 5. Common Issues

#### Issue: "Server timeout. Please retry once the connection is stable."
**Cause:** App can't reach backend server
**Solutions:**
1. Rebuild app with correct config
2. Check phone and computer are on same Wi-Fi
3. Test backend from phone browser first
4. Check Windows Firewall

#### Issue: Backend not accessible from phone
**Solutions:**
1. Ensure backend is running on `0.0.0.0:8000` (not `127.0.0.1:8000`)
2. Allow Python through Windows Firewall
3. Check router settings (some routers block device-to-device communication)

#### Issue: App shows old IP address
**Solution:** App needs rebuild - config changes only take effect after rebuild

## Current Configuration
- Backend IP: `10.96.102.50`
- Backend Port: `8000`
- Config File: `carbon_project/flutter/assets/config/server_config.json`
- Status: ✅ Backend is running and accessible

