#!/usr/bin/env python3
"""
Script to add password_hash column to existing users table
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from app.database.connection import engine

print("=" * 60)
print("ADDING PASSWORD_HASH COLUMN TO USERS TABLE")
print("=" * 60)

with engine.connect() as conn:
    print("\n🔍 Checking current users table structure...")
    result = conn.execute(text("DESCRIBE users"))
    columns = [row[0] for row in result]
    print(f"\nCurrent columns: {', '.join(columns)}")
    
    if 'password_hash' in columns:
        print("\n✅ password_hash column already exists!")
    else:
        print("\n📝 Adding password_hash column...")
        try:
            # Add the missing column
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT ''
            """))
            conn.commit()
            print("✅ password_hash column added successfully!")
        except Exception as e:
            print(f"❌ Error adding column: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)
    
    print("\n✅ Final users table structure:")
    result = conn.execute(text("DESCRIBE users"))
    for row in result:
        print(f"   ✓ {row[0]}: {row[1]}")
    conn.commit()

print("\n" + "=" * 60)
print("✅ USERS TABLE FIXED!")
print("=" * 60)
print("\n🎯 You can now test registration again!")
print("The password_hash column is ready to use.")

