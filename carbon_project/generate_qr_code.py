#!/usr/bin/env python3
"""
Generate QR code for APK download URL
"""
import qrcode
import socket
from pathlib import Path

def get_local_ip():
    """Get the local IP address"""
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
    import json
    local_ip = get_local_ip()
    download_url = f"http://{local_ip}:8080/download"
    info_url = f"http://{local_ip}:8080/info"
    
    print("=" * 60)
    print("QR Code Generator for APK Download")
    print("=" * 60)
    print(f"Download URL: {download_url}")
    print(f"Info URL: {info_url}")
    print("=" * 60)
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(info_url)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    qr_path = Path(__file__).parent / "apk_download_qr.png"
    img.save(qr_path)
    
    # Save IP address for future checks
    ip_file = Path(__file__).parent / ".last_ip_address.json"
    with open(ip_file, 'w') as f:
        json.dump({'ip_address': local_ip}, f)
    
    print(f"\n✅ QR code saved to: {qr_path}")
    print(f"✅ IP address saved: {local_ip}")
    print("\n📱 Instructions:")
    print("1. Open the QR code image on your computer")
    print("2. Scan it with your phone's camera")
    print("3. Open the link in your phone's browser")
    print("4. Download and install the APK")
    print("\n💡 Tip: Run 'python check_and_regenerate_qr.py' to check if")
    print("   your IP changed and QR code needs updating.")
    print("=" * 60)

if __name__ == "__main__":
    try:
        import qrcode
        main()
    except ImportError:
        print("QR code library not installed.")
        print("Install it with: pip install qrcode[pil]")
        print("\nOr just use the URL directly in your phone's browser.")

