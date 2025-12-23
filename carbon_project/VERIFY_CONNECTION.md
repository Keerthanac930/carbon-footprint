# Verify Mobile App Backend Connection

## ✅ Current Status
- **Backend IP:** 10.96.102.50
- **Backend Port:** 8000
- **Backend Status:** ✅ Running
- **Config File:** ✅ Updated with correct IP

## 🔍 Test Connection from Phone

### Step 1: Test Backend from Phone Browser
1. Make sure your phone is on the **same Wi-Fi network** as your computer
2. Open your phone's browser (Chrome, Safari, etc.)
3. Go to: `http://10.96.102.50:8000/ping`
4. **Expected Result:** You should see: `{"status":"ok","message":"pong"}`

**If this works:** ✅ Backend is accessible from your phone!

**If this doesn't work:**
- Check that phone and computer are on the same Wi-Fi
- Check Windows Firewall settings
- Try accessing from computer browser: `http://localhost:8000/ping`

### Step 2: Test Login Endpoint
1. On your phone browser, go to: `http://10.96.102.50:8000/docs`
2. You should see the API documentation page
3. This confirms the backend is fully accessible

### Step 3: Test Mobile App Connection
1. Open the mobile app on your phone
2. Try to login or register
3. If you see "Server timeout" or connection errors:
   - The app needs to be rebuilt with the updated config
   - See rebuild instructions below

## 🔧 If Connection Still Fails

### Check 1: Verify Backend is Accessible
```powershell
# From your computer, test:
Invoke-WebRequest -Uri "http://10.96.102.50:8000/ping"
```

### Check 2: Verify Phone Can Reach Backend
- Open phone browser
- Go to: `http://10.96.102.50:8000/ping`
- Should see: `{"status":"ok","message":"pong"}`

### Check 3: Rebuild Mobile App (If Needed)
If the app was built before the config was updated, rebuild it:

```bash
cd "E:\Final Year Project\carbon_project\flutter"
flutter clean
flutter pub get
flutter build apk --release
```

Then reinstall on your phone.

## 📱 Quick Connection Test

**From Phone Browser:**
```
http://10.96.102.50:8000/ping
```

**Expected Response:**
```json
{"status":"ok","message":"pong"}
```

If you see this, the backend is connected! ✅

## 🆘 Troubleshooting

### Issue: "Cannot reach server" on phone
**Solution:**
1. Ensure same Wi-Fi network
2. Check Windows Firewall allows Python on port 8000
3. Verify backend is running on `0.0.0.0:8000` (not just `127.0.0.1:8000`)

### Issue: Mobile app shows "Server timeout"
**Solution:**
1. Rebuild the app (config changes require rebuild)
2. Reinstall the APK on your phone
3. Verify config file has correct IP: `http://10.96.102.50:8000`

### Issue: Backend not accessible from network
**Solution:**
1. Ensure backend started with: `--host 0.0.0.0` (not `127.0.0.1`)
2. Check firewall rules
3. Verify router allows device-to-device communication

