#!/usr/bin/env python3
"""
Simple database setup script for Carbon Footprint Application
"""

import os
import sys
import pymysql
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import engine, create_tables

def create_database():
    """Create the database if it doesn't exist"""
    # Database configuration
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "")
    db_name = os.getenv("DB_NAME", "carbon_footprint_db")
    
    try:
        # Connect to MySQL server (without specifying database)
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ Database '{db_name}' created or already exists")
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def run_schema_sql():
    """Run the schema SQL file"""
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "")
    db_name = os.getenv("DB_NAME", "carbon_footprint_db")
    
    try:
        # Connect to the specific database
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name,
            charset='utf8mb4'
        )
        
        # Read and execute schema.sql
        schema_file = os.path.join(os.path.dirname(__file__), "..", "database", "schema.sql")
        
        if not os.path.exists(schema_file):
            print(f"❌ Schema file not found: {schema_file}")
            return False
        
        with open(schema_file, 'r', encoding='utf-8') as file:
            schema_sql = file.read()
        
        with connection.cursor() as cursor:
            # Split by semicolon and execute each statement
            statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
            
            for statement in statements:
                if statement:
                    try:
                        cursor.execute(statement)
                        print(f"✅ Executed: {statement[:50]}...")
                    except Exception as e:
                        print(f"⚠️  Warning executing statement: {e}")
                        print(f"   Statement: {statement[:100]}...")
            
            connection.commit()
            print("✅ Schema SQL executed successfully")
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error running schema SQL: {e}")
        return False

def create_tables_sqlalchemy():
    """Create tables using SQLAlchemy"""
    try:
        create_tables()
        print("✅ Tables created using SQLAlchemy")
        return True
    except Exception as e:
        print(f"❌ Error creating tables with SQLAlchemy: {e}")
        return False

def test_connection():
    """Test database connection"""
    try:
        # Test connection
        with engine.connect() as connection:
            result = connection.execute("SELECT 1 as test")
            print("✅ Database connection test successful")
            return True
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Simple Carbon Footprint Database...")
    print("=" * 60)
    
    # Step 1: Create database
    print("\n1. Creating database...")
    if not create_database():
        print("❌ Failed to create database. Exiting.")
        return False
    
    # Step 2: Run schema SQL
    print("\n2. Running schema SQL...")
    if not run_schema_sql():
        print("❌ Failed to run schema SQL. Exiting.")
        return False
    
    # Step 3: Create tables with SQLAlchemy (as backup)
    print("\n3. Creating tables with SQLAlchemy...")
    if not create_tables_sqlalchemy():
        print("⚠️  SQLAlchemy table creation failed, but schema SQL should have worked")
    
    # Step 4: Test connection
    print("\n4. Testing connection...")
    if not test_connection():
        print("❌ Connection test failed")
        return False
    
    print("\n" + "=" * 60)
    print("🎉 Simple database setup completed successfully!")
    print("\nNext steps:")
    print("1. Run the FastAPI application: uvicorn app.main:app --reload")
    print("2. Access the API documentation at: http://localhost:8000/docs")
    print("3. Test the simple authentication endpoints")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

