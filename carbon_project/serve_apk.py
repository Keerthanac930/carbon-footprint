#!/usr/bin/env python3
"""
Simple HTTP server to serve APK file over Wi-Fi
Allows downloading the app on phone without USB
"""
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8080
# Try release APK first, fallback to debug APK
RELEASE_APK = Path(__file__).parent / "flutter" / "build" / "app" / "outputs" / "flutter-apk" / "app-release.apk"
DEBUG_APK = Path(__file__).parent / "flutter" / "build" / "app" / "outputs" / "flutter-apk" / "app-debug.apk"
APK_PATH = RELEASE_APK if RELEASE_APK.exists() else DEBUG_APK
APK_NAME = "carbon_footprint_app.apk"

class APKHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow download from mobile browsers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # Only add Content-Disposition for APK downloads, not for HTML pages
        if hasattr(self, '_is_apk_download') and self._is_apk_download:
            self.send_header('Content-Disposition', f'attachment; filename="{APK_NAME}"')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle CORS preflight requests from mobile browsers"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Max-Age', '3600')
        self.end_headers()

    def do_GET(self):
        if self.path == '/' or self.path == '/download':
            # Serve the APK file
            if APK_PATH.exists():
                file_size = APK_PATH.stat().st_size
                self.send_response(200)
                self.send_header('Content-Type', 'application/vnd.android.package-archive')
                self.send_header('Content-Disposition', f'attachment; filename="{APK_NAME}"')
                self.send_header('Content-Length', str(file_size))
                # Prevent caching on mobile browsers
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                self._is_apk_download = True
                self.end_headers()
                with open(APK_PATH, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'text/plain')
                self._is_apk_download = False
                self.end_headers()
                self.wfile.write(b'APK not found. Please build the APK first.')
        elif self.path == '/info':
            # Show download page
            self._is_apk_download = False
            html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Carbon Footprint App - Download</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }}
                    .container {{
                        background: rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        border-radius: 20px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                        max-width: 500px;
                    }}
                    h1 {{
                        margin-bottom: 10px;
                    }}
                    .download-btn {{
                        display: inline-block;
                        padding: 15px 30px;
                        background: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 10px;
                        font-size: 18px;
                        margin: 20px 0;
                        transition: background 0.3s;
                    }}
                    .download-btn:hover {{
                        background: #45a049;
                    }}
                    .download-btn:active {{
                        transform: scale(0.95);
                    }}
                    .qr-code {{
                        margin: 20px 0;
                    }}
                    .info {{
                        margin-top: 20px;
                        font-size: 14px;
                        opacity: 0.9;
                    }}
                    .status {{
                        margin-top: 15px;
                        padding: 10px;
                        border-radius: 5px;
                        font-size: 12px;
                    }}
                    .status.success {{
                        background: rgba(76, 175, 80, 0.3);
                    }}
                    .status.error {{
                        background: rgba(244, 67, 54, 0.3);
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📱 Carbon Footprint App</h1>
                    <p>Download and install the app on your phone</p>
                    <a href="/download" id="downloadLink" class="download-btn" download="{APK_NAME}">⬇️ Download APK</a>
                    <div id="status" class="status" style="display: none;"></div>
                    <div class="info">
                        <p><strong>File:</strong> {APK_NAME}</p>
                        <p><strong>Size:</strong> {APK_PATH.stat().st_size / (1024*1024):.2f} MB</p>
                        <p><strong>Instructions:</strong></p>
                        <ol style="text-align: left; display: inline-block;">
                            <li>Tap the download button above</li>
                            <li>Allow installation from unknown sources when prompted</li>
                            <li>Install the app</li>
                            <li>Open the app and enjoy!</li>
                        </ol>
                    </div>
                </div>
                <script>
                    // Enhanced download handling for mobile browsers
                    document.getElementById('downloadLink').addEventListener('click', function(e) {{
                        var statusDiv = document.getElementById('status');
                        statusDiv.style.display = 'block';
                        statusDiv.className = 'status';
                        statusDiv.textContent = 'Starting download...';
                        
                        // Force download on mobile browsers
                        var link = document.createElement('a');
                        link.href = '/download';
                        link.download = '{APK_NAME}';
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Show success message after a delay
                        setTimeout(function() {{
                            statusDiv.className = 'status success';
                            statusDiv.textContent = '✅ Download started! Check your downloads folder.';
                        }}, 1000);
                    }});
                    
                    // Auto-detect if download completed (for some browsers)
                    window.addEventListener('beforeunload', function() {{
                        // User is navigating away, download likely completed
                    }});
                </script>
            </body>
            </html>
            """
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self._is_apk_download = False
            self.end_headers()
            self.wfile.write(html.encode())
        else:
            self._is_apk_download = False
            super().do_GET()

def get_local_ip():
    """Get the local IP address"""
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def main():
    # Check if APK exists
    if not APK_PATH.exists():
        print("=" * 60)
        print("ERROR: APK file not found!")
        print("=" * 60)
        print(f"Expected path: {APK_PATH}")
        print("\nPlease build the APK first:")
        print("  cd flutter")
        print("  flutter build apk --release")
        print("  OR")
        print("  flutter build apk --debug")
        print("=" * 60)
        return

    # Get local IP
    local_ip = get_local_ip()
    url = f"http://{local_ip}:{PORT}/info"
    download_url = f"http://{local_ip}:{PORT}/download"
    
    # Check if QR code needs updating
    qr_code_path = Path(__file__).parent / "apk_download_qr.png"
    if qr_code_path.exists():
        # Check if IP in QR code matches current IP
        try:
            import json
            ip_file = Path(__file__).parent / ".last_ip_address.json"
            if ip_file.exists():
                with open(ip_file, 'r') as f:
                    data = json.load(f)
                    saved_ip = data.get('ip_address')
                    if saved_ip != local_ip:
                        print("=" * 60)
                        print("⚠️  WARNING: IP address has changed!")
                        print("=" * 60)
                        print(f"Old IP: {saved_ip}")
                        print(f"New IP: {local_ip}")
                        print("\n💡 Your QR code may not work with the new IP.")
                        print("💡 Run this to regenerate QR code:")
                        print("   python check_and_regenerate_qr.py")
                        print("=" * 60)
                        print()
        except:
            pass

    print("=" * 60)
    print("🚀 APK Download Server Started!")
    print("=" * 60)
    print(f"📱 Local IP: {local_ip}")
    print(f"🌐 Server URL: {url}")
    print(f"⬇️  Download URL: {download_url}")
    print("=" * 60)
    print("\n📋 Instructions:")
    print("1. Make sure your phone is on the same Wi-Fi network")
    print(f"2. On your phone's browser, open: {url}")
    print("   OR scan the QR code: apk_download_qr.png")
    print("3. Tap the download button to download the APK")
    print("4. Install the app on your phone")
    print("\n💡 Tip: If QR code doesn't work, check if IP changed:")
    print("   python check_and_regenerate_qr.py")
    print("=" * 60)
    print("\nPress Ctrl+C to stop the server")
    print("=" * 60)

    # Change to the directory containing the script
    os.chdir(Path(__file__).parent)

    # Start server - bind to all interfaces (0.0.0.0) for mobile access
    with socketserver.TCPServer(("0.0.0.0", PORT), APKHandler) as httpd:
        try:
            print(f"\n✅ Server listening on 0.0.0.0:{PORT}")
            print(f"✅ Accessible from any device on your network\n")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")
        except OSError as e:
            if "Address already in use" in str(e):
                print(f"\n❌ ERROR: Port {PORT} is already in use!")
                print(f"   Please close the application using port {PORT} or change PORT in serve_apk.py")
            else:
                print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    main()

