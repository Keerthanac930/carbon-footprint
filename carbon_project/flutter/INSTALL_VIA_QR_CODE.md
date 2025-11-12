# 📱 Install Mobile App via QR Code

This guide will help you build the APK, generate a QR code, and install the app on your mobile device wirelessly.

## 🚀 Quick Start

### Option 1: Automated Script (Easiest)

1. **Double-click this file:**
   ```
   build_and_serve_apk_qr.bat
   ```

2. **Wait for the build to complete** (5-10 minutes on first build)

3. **Scan the QR code** that appears in the `carbon_project` folder

4. **Download and install** the APK on your phone

---

### Option 2: Manual Steps

#### Step 1: Build the APK

```bash
cd carbon_project/flutter
flutter build apk --release
```

#### Step 2: Generate QR Code

```bash
cd carbon_project
python generate_qr_code.py
```

This will create `apk_download_qr.png` in the `carbon_project` folder.

#### Step 3: Start the Download Server

```bash
python serve_apk.py
```

#### Step 4: Scan and Install

1. Open the QR code image (`apk_download_qr.png`) on your computer
2. Scan it with your phone's camera
3. Open the link in your phone's browser
4. Tap "Download APK"
5. Allow installation from unknown sources when prompted
6. Install the app

---

## 📋 Prerequisites

### 1. Install Python Dependencies

```bash
pip install qrcode[pil]
```

### 2. Ensure Both Devices are on Same Wi-Fi

- Your computer and phone must be on the same Wi-Fi network
- Check that your firewall allows connections on port 8080

### 3. Build Requirements

- Flutter SDK installed and configured
- Android SDK installed
- Java JDK installed

---

## 🔧 Troubleshooting

### QR Code Not Generating

**Problem:** `qrcode` library not installed

**Solution:**
```bash
pip install qrcode[pil]
```

### Server Not Starting

**Problem:** Port 8080 already in use

**Solution:**
1. Close any application using port 8080
2. Or modify `PORT = 8080` in `serve_apk.py` to use a different port

### Cannot Access from Phone

**Problem:** Firewall blocking connection

**Solution:**
1. Allow Python through Windows Firewall
2. Or temporarily disable firewall for testing
3. Ensure both devices are on the same Wi-Fi network

### APK Not Found

**Problem:** APK hasn't been built yet

**Solution:**
```bash
cd carbon_project/flutter
flutter build apk --release
```

### Installation Blocked

**Problem:** Android blocks installation from unknown sources

**Solution:**
1. Go to Settings > Security (or Settings > Apps > Special access)
2. Enable "Install unknown apps" or "Install apps from unknown sources"
3. Select your browser and allow installations

---

## 📱 Alternative Installation Methods

### Method 1: Direct URL Access

1. Note the IP address shown when you run `serve_apk.py`
2. On your phone, open a browser and go to:
   ```
   http://YOUR_IP:8080/info
   ```
3. Tap "Download APK"

### Method 2: USB Installation

If QR code doesn't work, use USB:

```bash
cd carbon_project/flutter
flutter install
```

Or use the batch file:
```
build_and_install.bat
```

### Method 3: Share APK File

1. Copy the APK file to your phone via USB, email, or cloud storage
2. Open the APK file on your phone
3. Install when prompted

APK location:
```
carbon_project/flutter/build/app/outputs/flutter-apk/app-release.apk
```

---

## 🎯 What Happens After Installation

1. **Open the app** from your app drawer
2. **Splash screen** will appear for 2 seconds
3. **Login screen** will appear (if not logged in)
4. **Register or login** to start using the app

---

## 🔍 Verify Installation

After installation, you should see:
- ✅ App icon in app drawer: "Carbon Footprint Calculator"
- ✅ App opens without errors
- ✅ Splash screen displays
- ✅ Can navigate to login/register screen

---

## 💡 Tips

1. **First Build:** The first build takes 5-10 minutes. Subsequent builds are faster.

2. **Network Speed:** Ensure good Wi-Fi connection for faster download

3. **Storage Space:** Ensure your phone has at least 50MB free space

4. **Battery:** Keep your phone plugged in during installation if possible

5. **Permissions:** The app may request permissions for:
   - Internet access (for API calls)
   - Camera (for OCR bill scanning)
   - Microphone (for voice assistant)
   - Storage (for saving data)

---

## 🆘 Still Having Issues?

1. **Check Console Output:** Look for error messages in the terminal
2. **Verify Backend:** Ensure backend server is running (not required for installation, but needed for app functionality)
3. **Check Network:** Ping your computer from your phone to verify connectivity
4. **Try Different Browser:** Some browsers handle APK downloads better than others

---

## 📞 Quick Reference

**APK Location:**
```
carbon_project/flutter/build/app/outputs/flutter-apk/app-release.apk
```

**QR Code Location:**
```
carbon_project/apk_download_qr.png
```

**Server URL Format:**
```
http://YOUR_IP:8080/info
http://YOUR_IP:8080/download
```

**Default Port:** 8080

**Scripts:**
- `build_and_serve_apk_qr.bat` - Build, generate QR, and serve APK
- `serve_apk.py` - Serve APK over HTTP
- `generate_qr_code.py` - Generate QR code for download URL

---

**Happy Installing! 🎉**

