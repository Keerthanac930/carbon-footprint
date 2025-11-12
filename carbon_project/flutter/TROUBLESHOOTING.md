# Troubleshooting Guide - Mobile App Not Showing

## ✅ Fixed Issues

### 1. Duplicate Provider Dependency
**Problem**: The `pubspec.yaml` had a duplicate `provider` dependency which prevented the app from building.

**Solution**: ✅ Fixed - Removed duplicate entry.

### 2. Splash Screen Navigation
**Problem**: Splash screen wasn't checking authentication status before navigating.

**Solution**: ✅ Fixed - Now checks auth status and navigates to home if authenticated, or login if not.

## 🔧 Steps to Fix "App Not Showing" Issue

### Step 1: Clean and Rebuild
```bash
cd carbon_project/flutter
flutter clean
flutter pub get
flutter run
```

### Step 2: Check for Connected Devices
```bash
flutter devices
```

Make sure your mobile device is listed. If not:
- Enable USB debugging on Android
- Trust the computer on iOS
- Check USB cable connection

### Step 3: Check Backend Connection
Ensure your backend server is running:
```bash
cd carbon_project/backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Verify Server Configuration
Check `assets/config/server_config.json`:
```json
{
  "apiBaseUrl": "http://192.168.31.4:8000"
}
```

**For Android Emulator**: Use `http://10.0.2.2:8000`
**For Physical Device**: Use your computer's LAN IP (e.g., `http://192.168.31.4:8000`)

### Step 5: Check Logs
Run the app with verbose logging:
```bash
flutter run -v
```

Look for errors in the console output.

## 🐛 Common Issues

### Issue: Blank Screen
**Possible Causes**:
1. App crashed on startup
2. Missing dependencies
3. Navigation error

**Solution**:
- Check console for error messages
- Verify all dependencies are installed: `flutter pub get`
- Check if splash screen is showing

### Issue: App Crashes Immediately
**Possible Causes**:
1. Missing permissions
2. Backend connection error
3. Secure storage initialization error

**Solution**:
- Check AndroidManifest.xml for permissions
- Verify backend is accessible
- Check secure storage initialization

### Issue: Stuck on Splash Screen
**Possible Causes**:
1. Navigation not working
2. Auth check hanging
3. Backend timeout

**Solution**:
- Check if backend is running
- Verify network connectivity
- Check console for timeout errors

### Issue: "Backend not reachable" Error
**Possible Causes**:
1. Backend server not running
2. Wrong IP address in config
3. Firewall blocking connection
4. Not on same network (for physical devices)

**Solution**:
1. Start backend server
2. Verify IP address in `server_config.json`
3. Check firewall settings
4. Ensure mobile device and computer are on same WiFi network

## 📱 Platform-Specific Issues

### Android
1. **USB Debugging**: Enable in Developer Options
2. **Permissions**: Check AndroidManifest.xml
3. **Network Security**: For Android 9+, add network security config

### iOS
1. **Trust Computer**: Trust the computer when prompted
2. **Developer Account**: May need Apple Developer account for physical devices
3. **Network Permissions**: Check Info.plist for network permissions

## 🔍 Debugging Steps

1. **Check Flutter Doctor**:
   ```bash
   flutter doctor -v
   ```

2. **Check Build**:
   ```bash
   flutter build apk --debug  # For Android
   flutter build ios --debug   # For iOS
   ```

3. **Check Logs**:
   ```bash
   flutter logs
   ```

4. **Run in Debug Mode**:
   ```bash
   flutter run --debug
   ```

## ✅ Verification Checklist

- [ ] Flutter doctor shows no critical issues
- [ ] `flutter pub get` completed successfully
- [ ] Backend server is running
- [ ] Server config has correct IP address
- [ ] Mobile device is connected and recognized
- [ ] App builds without errors
- [ ] Splash screen appears
- [ ] Navigation works (splash → login/home)

## 🆘 Still Not Working?

1. **Check Console Output**: Look for red error messages
2. **Check Device Logs**: Use `adb logcat` for Android or Xcode console for iOS
3. **Try Clean Build**: `flutter clean && flutter pub get && flutter run`
4. **Check Network**: Ensure backend is accessible from mobile device
5. **Verify Dependencies**: All packages should be installed correctly

## 📞 Quick Test

Run this to verify everything is set up:
```bash
cd carbon_project/flutter
flutter clean
flutter pub get
flutter doctor
flutter devices
flutter run
```

If all commands succeed, the app should launch on your device!

