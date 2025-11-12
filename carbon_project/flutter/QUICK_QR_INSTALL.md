# 📱 Quick QR Code Installation Guide

## ✅ APK Built Successfully!

Your APK has been built and a QR code has been generated!

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Download Server

Run this command in the `carbon_project` folder:
```bash
python serve_apk.py
```

Or double-click: `build_and_serve_apk_qr.bat` (in the flutter folder)

### Step 2: Scan the QR Code

1. Open the QR code image: `carbon_project/apk_download_qr.png`
2. Scan it with your phone's camera
3. Open the link in your phone's browser

### Step 3: Download and Install

1. Tap "Download APK" button on the webpage
2. Allow installation from unknown sources when prompted
3. Install the app
4. Open the app from your app drawer

## 📍 QR Code Location

The QR code is saved at:
```
carbon_project/apk_download_qr.png
```

## 🌐 Server URLs

- **Download Page**: http://192.168.31.4:8080/info
- **Direct Download**: http://192.168.31.4:8080/download

## ⚠️ Important Notes

1. **Same Wi-Fi Network**: Your phone and computer must be on the same Wi-Fi network
2. **Firewall**: Allow Python through Windows Firewall if prompted
3. **Unknown Sources**: Enable "Install from unknown sources" on your Android device
4. **Server Running**: Keep the server running while downloading

## 🆘 Troubleshooting

### Cannot Access Server
- Check that both devices are on the same Wi-Fi
- Verify firewall settings
- Try accessing the URL directly in your phone's browser

### QR Code Not Scanning
- Open the QR code image on your computer screen
- Use your phone's camera app (not a QR scanner app)
- Ensure good lighting and the QR code is clearly visible

### Installation Blocked
- Go to Settings > Security > Install unknown apps
- Enable installation for your browser
- Try downloading again

## 🎉 Success!

Once installed, you can:
- Open the app from your app drawer
- Register or login
- Start calculating your carbon footprint!

---

**Need Help?** Check `INSTALL_VIA_QR_CODE.md` for detailed instructions.

