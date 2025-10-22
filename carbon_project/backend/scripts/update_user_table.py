#!/usr/bin/env python3
"""
Update users table to add password_hash column
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
import pymysql

# Load environment variables
load_dotenv()

def update_users_table():
    """Add password_hash column to users table"""
    try:
        # Get database credentials
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = int(os.getenv('DB_PORT', 3306))
        db_user = os.getenv('DB_USER', 'root')
        db_password = os.getenv('DB_PASSWORD', '')
        db_name = os.getenv('DB_NAME', 'carbon_footprint_db')
        
        print(f"Connecting to MySQL database: {db_name}")
        print(f"Host: {db_host}:{db_port}")
        print(f"User: {db_user}")
        
        # Connect to MySQL
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name,
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Check if password_hash column exists
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = %s 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'password_hash'
        """, (db_name,))
        
        if cursor.fetchone():
            print("✅ password_hash column already exists in users table")
        else:
            # Add password_hash column
            print("Adding password_hash column to users table...")
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT ''
            """)
            connection.commit()
            print("✅ Successfully added password_hash column to users table")
        
        # Update existing users with a default password hash (for existing users)
        cursor.execute("""
            UPDATE users 
            SET password_hash = '$2b$12$default.hash.for.existing.users' 
            WHERE password_hash = '' OR password_hash IS NULL
        """)
        affected_rows = cursor.rowcount
        if affected_rows > 0:
            print(f"✅ Updated {affected_rows} existing users with default password hash")
            print("⚠️  Note: Existing users will need to reset their passwords")
        
        cursor.close()
        connection.close()
        
        print("\n🎉 Database update completed successfully!")
        print("You can now use password authentication for new users.")
        
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 Updating users table for password authentication...")
    success = update_users_table()
    if success:
        print("\n✅ Database update completed!")
    else:
        print("\n❌ Database update failed!")
        sys.exit(1)
