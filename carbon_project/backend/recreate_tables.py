#!/usr/bin/env python3
"""
Script to recreate database tables
This will drop existing tables and create new ones based on the models
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from app.database.connection import engine, Base, create_tables, drop_tables

def main():
    print("=" * 60)
    print("DATABASE TABLE RECREATION")
    print("=" * 60)
    
    response = input("\n⚠️  WARNING: This will DROP all existing tables and data!\nAre you sure you want to continue? (yes/no): ")
    
    if response.lower() != "yes":
        print("❌ Operation cancelled")
        return
    
    print("\n📦 Importing models...")
    try:
        from app.models.user import User, UserSession
        from app.models.carbon_footprint import CarbonFootprint, Recommendation, UserGoal, AuditLog
        print("✅ Models imported successfully")
    except Exception as e:
        print(f"❌ Failed to import models: {e}")
        return
    
    print("\n🗑️  Dropping existing tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("✅ Existing tables dropped")
    except Exception as e:
        print(f"⚠️  Warning while dropping tables: {e}")
    
    print("\n🔨 Creating new tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ New tables created successfully")
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return
    
    print("\n📋 Created tables:")
    for table in Base.metadata.sorted_tables:
        print(f"   - {table.name}")
        for column in table.columns:
            print(f"     • {column.name}: {column.type}")
    
    print("\n" + "=" * 60)
    print("✅ DATABASE RECREATION COMPLETED!")
    print("=" * 60)
    print("\n💡 You can now start the backend server and test registration/login")

if __name__ == "__main__":
    main()

