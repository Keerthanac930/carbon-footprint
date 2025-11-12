@echo off
echo ========================================
echo Building and Installing App via USB
echo ========================================
echo.

cd /d "%~dp0"

echo [Step 1/3] Checking device connection...
flutter devices
echo.

echo [Step 2/3] Building APK (this may take 5-10 minutes on first build)...
echo Please wait...
echo.

flutter build apk --debug

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [Step 3/3] Installing APK on device...
echo.

$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    "%ANDROID_HOME%\platform-tools\adb.exe" install -r "build\app\outputs\flutter-apk\app-debug.apk"
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo Installation successful!
        echo ========================================
        echo.
        echo The app should now be on your phone.
        echo You can open it from the app drawer.
        echo.
    ) else (
        echo.
        echo ERROR: Installation failed!
        echo.
        echo Trying Flutter install method...
        flutter install -d 10BD960RCE0003P
    )
) else (
    echo ADB not found, using Flutter install...
    flutter install -d 10BD960RCE0003P
)

echo.
pause

