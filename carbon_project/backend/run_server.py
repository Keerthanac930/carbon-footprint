#!/usr/bin/env python3
"""
Direct server startup script
"""
import sys
import os

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    import codecs
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("=" * 70)
    print(" " * 15 + "CARBON FOOTPRINT BACKEND SERVER")
    print("=" * 70)
    print()
    print("Starting server on http://0.0.0.0:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Ping Test: http://localhost:8000/ping")
    print()
    print("=" * 70)
    print("Press CTRL+C to stop the server")
    print("=" * 70)
    print()
    
    try:
        import uvicorn
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except Exception as e:
        print(f"\n\nERROR: Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        input("\nPress Enter to exit...")
        sys.exit(1)

