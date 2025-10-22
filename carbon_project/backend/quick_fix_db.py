#!/usr/bin/env python3
"""
Quick script to fix the database schema
Auto-runs without confirmation for quick fixing
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

print("🔧 Quick Database Fix")
print("=" * 60)

print("\n📦 Importing models...")
try:
    from app.database.connection import engine, Base
    from app.models.user import User, UserSession
    from app.models.carbon_footprint import CarbonFootprint, Recommendation, UserGoal, AuditLog
    print("✅ Models imported successfully")
except Exception as e:
    print(f"❌ Failed to import models: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n🔨 Creating/updating tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created/updated successfully")
except Exception as e:
    print(f"❌ Failed to create tables: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n📋 Database tables:")
for table in Base.metadata.sorted_tables:
    print(f"   ✓ {table.name}")

print("\n" + "=" * 60)
print("✅ DATABASE FIX COMPLETED!")
print("=" * 60)

