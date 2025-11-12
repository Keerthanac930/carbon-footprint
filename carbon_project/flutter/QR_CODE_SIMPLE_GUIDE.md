# 📱 QR Code - Simple Guide

## ❓ Do I Need to Create a New QR Code Each Time?

### ✅ **Short Answer: NO!**

You can **reuse the same QR code** as long as:
- Your computer's IP address hasn't changed
- You're on the same Wi-Fi network
- The server is running on the same port (8080)

### 🔄 **When You Need a New QR Code:**

Only regenerate if:
- ❌ Your IP address changed
- ❌ You're on a different Wi-Fi network
- ❌ The QR code stops working

---

## 🚀 Quick Check (Recommended)

Before serving the APK, run this to automatically check:

```bash
python check_and_regenerate_qr.py
```

**This will:**
- ✅ Check if your IP changed
- ✅ Auto-regenerate QR code only if needed
- ✅ Tell you if your existing QR code still works

---

## 📋 Common Scenarios

### Scenario 1: Same Day, Same Network
- ✅ **Use existing QR code**
- ✅ Just start server: `python serve_apk.py`
- ❌ **No need to regenerate**

### Scenario 2: Next Day, Same Network
- ⚠️ **Check first:** `python check_and_regenerate_qr.py`
- ✅ If IP same → Use existing QR code
- 🔧 If IP changed → QR code auto-regenerated

### Scenario 3: Different Network
- 🔧 **Must regenerate:** `python generate_qr_code.py`
- ❌ Old QR code won't work (different IP)

---

## 🎯 Best Practice

### Before Serving APK:
1. Run: `python check_and_regenerate_qr.py`
2. Start server: `python serve_apk.py`
3. Use the QR code

### Daily Use:
- **First time:** Run the check script
- **Same day:** Reuse the same QR code
- **If QR stops working:** Run check script again

---

## 📍 QR Code File

**Location:** `carbon_project/apk_download_qr.png`

- ✅ This file stays the same until you regenerate
- ✅ You can save it, print it, share it
- ✅ Reuse it as long as IP hasn't changed

---

## 💡 Pro Tips

1. **Check Before Serving:** Always run `check_and_regenerate_qr.py` first
2. **Save the QR Code:** Once generated, you can reuse it
3. **Static IP:** Set a static IP on your router to avoid changes
4. **Server Warns You:** The server will warn if IP changed

---

## 🆘 Troubleshooting

### QR Code Not Working?

1. **Check IP:** Run `python check_and_regenerate_qr.py`
2. **Regenerate if needed:** Script will do it automatically
3. **Try direct URL:** Check server message for current IP
4. **Check network:** Ensure same Wi-Fi network

---

## ✅ Summary

| Situation | Action |
|-----------|--------|
| Same network, same day | ✅ Use existing QR code |
| Same network, next day | ⚠️ Check first, then use if IP same |
| Different network | 🔧 Regenerate QR code |
| QR code not working | 🔧 Check and regenerate |

---

## 🎉 Bottom Line

**You DON'T need to create a new QR code every time!**

- ✅ **Reuse** the same QR code file
- ⚠️ **Check** if IP changed (automatic script available)
- 🔧 **Regenerate** only if IP changed or QR doesn't work

**The QR code file (`apk_download_qr.png`) stays the same until you regenerate it!**

---

For more details, see: `QR_CODE_FAQ.md`

