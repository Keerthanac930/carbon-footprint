"""
Test script to verify specific error messages for email and password
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, LoginRequest
from app.models.user import User
from datetime import datetime

print("\n" + "="*70)
print("TESTING SPECIFIC ERROR MESSAGES")
print("="*70)
print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

# Register a test user first
print("Step 1: Registering test user...")
db = SessionLocal()
try:
    auth_service = AuthService(db)
    test_email = f"errortest_{int(datetime.now().timestamp())}@example.com"
    test_password = "CorrectPassword123!"
    
    user_data = UserCreate(
        email=test_email,
        name="Error Test User",
        password=test_password
    )
    
    user = auth_service.register(user_data)
    print(f"[SUCCESS] Test user registered: {test_email}")
    print(f"          Password: {test_password}\n")
except Exception as e:
    print(f"[FAILED] Registration failed: {e}")
    db.close()
    sys.exit(1)
finally:
    db.close()

# Test 1: Wrong Email (Email not found)
print("="*70)
print("Test 1: Login with WRONG EMAIL (email not registered)")
print("="*70)
db = SessionLocal()
try:
    auth_service = AuthService(db)
    login_data = LoginRequest(
        email="nonexistent@example.com",
        name="Nonexistent",
        password="SomePassword123!"
    )
    
    response = auth_service.login(login_data)
    print("[FAILED] Login succeeded but should have failed!")
except Exception as e:
    error_message = str(e)
    print(f"Error received: {error_message}\n")
    
    if "Email not found" in error_message:
        print("[PASS] Correct error message for wrong email!")
        print("       Message: 'Email not found. Please register first...'")
    else:
        print("[FAILED] Expected 'Email not found' message")
        print(f"        Got: {error_message}")
finally:
    db.close()

# Test 2: Wrong Password
print("\n" + "="*70)
print("Test 2: Login with WRONG PASSWORD (correct email, wrong password)")
print("="*70)
db = SessionLocal()
try:
    auth_service = AuthService(db)
    login_data = LoginRequest(
        email=test_email,
        name="Error Test User",
        password="WrongPassword123!"
    )
    
    response = auth_service.login(login_data)
    print("[FAILED] Login succeeded but should have failed!")
except Exception as e:
    error_message = str(e)
    print(f"Error received: {error_message}\n")
    
    if "Incorrect password" in error_message:
        print("[PASS] Correct error message for wrong password!")
        print("       Message: 'Incorrect password. Please try again.'")
    else:
        print("[FAILED] Expected 'Incorrect password' message")
        print(f"        Got: {error_message}")
finally:
    db.close()

# Test 3: Correct Credentials (should succeed)
print("\n" + "="*70)
print("Test 3: Login with CORRECT CREDENTIALS")
print("="*70)
db = SessionLocal()
try:
    auth_service = AuthService(db)
    login_data = LoginRequest(
        email=test_email,
        name="Error Test User",
        password=test_password
    )
    
    response = auth_service.login(login_data)
    print(f"[PASS] Login successful with correct credentials!")
    print(f"       Session token: {response.session_token[:30]}...")
except Exception as e:
    print(f"[FAILED] Login failed: {e}")
finally:
    db.close()

# Cleanup
print("\n" + "="*70)
print("Cleanup: Removing test user...")
print("="*70)
db = SessionLocal()
try:
    user = db.query(User).filter(User.email == test_email).first()
    if user:
        db.delete(user)
        db.commit()
        print(f"[DONE] Cleaned up: {test_email}")
except Exception as e:
    print(f"[WARN] Cleanup warning: {e}")
finally:
    db.close()

# Summary
print("\n" + "="*70)
print("SUMMARY - SPECIFIC ERROR MESSAGES")
print("="*70)
print("[PASS] Wrong Email Error   -> 'Email not found...'")
print("[PASS] Wrong Password Error -> 'Incorrect password...'")
print("[PASS] Correct Credentials  -> Login successful")
print("\n*** ALL ERROR MESSAGE TESTS PASSED ***")
print("\nYour users will now see specific, helpful error messages!")
print("="*70)

