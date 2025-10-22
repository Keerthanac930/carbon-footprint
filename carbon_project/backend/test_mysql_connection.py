#!/usr/bin/env python3
"""
Simple MySQL Connection Test Script
Run this to test your MySQL connection before setting up the full database
"""

import pymysql
import os
from dotenv import load_dotenv

def test_mysql_connection():
    """Test basic MySQL connection"""
    print("🧪 Testing MySQL Connection...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Database configuration
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "")
    db_name = os.getenv("DB_NAME", "carbon_footprint_db")
    
    print(f"📊 Connection Details:")
    print(f"   Host: {db_host}")
    print(f"   Port: {db_port}")
    print(f"   User: {db_user}")
    print(f"   Database: {db_name}")
    print(f"   Password: {'*' * len(db_password) if db_password else '(empty)'}")
    print()
    
    try:
        # Test connection to MySQL server (without database)
        print("1️⃣ Testing MySQL server connection...")
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            charset='utf8mb4'
        )
        print("✅ MySQL server connection successful!")
        
        with connection.cursor() as cursor:
            # Test basic query
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"   MySQL Version: {version[0]}")
            
            # Check if database exists
            cursor.execute("SHOW DATABASES LIKE %s", (db_name,))
            db_exists = cursor.fetchone()
            
            if db_exists:
                print(f"✅ Database '{db_name}' exists")
            else:
                print(f"⚠️  Database '{db_name}' does not exist")
                print("   You can create it manually in MySQL Workbench or run the setup script")
        
        connection.close()
        
        # Test connection to specific database (if it exists)
        if db_exists:
            print("\n2️⃣ Testing database connection...")
            connection = pymysql.connect(
                host=db_host,
                port=db_port,
                user=db_user,
                password=db_password,
                database=db_name,
                charset='utf8mb4'
            )
            print("✅ Database connection successful!")
            
            with connection.cursor() as cursor:
                # Check tables
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                
                if tables:
                    print(f"   Found {len(tables)} tables:")
                    for table in tables:
                        print(f"   - {table[0]}")
                else:
                    print("   No tables found - run the schema setup")
            
            connection.close()
        
        print("\n🎉 MySQL connection test completed successfully!")
        return True
        
    except pymysql.Error as e:
        print(f"❌ MySQL Error: {e}")
        print("\n🔧 Troubleshooting Tips:")
        print("1. Make sure MySQL server is running")
        print("2. Check username and password")
        print("3. Verify host and port settings")
        print("4. Try connecting with MySQL Workbench first")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

def create_database_if_not_exists():
    """Create database if it doesn't exist"""
    print("\n🗄️ Creating database if needed...")
    
    # Load environment variables
    load_dotenv()
    
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "")
    db_name = os.getenv("DB_NAME", "carbon_footprint_db")
    
    try:
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ Database '{db_name}' created or already exists")
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def main():
    """Main function"""
    print("🚀 MySQL Connection Test for Carbon Footprint Project")
    print("=" * 60)
    
    # Test connection
    if test_mysql_connection():
        print("\n✅ Connection test passed!")
        
        # Ask if user wants to create database
        response = input("\n❓ Do you want to create the database if it doesn't exist? (y/n): ")
        if response.lower() in ['y', 'yes']:
            create_database_if_not_exists()
        
        print("\n🎯 Next Steps:")
        print("1. Open MySQL Workbench")
        print("2. Connect using the credentials above")
        print("3. Run the schema.sql file to create tables")
        print("4. Run: python scripts/simple_setup.py")
        
    else:
        print("\n❌ Connection test failed!")
        print("\n🔧 Please check:")
        print("1. MySQL server is installed and running")
        print("2. Username and password are correct")
        print("3. Port 3306 is not blocked")
        print("4. Try connecting with MySQL Workbench first")

if __name__ == "__main__":
    main()
