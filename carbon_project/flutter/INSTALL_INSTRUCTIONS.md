# How to Install the App on Your Phone

## Method 1: Direct USB Installation (Easiest - Recommended)

### Quick Install (One Command)
Simply double-click:
- **`install_via_usb.bat`** (Windows Batch file)
- **`install_via_usb.ps1`** (PowerShell script)

Or run manually:
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter install
```

This will:
1. Check for connected devices
2. Build APK if needed
3. Install directly to your phone

### Manual Steps

#### Step 1: Connect Your Phone
1. Connect your phone to computer via USB
2. Enable USB debugging on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings → Developer Options
   - Enable "USB Debugging"
3. Allow USB debugging when prompted on your phone

#### Step 2: Build the APK (if not already built)
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter build apk --release
```

#### Step 3: Install to Device
```powershell
flutter install
```

Or install to specific device:
```powershell
flutter install --device-id=10BD960RCE0003P
```

To find your device ID:
```powershell
flutter devices
```

## Method 2: Manual File Transfer (No USB Debugging Required)

### Step 1: Build the APK
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter build apk
```

### Step 2: Copy APK to Phone
1. The APK will be at: `build\app\outputs\flutter-apk\app-release.apk`
2. Copy this file to your phone (via USB file transfer or email/cloud)
3. On your phone, open the APK file
4. Allow installation from unknown sources if prompted
5. Install the app

## Method 3: Using Flutter Run (Development Mode)

```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter run -d <device-id>
```

To find your device ID:
```powershell
flutter devices
```

## Troubleshooting

### If build is slow:
- First build can take 5-10 minutes
- Use `flutter build apk --debug` for faster builds (but larger file size)

### If installation fails:
1. Make sure USB debugging is enabled on your phone
2. Check device connection: `flutter devices`
3. Try uninstalling old version first: `flutter uninstall`
4. Make sure you allowed USB debugging when prompted on phone
5. Try unplugging and reconnecting USB cable
6. Restart ADB (if using ADB directly):
   ```powershell
   adb kill-server
   adb start-server
   ```

### If ADB not found (for manual ADB usage):
ADB is usually located at: `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe`

Or use Flutter's built-in install command (recommended):
```powershell
flutter install
```

This doesn't require ADB to be in PATH.

