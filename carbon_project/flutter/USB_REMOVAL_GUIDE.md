# 📱 Mobile App - USB Removal Guide

## ✅ Yes, Your App Works After Removing USB!

Once the app is **installed** on your phone, it runs **independently** and **does NOT need USB connection**.

## 🔌 What USB Was Used For

USB connection was only needed for:
1. **Installing the app** on your phone
2. **Transferring the APK file**

After installation, the app runs on your phone and doesn't need USB anymore.

## 🌐 Network Requirements

However, the app **DOES need network connectivity** to work properly:

### Required:
1. ✅ **Backend server running** on your computer
2. ✅ **Same Wi-Fi network** - Phone and computer must be on the same Wi-Fi
3. ✅ **Correct IP address** - App must know your computer's IP address

## 🔧 Configuration

### Current Configuration

The app is configured to connect to:
```
http://192.168.31.4:8000
```

This is your computer's local IP address on your Wi-Fi network.

### How to Check/Update IP Address

1. **Find your computer's IP address**:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" under your Wi-Fi adapter (usually starts with 192.168.x.x)

2. **Update the app configuration**:
   - File: `carbon_project/flutter/assets/config/server_config.json`
   - Update the `apiBaseUrl` with your current IP address
   - Example: `{"apiBaseUrl": "http://192.168.1.100:8000"}`

3. **Rebuild the app** (if IP changed):
   ```powershell
   cd carbon_project/flutter
   flutter build apk --release
   ```
   Then reinstall using the methods in `INSTALL_INSTRUCTIONS.md`

## ✅ Testing After USB Removal

1. **Disconnect USB cable**
2. **Make sure backend is running** on your computer:
   ```powershell
   cd "E:\Final Year Project\carbon_project\backend"
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. **Check Wi-Fi connection**:
   - Phone and computer must be on the same Wi-Fi network
4. **Open the app** on your phone
5. **Try logging in** - Should work if everything is configured correctly

## 🐛 Troubleshooting

### App Can't Connect to Backend

**Problem**: App shows connection errors or can't login

**Solutions**:
1. **Check backend is running**:
   - Open: http://localhost:8000/ping
   - Should show: `{"status": "ok", "message": "pong"}`

2. **Check IP address**:
   - Run `ipconfig` on your computer
   - Verify the IP matches the one in `server_config.json`
   - If IP changed, update config and rebuild app

3. **Check Wi-Fi network**:
   - Phone and computer must be on the same network
   - Try disconnecting and reconnecting to Wi-Fi

4. **Check firewall**:
   - Windows Firewall might be blocking port 8000
   - Allow Python through firewall or temporarily disable firewall

5. **Test connection from phone**:
   - Open browser on phone
   - Go to: `http://YOUR_COMPUTER_IP:8000/ping`
   - Should show: `{"status": "ok", "message": "pong"}`
   - If this doesn't work, the app won't work either

### IP Address Changes

**Problem**: IP address changes when you reconnect to Wi-Fi

**Solutions**:
1. **Use static IP** (recommended):
   - Set a static IP address for your computer on your router
   - This way the IP won't change

2. **Update config when IP changes**:
   - Update `server_config.json` with new IP
   - Rebuild and reinstall app

3. **Use hostname** (advanced):
   - Some routers allow using computer name instead of IP
   - Example: `http://YOUR-COMPUTER-NAME.local:8000`

## 📋 Quick Checklist

- [ ] App is installed on phone (USB not needed after this)
- [ ] Backend server is running on computer
- [ ] Phone and computer are on the same Wi-Fi network
- [ ] IP address in `server_config.json` matches computer's IP
- [ ] Firewall allows connections on port 8000
- [ ] Test connection: `http://YOUR_IP:8000/ping` works from phone browser

## 🚀 Production Deployment

For a production app that works anywhere (not just on your Wi-Fi):

1. **Deploy backend to cloud**:
   - Use services like Heroku, AWS, DigitalOcean, etc.
   - Update `server_config.json` with cloud server URL
   - Example: `{"apiBaseUrl": "https://your-api.herokuapp.com"}`

2. **Update app configuration**:
   - Change API base URL to cloud server
   - Rebuild and distribute app

## 📝 Summary

✅ **USB Removal**: App works fine after removing USB  
✅ **Network Required**: App needs Wi-Fi connection to backend  
✅ **Same Network**: Phone and computer must be on same Wi-Fi  
✅ **IP Address**: App must know your computer's IP address  
✅ **Backend Running**: Backend server must be running on computer  

---

**The app is fully functional after USB removal, as long as the backend is accessible over the network!**

