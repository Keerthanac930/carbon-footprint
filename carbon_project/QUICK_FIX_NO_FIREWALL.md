# Quick Fix: Connect Mobile App Without Firewall Changes

## Method 1: Test from Phone Browser First (Easiest)

1. **On your phone**, open a web browser (Chrome, etc.)
2. **Type this URL**: `http://192.168.31.4:8000/docs`
3. **If it loads** → The connection works! The issue is with the app configuration.
4. **If it doesn't load** → Use Method 2 (ngrok) below

## Method 2: Use Ngrok (No Firewall Changes Needed)

### Step 1: Install Ngrok

1. Download ngrok from: https://ngrok.com/download
2. Extract `ngrok.exe` to: `E:\Final Year Project\carbon_project\`
3. Or add ngrok to your system PATH

### Step 2: Start Backend and Ngrok

1. Open PowerShell in: `E:\Final Year Project\carbon_project\`
2. Run: `.\start_with_ngrok.bat`
3. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

### Step 3: Update Flutter Config

1. Open: `carbon_project\flutter\assets\config\server_config.json`
2. Change the URL to your ngrok URL:
   ```json
   {
     "apiBaseUrl": "https://abc123.ngrok.io"
   }
   ```
3. Save the file

### Step 4: Rebuild Flutter App

```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter clean
flutter pub get
flutter run -d <your-device-id>
```

## Method 3: Use USB Tethering (Alternative)

If your phone supports USB tethering:

1. Connect phone via USB
2. Enable USB tethering on phone
3. Your computer will get a new IP address
4. Update `server_config.json` with the new IP
5. Run the app

## Method 4: Use Mobile Hotspot

1. Turn on mobile hotspot on your phone
2. Connect your computer to the phone's hotspot
3. Get the computer's IP on the hotspot network
4. Update `server_config.json` with that IP
5. Run the app

## Quick Test

To test if your phone can reach the backend:

**On your phone's browser**, open:
- `http://192.168.31.4:8000/docs` (should show API docs)
- `http://192.168.31.4:8000/ping` (should show `{"status":"ok","message":"pong"}`)

If these work, the connection is fine and the issue is with the app timeout settings.

