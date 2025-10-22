#!/usr/bin/env python3
"""
Script to fix the users table by dropping and recreating it
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from app.database.connection import engine, Base

print("=" * 60)
print("FIXING USERS TABLE")
print("=" * 60)

# Connect to database
with engine.connect() as conn:
    print("\n🔍 Checking current users table structure...")
    try:
        result = conn.execute(text("DESCRIBE users"))
        print("\nCurrent table structure:")
        for row in result:
            print(f"   {row[0]}: {row[1]}")
    except Exception as e:
        print(f"⚠️  Could not describe table: {e}")
    
    print("\n🗑️  Dropping users table...")
    try:
        # Drop the table
        conn.execute(text("DROP TABLE IF EXISTS users"))
        conn.commit()
        print("✅ Users table dropped")
    except Exception as e:
        print(f"❌ Error dropping table: {e}")
        sys.exit(1)

print("\n📦 Importing models...")
try:
    from app.models.user import User, UserSession
    from app.models.carbon_footprint import CarbonFootprint, Recommendation, UserGoal, AuditLog
    print("✅ Models imported")
except Exception as e:
    print(f"❌ Failed to import models: {e}")
    sys.exit(1)

print("\n🔨 Creating users table with correct schema...")
try:
    # Create only the users table
    User.__table__.create(engine, checkfirst=True)
    print("✅ Users table created successfully")
except Exception as e:
    print(f"❌ Failed to create table: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Verify the new structure
with engine.connect() as conn:
    print("\n✅ New users table structure:")
    result = conn.execute(text("DESCRIBE users"))
    for row in result:
        print(f"   ✓ {row[0]}: {row[1]}")
    conn.commit()

print("\n" + "=" * 60)
print("✅ USERS TABLE FIXED!")
print("=" * 60)
print("\nYou can now test registration again!")

