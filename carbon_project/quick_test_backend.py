#!/usr/bin/env python3
"""Quick test to check if backend can import and start"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

print("Testing backend import...")
try:
    from app.main import app
    print("✅ Backend app imported successfully!")
    print(f"   App type: {type(app)}")
    print(f"   App title: {app.title}")
    print(f"   Routes: {[route.path for route in app.routes[:5]]}")  # First 5 routes
except Exception as e:
    print(f"❌ Failed to import backend: {e}")
    import traceback
    traceback.print_exc()

