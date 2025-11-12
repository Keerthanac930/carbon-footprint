# 📱 QR Code FAQ - Do I Need to Regenerate?

## ❓ Quick Answer

**The QR code file stays the same, BUT you may need to regenerate it if your IP address changes.**

## 🔍 When You Need to Regenerate

### ✅ **You DON'T need to regenerate if:**
- You're using the same Wi-Fi network
- Your computer's IP address hasn't changed
- You're just restarting the server
- The QR code worked before and nothing changed

### ⚠️ **You DO need to regenerate if:**
- You changed Wi-Fi networks
- Your computer got a new IP address (DHCP lease expired)
- The server URL changed
- The QR code stops working

## 🎯 How to Check if You Need a New QR Code

### Option 1: Automatic Check (Recommended)

Run this script to automatically check and regenerate if needed:
```bash
python check_and_regenerate_qr.py
```

This will:
- Check your current IP address
- Compare it with the last saved IP
- Regenerate the QR code only if the IP changed
- Tell you if your existing QR code still works

### Option 2: Manual Check

1. **Check your current IP:**
   ```bash
   python -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(('8.8.8.8', 80)); print(s.getsockname()[0])"
   ```

2. **Check the QR code URL:**
   - Open the QR code image
   - The URL should be: `http://YOUR_IP:8080/info`
   - Compare with your current IP

3. **If they match:** ✅ QR code is still valid
4. **If they don't match:** 🔧 Regenerate the QR code

## 🔧 How to Regenerate QR Code

### Method 1: Automatic (Recommended)
```bash
python check_and_regenerate_qr.py
```

### Method 2: Manual
```bash
python generate_qr_code.py
```

### Method 3: Using the Batch Script
```bash
# This will build APK, generate QR, and start server
cd flutter
build_and_serve_apk_qr.bat
```

## 📍 QR Code File Location

The QR code is always saved to:
```
carbon_project/apk_download_qr.png
```

**Note:** This file gets overwritten when you regenerate, so you only need one QR code file at a time.

## 🚀 Best Practice Workflow

### Before Serving APK:
1. Run: `python check_and_regenerate_qr.py`
2. If IP changed, it will auto-regenerate
3. Start server: `python serve_apk.py`
4. Use the QR code to download

### Daily Use:
- **First time of the day:** Run `check_and_regenerate_qr.py`
- **During the day:** Use the same QR code (if same network)
- **If QR stops working:** Run `check_and_regenerate_qr.py` again

## 💡 Pro Tips

### Tip 1: Static IP Address
If you set a **static IP address** for your computer on your router, your IP won't change and you won't need to regenerate the QR code!

### Tip 2: Save the QR Code
Once generated, you can:
- Save it to your phone's photos
- Print it out
- Share it with others (as long as they're on the same network)

### Tip 3: Check Before Serving
Always run `check_and_regenerate_qr.py` before starting the server to ensure the QR code is valid.

## 🔄 IP Address Changes

### Why Does IP Change?
- **DHCP lease expired:** Router assigns new IP
- **Network reconnection:** Disconnected and reconnected to Wi-Fi
- **Router restart:** Router reassigns IPs
- **Different network:** Connected to different Wi-Fi

### How Often Does It Change?
- **Usually:** Once per day or when reconnecting
- **Rarely:** Multiple times per day (unstable network)
- **Never:** If using static IP

## 📱 Using the Same QR Code

### ✅ You Can Reuse If:
- Same Wi-Fi network
- Same IP address
- Server is running on same port (8080)

### Example Scenarios:

**Scenario 1: Same Day, Same Network**
- ✅ Use the same QR code
- Just start the server: `python serve_apk.py`

**Scenario 2: Next Day, Same Network**
- ⚠️ Check IP first: `python check_and_regenerate_qr.py`
- If IP changed, QR will be auto-regenerated
- If IP same, use existing QR code

**Scenario 3: Different Network**
- 🔧 Must regenerate: `python generate_qr_code.py`
- New QR code will have new IP address

## 🆘 Troubleshooting

### QR Code Not Working?

1. **Check if server is running:**
   ```bash
   python serve_apk.py
   ```

2. **Check if IP changed:**
   ```bash
   python check_and_regenerate_qr.py
   ```

3. **Try direct URL:**
   - Get your IP: Check server startup message
   - Open in browser: `http://YOUR_IP:8080/info`

4. **Check network:**
   - Ensure phone and computer on same Wi-Fi
   - Check firewall settings

## 📊 Summary

| Situation | Regenerate? | Why |
|-----------|-------------|-----|
| Same network, same day | ❌ No | IP usually doesn't change |
| Same network, next day | ⚠️ Check | IP might have changed |
| Different network | ✅ Yes | Different IP address |
| Server restarted | ❌ No | IP doesn't change |
| QR code not working | ✅ Yes | IP likely changed |

## 🎯 Quick Decision Tree

```
Start
  ↓
Is server running?
  ↓ No                    ↓ Yes
Start server          Check QR code works?
  ↓                      ↓ No           ↓ Yes
Run check script      Regenerate      Use existing
  ↓
IP changed?
  ↓ Yes          ↓ No
Regenerate      Use existing
```

---

## ✅ Bottom Line

**You don't need to regenerate every time!**

- ✅ **Reuse the QR code** if your IP hasn't changed
- ⚠️ **Check first** with `check_and_regenerate_qr.py`
- 🔧 **Regenerate only** if IP changed or QR doesn't work

**The QR code file stays the same until you regenerate it!**

