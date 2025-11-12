# Quick USB Installation Guide

## Why is it taking so long?

The **first Flutter build** for Android can take **10-15 minutes** because it needs to:
1. Download Gradle dependencies (first time only)
2. Compile all Dart code
3. Build Android native libraries
4. Package everything into an APK

**Subsequent builds are much faster (1-2 minutes)!**

## Current Status

To check if the build is complete, run:
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
.\check_build_status.bat
```

## Installation Methods

### Method 1: Automatic (Recommended)
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter run -d 10BD960RCE0003P
```
This builds and installs automatically. Just wait for it to complete.

### Method 2: Build then Install
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
.\build_and_install.bat
```
This builds the APK first, then installs it.

### Method 3: If APK Already Built
If the APK is already built, install it directly:
```powershell
cd "E:\Final Year Project\carbon_project\flutter"
flutter install -d 10BD960RCE0003P
```

## Troubleshooting

### Build is taking too long
- **Normal**: First build takes 10-15 minutes
- **Check**: Make sure you have internet connection (Gradle downloads dependencies)
- **Check**: Make sure you have enough disk space
- **Wait**: Be patient, it will complete

### Device not found
```powershell
flutter devices
```
If device not shown:
1. Check USB connection
2. Enable USB debugging on phone
3. Allow USB debugging when prompted
4. Try different USB port/cable

### Build failed
- Check the error message in terminal
- Make sure Flutter is up to date: `flutter doctor`
- Try cleaning: `flutter clean`
- Then rebuild: `flutter run -d 10BD960RCE0003P`

### Installation failed
```powershell
# Uninstall old version first
adb uninstall com.example.carbon_footprint_flutter

# Then install again
flutter install -d 10BD960RCE0003P
```

## What to Expect

1. **Build starts** → You'll see "Building..." messages
2. **Gradle downloads** → May take 5-10 minutes (first time only)
3. **Compiling** → Dart code being compiled
4. **Building APK** → Packaging the app
5. **Installing** → APK being installed on phone
6. **Launching** → App opens automatically on phone

## Quick Commands

```powershell
# Check device
flutter devices

# Check build status
.\check_build_status.bat

# Build and install
flutter run -d 10BD960RCE0003P

# Just install (if APK exists)
flutter install -d 10BD960RCE0003P

# Clean and rebuild
flutter clean
flutter run -d 10BD960RCE0003P
```

## Be Patient!

The first build is always the slowest. Once it's done:
- ✅ App will be installed on your phone
- ✅ Future builds will be much faster
- ✅ You can use hot reload for instant updates

**Just wait for the build to complete!** 🚀

