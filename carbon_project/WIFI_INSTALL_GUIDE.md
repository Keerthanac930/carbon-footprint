# 📱 Install App Over Wi-Fi (No USB Required)

## Method 1: Using the Download Server (Recommended)

### Step 1: Start the APK Server

1. Open PowerShell in the project directory
2. Run the server:
   ```powershell
   cd "E:\Final Year Project\carbon_project"
   .\start_apk_server.bat
   ```

### Step 2: Download on Your Phone

1. **Make sure your phone is on the same Wi-Fi network as your computer**
2. On your phone, open a web browser (Chrome, etc.)
3. Type the URL shown in the server window (e.g., `http://192.168.31.4:8080/info`)
4. Tap the "Download APK" button
5. Allow installation from unknown sources when prompted
6. Install the app

### Step 3: Generate QR Code (Optional)

1. Install QR code library (optional):
   ```powershell
   pip install qrcode[pil]
   ```

2. Generate QR code:
   ```powershell
   python generate_qr_code.py
   ```

3. Open the QR code image on your computer
4. Scan it with your phone's camera
5. Open the link and download the APK

## Method 2: Manual File Transfer

### Step 1: Build the APK

```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter build apk --release
```

### Step 2: Share the APK

1. Copy the APK file from:
   `flutter\build\app\outputs\flutter-apk\app-release.apk`

2. Share it via:
   - Email to yourself
   - Google Drive / Dropbox
   - WhatsApp Web
   - Cloud storage
   - Any file sharing method

3. Download on your phone and install

## Troubleshooting

### Server Not Accessible from Phone

1. **Check Wi-Fi Network**: Make sure phone and computer are on the same network
2. **Check Firewall**: Windows Firewall may be blocking port 8080
   - Temporarily disable firewall, or
   - Allow Python through firewall
3. **Check IP Address**: Use `ipconfig` to verify your computer's IP address
4. **Try Different Port**: Edit `serve_apk.py` and change `PORT = 8080` to another port (e.g., 8081)

### APK Won't Install

1. **Enable Unknown Sources**:
   - Go to Settings → Security
   - Enable "Install from unknown sources" or "Allow installation from unknown sources"
2. **Check Android Version**: Some newer Android versions require additional permissions
3. **Storage Space**: Make sure you have enough storage space

### Backend Connection

After installing the app:
1. Make sure backend is running: `http://192.168.31.4:8000`
2. Make sure phone and computer are on the same Wi-Fi network
3. The app should connect automatically

## Quick Start

1. **Start backend** (if not already running):
   ```powershell
   cd "E:\Final Year Project\carbon_project\backend"
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Start APK server**:
   ```powershell
   cd "E:\Final Year Project\carbon_project"
   .\start_apk_server.bat
   ```

3. **On your phone**: Open the URL shown in the server window and download the APK

4. **Install and enjoy!**

## Notes

- The APK server runs on port 8080
- The backend API runs on port 8000
- Both need to be accessible from your phone's Wi-Fi network
- No USB connection required!

