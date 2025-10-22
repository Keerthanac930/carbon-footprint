#!/usr/bin/env python3
"""
Simple test script to verify backend connection
"""
import requests

# Backend URL - must match the port configured in your backend server
BACKEND_URL = "http://localhost:8000"

def test_ping():
    """Test the /ping endpoint"""
    print("🔍 Testing /ping endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/ping", timeout=5)
        if response.status_code == 200:
            print("✅ Connection OK:", response.json())
            return True
        else:
            print(f"⚠️ Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed: Backend not reachable. Check if it's running.")
        return False
    except requests.exceptions.Timeout:
        print("⏳ Timeout: Backend took too long to respond.")
        return False
    except Exception as e:
        print("⚠️ Unexpected error:", e)
        return False

def test_health():
    """Test the /health endpoint"""
    print("\n🔍 Testing /health endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check OK:", response.json())
            return True
        else:
            print(f"⚠️ Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed: Backend not reachable.")
        return False
    except requests.exceptions.Timeout:
        print("⏳ Timeout: Backend took too long to respond.")
        return False
    except Exception as e:
        print("⚠️ Unexpected error:", e)
        return False

def test_auth_endpoints():
    """Test authentication endpoints availability"""
    print("\n🔍 Testing authentication endpoints...")
    
    # Test /auth/register
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json={"email": "test@test.com", "name": "Test", "password": "test123"},
            timeout=5
        )
        if response.status_code in [200, 201, 400, 422]:
            print("✅ /auth/register endpoint is accessible")
        else:
            print(f"⚠️ /auth/register returned status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot reach /auth/register endpoint")
    except Exception as e:
        print(f"⚠️ Error testing /auth/register: {e}")
    
    # Test /auth/login
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"email": "test@test.com", "password": "test123"},
            timeout=5
        )
        if response.status_code in [200, 400, 401, 422]:
            print("✅ /auth/login endpoint is accessible")
        else:
            print(f"⚠️ /auth/login returned status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot reach /auth/login endpoint")
    except Exception as e:
        print(f"⚠️ Error testing /auth/login: {e}")

def test_cors():
    """Test CORS configuration"""
    print("\n🌐 Testing CORS configuration...")
    origins_to_test = [
        'http://localhost:3000',
        'http://localhost:3001'
    ]
    
    for origin in origins_to_test:
        try:
            response = requests.options(
                f"{BACKEND_URL}/ping",
                headers={'Origin': origin},
                timeout=5
            )
            
            allow_origin = response.headers.get('Access-Control-Allow-Origin')
            if allow_origin == origin or allow_origin == '*':
                print(f"✅ CORS configured for {origin}")
            else:
                print(f"⚠️ CORS may not be configured for {origin}")
                print(f"   Received: {allow_origin}")
        except Exception as e:
            print(f"❌ Error testing CORS for {origin}: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 CARBON FOOTPRINT BACKEND CONNECTION TEST")
    print("=" * 60)
    print(f"\n📍 Backend URL: {BACKEND_URL}\n")
    
    # Test basic connectivity
    ping_ok = test_ping()
    
    if ping_ok:
        # If ping works, test other endpoints
        test_health()
        test_auth_endpoints()
        test_cors()
        
        print("\n" + "=" * 60)
        print("✅ BACKEND IS RUNNING AND ACCESSIBLE!")
        print("=" * 60)
        print("\n📋 Next steps:")
        print("1. Start your frontend: cd frontend && npm start")
        print("2. Open http://localhost:3000 in your browser")
        print("3. Try creating an account or signing in")
        print("\n💡 Frontend should connect to:", BACKEND_URL)
    else:
        print("\n" + "=" * 60)
        print("❌ BACKEND IS NOT RUNNING!")
        print("=" * 60)
        print("\n🚀 To start the backend server, run:")
        print("   cd backend")
        print("   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload")
        print("\n💡 Or use the batch file:")
        print("   cd carbon_project")
        print("   start_servers.bat")

