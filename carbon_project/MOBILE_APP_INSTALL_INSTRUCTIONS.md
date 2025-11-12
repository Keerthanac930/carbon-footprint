# 📱 Mobile App Installation - Complete Guide

## ✅ Current Status

**All servers are running and ready!**

- ✅ **Backend API**: Running on port 8000
- ✅ **Frontend Website**: Running on port 3000  
- ✅ **APK Download Server**: Running on port 8080
- ✅ **APK File**: Found and ready (21.65 MB)
- ✅ **QR Code**: Generated and ready

---

## 🌐 Your Network Information

**Your Computer's IP Address**: `10.53.180.50`

**Download URLs**:
- **Info Page**: http://10.53.180.50:8080/info
- **Direct Download**: http://10.53.180.50:8080/download
- **QR Code**: `carbon_project/apk_download_qr.png`

---

## 📱 How to Install on Your Phone

### Method 1: Using QR Code (Easiest)

1. **Open the QR code image** on your computer:
   - File location: `E:\Final Year Project\carbon_project\apk_download_qr.png`
   - Double-click to open it

2. **On your phone**:
   - Open your camera app
   - Point it at the QR code on your computer screen
   - Tap the notification/link that appears
   - OR use a QR code scanner app

3. **Download the APK**:
   - Your phone's browser will open
   - Tap the "⬇️ Download APK" button
   - The download will start

4. **Install the app**:
   - When download completes, tap the notification
   - If prompted, allow "Install from unknown sources"
   - Tap "Install"
   - Tap "Open" when done

### Method 2: Using Direct URL

1. **On your phone** (make sure it's on the same Wi-Fi network):
   - Open a web browser (Chrome, Firefox, etc.)
   - Type this URL: `http://10.53.180.50:8080/info`
   - Tap "⬇️ Download APK" button
   - Follow installation steps above

---

## 🔥 Important: Windows Firewall

If you get "Unable to open" or "Connection refused" on your phone:

### Option 1: Allow Through Firewall (Recommended)

1. **Open Windows Defender Firewall**:
   - Press `Win + R`
   - Type: `wf.msc`
   - Press Enter

2. **Create Inbound Rule**:
   - Click "Inbound Rules" → "New Rule"
   - Select "Port" → Next
   - Select "TCP" and enter port: `8080`
   - Select "Allow the connection" → Next
   - Check all profiles → Next
   - Name: "APK Server Port 8080"
   - Click "Finish"

### Option 2: Temporarily Disable Firewall (Quick Test)

1. Open Windows Security
2. Go to Firewall & network protection
3. Temporarily disable firewall for your network
4. **Remember to re-enable it after testing!**

---

## ✅ Pre-Installation Checklist

Before installing on your phone, verify:

- [ ] Your phone and computer are on the **same Wi-Fi network**
- [ ] APK server is running (check the command window)
- [ ] Backend server is running on port 8000
- [ ] You can access http://10.53.180.50:8080/info from your phone's browser
- [ ] Windows Firewall allows port 8080 (or is temporarily disabled)

---

## 🧪 Testing Connection from Phone

1. **On your phone's browser**, try:
   ```
   http://10.53.180.50:8080/info
   ```

2. **If you see the download page**: ✅ Everything is working!
3. **If you see "Unable to open"**: 
   - Check Wi-Fi network (must be same as computer)
   - Check Windows Firewall (see above)
   - Verify IP address hasn't changed

---

## 🔄 If IP Address Changes

If your computer's IP address changes:

1. **Regenerate QR code**:
   ```powershell
   cd "E:\Final Year Project\carbon_project"
   python check_and_regenerate_qr.py
   ```

2. **Or manually generate**:
   ```powershell
   python generate_qr_code.py
   ```

---

## 📋 Server Management

### Start APK Server
```powershell
cd "E:\Final Year Project\carbon_project"
python serve_apk.py
```

### Stop APK Server
- Press `CTRL+C` in the server window
- Or close the command window

### Check if Server is Running
```powershell
netstat -ano | findstr ":8080"
```

---

## 🆘 Troubleshooting

### "Unable to open" on Phone

**Causes**:
1. Phone and computer not on same Wi-Fi
2. Windows Firewall blocking port 8080
3. IP address changed
4. Server not running

**Solutions**:
1. ✅ Verify same Wi-Fi network
2. ✅ Allow port 8080 in Windows Firewall
3. ✅ Regenerate QR code if IP changed
4. ✅ Restart APK server

### APK Won't Install

**Causes**:
1. Unknown sources disabled
2. Insufficient storage
3. Corrupted download

**Solutions**:
1. ✅ Enable "Install from unknown sources" in Android settings
2. ✅ Free up storage space
3. ✅ Re-download the APK

### Can't Connect to Backend from App

**Causes**:
1. Backend not running
2. Wrong IP address in app
3. Firewall blocking port 8000

**Solutions**:
1. ✅ Start backend: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
2. ✅ Update app with correct IP: `10.53.180.50:8000`
3. ✅ Allow port 8000 in firewall

---

## 🎯 Quick Reference

| Service | Port | URL |
|---------|------|-----|
| Backend API | 8000 | http://10.53.180.50:8000 |
| Frontend | 3000 | http://localhost:3000 |
| APK Server | 8080 | http://10.53.180.50:8080/info |

---

## ✨ Success Indicators

You'll know everything is working when:

1. ✅ You can open http://10.53.180.50:8080/info on your phone
2. ✅ You see the download page with "⬇️ Download APK" button
3. ✅ APK downloads successfully (21.65 MB)
4. ✅ App installs without errors
5. ✅ App connects to backend API

---

## 📞 Need Help?

If you're still having issues:

1. Check the APK server window for error messages
2. Verify all servers are running
3. Test connection from phone browser first
4. Check Windows Firewall settings
5. Ensure same Wi-Fi network

---

**Last Updated**: Current IP: 10.53.180.50
**APK Size**: 21.65 MB
**Status**: ✅ Ready for installation

