"""
Quick script to clear all users and sessions from the database
This will let you start fresh with registration
"""
import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
connection = pymysql.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', ''),
    database=os.getenv('DB_NAME', 'carbon_footprint_db'),
    port=int(os.getenv('DB_PORT', 3306))
)

try:
    with connection.cursor() as cursor:
        # Clear sessions first (foreign key constraint)
        cursor.execute("DELETE FROM user_sessions")
        sessions_deleted = cursor.rowcount
        
        # Clear users
        cursor.execute("DELETE FROM users")
        users_deleted = cursor.rowcount
        
        # Commit changes
        connection.commit()
        
        print(f"✅ Successfully deleted {users_deleted} users and {sessions_deleted} sessions")
        print("You can now register with any email again!")
        
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    connection.close()

