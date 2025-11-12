#!/usr/bin/env python3
"""
Simple server startup script that handles errors gracefully
"""
import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    try:
        print("=" * 60)
        print("🚀 Starting Carbon Footprint Backend Server")
        print("=" * 60)
        print()
        
        # Test database connection first
        print("📊 Testing database connection...")
        try:
            from app.database.connection import test_database_connection
            if test_database_connection():
                print("✅ Database connection successful")
            else:
                print("⚠️  Database connection failed, but continuing...")
        except Exception as e:
            print(f"⚠️  Database connection check failed: {e}")
            print("⚠️  Continuing anyway - server will start but database features may not work")
        
        print()
        print("🌐 Starting server on http://0.0.0.0:8000")
        print("📋 API Docs: http://localhost:8000/docs")
        print("🔗 Ping Test: http://localhost:8000/ping")
        print("=" * 60)
        print()
        
        # Start uvicorn
        import uvicorn
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Failed to start server: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check if port 8000 is already in use")
        print("2. Verify Python dependencies are installed: pip install -r requirements.txt")
        print("3. Check database connection settings")
        print("4. Make sure MySQL is running")
        sys.exit(1)

if __name__ == "__main__":
    main()

