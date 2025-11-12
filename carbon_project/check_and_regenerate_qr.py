#!/usr/bin/env python3
"""
Check if IP address changed and regenerate QR code if needed
"""
import socket
import json
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

def get_saved_ip():
    """Get the last saved IP address"""
    ip_file = Path(__file__).parent / ".last_ip_address.json"
    if ip_file.exists():
        try:
            with open(ip_file, 'r') as f:
                data = json.load(f)
                return data.get('ip_address')
        except:
            return None
    return None

def save_ip(ip):
    """Save the current IP address"""
    ip_file = Path(__file__).parent / ".last_ip_address.json"
    with open(ip_file, 'w') as f:
        json.dump({'ip_address': ip}, f)

def main():
    current_ip = get_local_ip()
    saved_ip = get_saved_ip()
    
    print("=" * 60)
    print("IP Address Checker for QR Code")
    print("=" * 60)
    print(f"Current IP: {current_ip}")
    
    if saved_ip:
        print(f"Last saved IP: {saved_ip}")
        if current_ip == saved_ip:
            print("\n✅ IP address hasn't changed!")
            print("✅ Your existing QR code will work fine.")
            print("\nYou can use the existing QR code:")
            print(f"   carbon_project/apk_download_qr.png")
        else:
            print("\n⚠️  IP address has changed!")
            print("⚠️  Your existing QR code won't work.")
            print("\n🔧 Regenerating QR code with new IP...")
            print()
            
            # Import and run the QR code generator
            try:
                import generate_qr_code
                generate_qr_code.main()
                save_ip(current_ip)
                print("\n✅ New QR code generated successfully!")
                print("✅ New QR code saved to: carbon_project/apk_download_qr.png")
            except Exception as e:
                print(f"\n❌ Error generating QR code: {e}")
                print("Please run: python generate_qr_code.py")
    else:
        print("\n📝 No saved IP address found.")
        print("🔧 Generating QR code for the first time...")
        print()
        
        try:
            import generate_qr_code
            generate_qr_code.main()
            save_ip(current_ip)
            print("\n✅ QR code generated successfully!")
        except Exception as e:
            print(f"\n❌ Error generating QR code: {e}")
            print("Please run: python generate_qr_code.py")
    
    print("\n" + "=" * 60)
    print("💡 Tip: Run this script before serving the APK to ensure")
    print("   your QR code is up-to-date with your current IP address.")
    print("=" * 60)

if __name__ == "__main__":
    main()

