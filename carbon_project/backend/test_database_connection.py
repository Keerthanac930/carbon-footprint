"""
Test database connection and authentication flow
This script verifies that the database is connected and auth endpoints work correctly
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database.connection import engine, SessionLocal, create_tables
from app.models.user import User, UserSession
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, LoginRequest
from datetime import datetime

def test_database_connection():
    """Test if we can connect to MySQL database"""
    print("\n" + "="*70)
    print("Testing Database Connection")
    print("="*70)
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            
            # Check database name
            result = connection.execute(text("SELECT DATABASE()"))
            db_name = result.fetchone()[0]
            print(f"✅ Connected to database: {db_name}")
            
            # Check if users table exists
            result = connection.execute(text(
                "SELECT COUNT(*) FROM information_schema.tables "
                "WHERE table_schema = DATABASE() AND table_name = 'users'"
            ))
            table_exists = result.fetchone()[0]
            
            if table_exists:
                print("✅ 'users' table exists")
            else:
                print("⚠️  'users' table does not exist - will be created")
            
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\nPlease check:")
        print("1. MySQL server is running")
        print("2. Database 'carbon_footprint_db' exists")
        print("3. Username and password are correct")
        print("4. Connection string in app/database/connection.py is correct")
        return False

def test_create_tables():
    """Test creating database tables"""
    print("\n" + "="*70)
    print("Testing Table Creation")
    print("="*70)
    
    try:
        create_tables()
        print("✅ Tables created/verified successfully")
        
        # Verify tables exist
        with engine.connect() as connection:
            tables = ['users', 'user_sessions', 'carbon_footprints', 'recommendations']
            for table in tables:
                result = connection.execute(text(
                    f"SELECT COUNT(*) FROM information_schema.tables "
                    f"WHERE table_schema = DATABASE() AND table_name = '{table}'"
                ))
                exists = result.fetchone()[0]
                if exists:
                    print(f"  ✅ Table '{table}' exists")
                else:
                    print(f"  ⚠️  Table '{table}' missing")
        
        return True
    except Exception as e:
        print(f"❌ Table creation failed: {e}")
        return False

def test_user_registration():
    """Test user registration"""
    print("\n" + "="*70)
    print("Testing User Registration")
    print("="*70)
    
    db = SessionLocal()
    try:
        auth_service = AuthService(db)
        
        # Create test user data
        test_email = f"test_{datetime.now().timestamp()}@example.com"
        user_data = UserCreate(
            email=test_email,
            name="Test User",
            password="SecurePassword123!"
        )
        
        print(f"Registering user: {test_email}")
        
        # Register user
        user = auth_service.register(user_data)
        print(f"✅ User registered successfully!")
        print(f"   User ID: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Name: {user.name}")
        
        # Verify password is hashed in database
        db_user = db.query(User).filter(User.email == test_email).first()
        if db_user and db_user.password_hash:
            print(f"✅ Password is hashed: {db_user.password_hash[:30]}...")
        
        return user, test_email
        
    except Exception as e:
        print(f"❌ User registration failed: {e}")
        return None, None
    finally:
        db.close()

def test_user_login_correct(email, password):
    """Test user login with CORRECT credentials"""
    print("\n" + "="*70)
    print("Testing User Login - CORRECT Credentials")
    print("="*70)
    
    db = SessionLocal()
    try:
        auth_service = AuthService(db)
        
        login_data = LoginRequest(
            email=email,
            name="Test User",
            password=password
        )
        
        print(f"Logging in with: {email}")
        print(f"Password: {password}")
        
        # Attempt login
        response = auth_service.login(login_data)
        
        print("✅ Login successful!")
        print(f"   Session Token: {response.session_token[:30]}...")
        print(f"   User: {response.user.email}")
        print(f"   Expires: {response.expires_at}")
        
        return True
        
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return False
    finally:
        db.close()

def test_user_login_wrong_password(email):
    """Test user login with WRONG password"""
    print("\n" + "="*70)
    print("Testing User Login - WRONG Password (Should Fail)")
    print("="*70)
    
    db = SessionLocal()
    try:
        auth_service = AuthService(db)
        
        login_data = LoginRequest(
            email=email,
            name="Test User",
            password="WrongPassword123!"  # Wrong password
        )
        
        print(f"Logging in with: {email}")
        print(f"Password: WrongPassword123! (WRONG)")
        
        # Attempt login - should fail
        response = auth_service.login(login_data)
        
        print("❌ Login succeeded but it should have failed!")
        return False
        
    except Exception as e:
        if "Invalid email or password" in str(e):
            print(f"✅ Login correctly rejected: {e}")
            return True
        else:
            print(f"❌ Unexpected error: {e}")
            return False
    finally:
        db.close()

def test_user_login_nonexistent():
    """Test user login with non-existent email"""
    print("\n" + "="*70)
    print("Testing User Login - Non-Existent Email (Should Fail)")
    print("="*70)
    
    db = SessionLocal()
    try:
        auth_service = AuthService(db)
        
        login_data = LoginRequest(
            email="nonexistent@example.com",
            name="Nonexistent User",
            password="SomePassword123!"
        )
        
        print(f"Logging in with: nonexistent@example.com")
        
        # Attempt login - should fail
        response = auth_service.login(login_data)
        
        print("❌ Login succeeded but it should have failed!")
        print("   This means auto-registration is still enabled!")
        return False
        
    except Exception as e:
        if "Invalid email or password" in str(e):
            print(f"✅ Login correctly rejected: {e}")
            return True
        else:
            print(f"❌ Unexpected error: {e}")
            return False
    finally:
        db.close()

def test_duplicate_registration(email):
    """Test duplicate registration (should fail)"""
    print("\n" + "="*70)
    print("Testing Duplicate Registration (Should Fail)")
    print("="*70)
    
    db = SessionLocal()
    try:
        auth_service = AuthService(db)
        
        user_data = UserCreate(
            email=email,
            name="Test User",
            password="AnotherPassword123!"
        )
        
        print(f"Attempting to register duplicate email: {email}")
        
        # Attempt duplicate registration - should fail
        user = auth_service.register(user_data)
        
        print("❌ Duplicate registration succeeded but it should have failed!")
        return False
        
    except Exception as e:
        if "Email already registered" in str(e):
            print(f"✅ Duplicate registration correctly rejected: {e}")
            return True
        else:
            print(f"❌ Unexpected error: {e}")
            return False
    finally:
        db.close()

def cleanup_test_data(email):
    """Clean up test data"""
    print("\n" + "="*70)
    print("Cleaning Up Test Data")
    print("="*70)
    
    db = SessionLocal()
    try:
        # Delete test user
        user = db.query(User).filter(User.email == email).first()
        if user:
            db.delete(user)
            db.commit()
            print(f"✅ Cleaned up test user: {email}")
        
    except Exception as e:
        print(f"⚠️  Cleanup warning: {e}")
    finally:
        db.close()

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print(" DATABASE CONNECTION & AUTHENTICATION TEST SUITE")
    print("="*80)
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test 1: Database Connection
    if not test_database_connection():
        print("\n❌ Cannot proceed without database connection")
        return
    
    # Test 2: Create Tables
    if not test_create_tables():
        print("\n❌ Cannot proceed without tables")
        return
    
    # Test 3: User Registration
    user, test_email = test_user_registration()
    if not user:
        print("\n❌ Cannot proceed without successful registration")
        return
    
    # Test 4: Login with correct credentials
    login_success = test_user_login_correct(test_email, "SecurePassword123!")
    
    # Test 5: Login with wrong password
    wrong_pass_rejected = test_user_login_wrong_password(test_email)
    
    # Test 6: Login with non-existent email
    nonexistent_rejected = test_user_login_nonexistent()
    
    # Test 7: Duplicate registration
    duplicate_rejected = test_duplicate_registration(test_email)
    
    # Cleanup
    cleanup_test_data(test_email)
    
    # Summary
    print("\n" + "="*80)
    print(" TEST SUMMARY")
    print("="*80)
    
    results = {
        "Database Connection": True,
        "Table Creation": True,
        "User Registration": user is not None,
        "Login with Correct Password": login_success,
        "Reject Wrong Password": wrong_pass_rejected,
        "Reject Non-Existent User": nonexistent_rejected,
        "Reject Duplicate Email": duplicate_rejected
    }
    
    all_passed = all(results.values())
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("\n" + "="*80)
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("\nYour authentication system is working correctly:")
        print("✅ Database connection is working")
        print("✅ Users can register with hashed passwords")
        print("✅ Login ONLY works with correct credentials")
        print("✅ Wrong passwords are rejected")
        print("✅ Non-existent users are rejected")
        print("✅ Duplicate emails are rejected")
    else:
        print("⚠️  SOME TESTS FAILED")
        print("\nPlease check the failed tests above")
    
    print("="*80)

if __name__ == "__main__":
    main()

