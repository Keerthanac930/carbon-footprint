#!/usr/bin/env python3
"""Test if the backend can start without errors"""
import sys
import os

# Set UTF-8 encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all required modules can be imported"""
    try:
        print("Testing imports...")
        from app.main import app
        print("✓ App imported successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to import app: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_database():
    """Test database connection"""
    try:
        print("\nTesting database connection...")
        from app.database.connection import test_database_connection
        if test_database_connection():
            print("✓ Database connection successful")
            return True
        else:
            print("✗ Database connection failed")
            return False
    except Exception as e:
        print(f"✗ Database test error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Backend Startup Test")
    print("=" * 60)
    print()
    
    if test_imports():
        print("\n✓ All imports successful")
        test_database()
    else:
        print("\n✗ Import failed - check dependencies")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)

