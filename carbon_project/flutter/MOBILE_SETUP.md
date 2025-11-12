# 📱 Mobile Setup Guide - Carbon Footprint Flutter App

## ✅ Complete Flutter Application

This Flutter app works on:
- ✅ **Windows Desktop** (Laptop)
- ✅ **Android Mobile** (Vivo T2 Pro and other Android devices)
- ✅ **iOS** (if configured)

## 🚀 Running on Mobile Device

### Step 1: Enable USB Debugging on Your Phone

**For Vivo T2 Pro:**
1. Go to **Settings** → **About Phone**
2. Tap **"Build Number"** 7 times (you'll see "You are now a developer!")
3. Go back to **Settings** → **System** → **Developer Options**
4. Enable **"USB Debugging"**
5. Enable **"Install via USB"** (if available)

### Step 2: Connect Your Phone

1. Connect your phone via USB cable
2. On your phone, select **"File Transfer"** or **"PTP"** mode (not "Charging only")
3. When prompted, tap **"Allow USB Debugging"**
4. Check **"Always allow from this computer"**

### Step 3: Update API URL for Mobile

**Important:** For mobile devices, you need to use your computer's IP address instead of `localhost`.

1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.100`)

2. Update `lib/core/config/app_config.dart`:
   ```dart
   static const String baseUrl = 'http://192.168.1.100:8000';  // Your IP address
   ```

3. Make sure your backend is running and accessible:
   ```powershell
   cd "E:\Final Year Project\carbon_project\backend"
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Step 4: Run on Mobile

**Option 1: Use the script**
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
.\run_on_phone.ps1
```

**Option 2: Manual run**
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter devices  # Check if device is detected
flutter run      # Will auto-detect Android device
```

## 🖥️ Running on Windows Desktop

```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter run -d windows
```

## 📊 Calculator Features

The calculator includes:

1. **Step 1: Household Information**
   - Household size
   - Home size (sqft)

2. **Step 2: Energy Usage**
   - Electricity usage (kWh/month)
   - Heating energy source

3. **Step 3: Transportation**
   - Vehicle type
   - Monthly distance (km)

4. **Step 4: Climate & Lifestyle**
   - Climate zone
   - Meat consumption
   - Shopping frequency
   - Social activity

5. **Step 5: Consumption**
   - Monthly grocery bill

6. **Step 6: Review & Submit**
   - Review all information
   - Calculate carbon footprint

## 📈 Results Screen

After calculation, you'll see:
- **Total Carbon Footprint** (kg CO₂ per year)
- **Confidence Score**
- **Breakdown Chart** (by category)
- **Personalized Recommendations**

## 🔧 Troubleshooting

### Device Not Detected
1. Check USB connection
2. Restart ADB: `adb kill-server && adb start-server`
3. Check if USB debugging is enabled
4. Try different USB cable/port

### API Connection Failed
1. Make sure backend is running on `0.0.0.0:8000` (not just `localhost`)
2. Check firewall settings
3. Verify IP address is correct
4. Make sure phone and computer are on same network

### Build Errors
```powershell
flutter clean
flutter pub get
flutter run
```

## 📱 App Features

- ✅ Multi-step calculator form
- ✅ Real-time API integration
- ✅ Beautiful results visualization
- ✅ Personalized recommendations
- ✅ Works on desktop and mobile
- ✅ Responsive design

## 🎯 Next Steps

1. Enable USB debugging on your phone
2. Update API URL with your computer's IP
3. Connect phone and run the app
4. Test the calculator functionality
5. View results on your phone!

The calculator is fully functional and ready to use on both laptop and mobile! 🚀










