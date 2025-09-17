#!/usr/bin/env python3
"""
Database migration script for Carbon Footprint Application
"""

import os
import sys
import pymysql
from datetime import datetime

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_database_connection():
    """Get database connection"""
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "")
    db_name = os.getenv("DB_NAME", "carbon_footprint_db")
    
    return pymysql.connect(
        host=db_host,
        port=db_port,
        user=db_user,
        password=db_password,
        database=db_name,
        charset='utf8mb4'
    )

def check_database_exists():
    """Check if database exists"""
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
            cursor.execute("SHOW DATABASES LIKE %s", (db_name,))
            result = cursor.fetchone()
            return result is not None
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        return False
    finally:
        if 'connection' in locals():
            connection.close()

def check_tables_exist():
    """Check if tables exist"""
    try:
        connection = get_database_connection()
        
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]
            
            required_tables = [
                'users', 'user_profiles', 'user_sessions', 'carbon_footprints',
                'recommendations', 'user_goals', 'audit_logs', 'system_config'
            ]
            
            missing_tables = [table for table in required_tables if table not in tables]
            
            if missing_tables:
                print(f"❌ Missing tables: {missing_tables}")
                return False
            else:
                print("✅ All required tables exist")
                return True
                
    except Exception as e:
        print(f"❌ Error checking tables: {e}")
        return False
    finally:
        if 'connection' in locals():
            connection.close()

def get_table_info():
    """Get information about tables"""
    try:
        connection = get_database_connection()
        
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    table_name,
                    table_rows,
                    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
                FROM information_schema.tables 
                WHERE table_schema = %s
                ORDER BY table_name
            """, (os.getenv("DB_NAME", "carbon_footprint_db"),))
            
            tables = cursor.fetchall()
            
            print("\n📊 Database Tables Information:")
            print("-" * 60)
            print(f"{'Table Name':<20} {'Rows':<10} {'Size (MB)':<10}")
            print("-" * 60)
            
            for table in tables:
                print(f"{table[0]:<20} {table[1]:<10} {table[2]:<10}")
            
            print("-" * 60)
            
    except Exception as e:
        print(f"❌ Error getting table info: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

def get_user_stats():
    """Get user statistics"""
    try:
        connection = get_database_connection()
        
        with connection.cursor() as cursor:
            # Total users
            cursor.execute("SELECT COUNT(*) FROM users")
            total_users = cursor.fetchone()[0]
            
            # Active users
            cursor.execute("SELECT COUNT(*) FROM users WHERE is_active = TRUE")
            active_users = cursor.fetchone()[0]
            
            # Verified users
            cursor.execute("SELECT COUNT(*) FROM users WHERE is_verified = TRUE")
            verified_users = cursor.fetchone()[0]
            
            # Total calculations
            cursor.execute("SELECT COUNT(*) FROM carbon_footprints")
            total_calculations = cursor.fetchone()[0]
            
            # Recent calculations (last 7 days)
            cursor.execute("""
                SELECT COUNT(*) FROM carbon_footprints 
                WHERE calculation_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            """)
            recent_calculations = cursor.fetchone()[0]
            
            print("\n👥 User Statistics:")
            print("-" * 40)
            print(f"Total Users: {total_users}")
            print(f"Active Users: {active_users}")
            print(f"Verified Users: {verified_users}")
            print(f"Total Calculations: {total_calculations}")
            print(f"Recent Calculations (7 days): {recent_calculations}")
            print("-" * 40)
            
    except Exception as e:
        print(f"❌ Error getting user stats: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

def cleanup_old_data():
    """Clean up old data"""
    try:
        connection = get_database_connection()
        
        with connection.cursor() as cursor:
            # Clean up expired sessions
            cursor.execute("""
                DELETE FROM user_sessions 
                WHERE expires_at < NOW() OR is_active = FALSE
            """)
            expired_sessions = cursor.rowcount
            
            # Clean up old audit logs (older than 1 year)
            cursor.execute("""
                DELETE FROM audit_logs 
                WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR)
            """)
            old_audit_logs = cursor.rowcount
            
            connection.commit()
            
            print(f"\n🧹 Cleanup completed:")
            print(f"Expired sessions removed: {expired_sessions}")
            print(f"Old audit logs removed: {old_audit_logs}")
            
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

def backup_database():
    """Create database backup"""
    try:
        db_name = os.getenv("DB_NAME", "carbon_footprint_db")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"backup_{db_name}_{timestamp}.sql"
        
        # Create backup directory if it doesn't exist
        backup_dir = "backups"
        os.makedirs(backup_dir, exist_ok=True)
        backup_path = os.path.join(backup_dir, backup_file)
        
        # Use mysqldump to create backup
        import subprocess
        
        db_host = os.getenv("DB_HOST", "localhost")
        db_user = os.getenv("DB_USER", "root")
        db_password = os.getenv("DB_PASSWORD", "")
        
        cmd = [
            "mysqldump",
            f"--host={db_host}",
            f"--user={db_user}",
            f"--password={db_password}",
            "--single-transaction",
            "--routines",
            "--triggers",
            db_name
        ]
        
        with open(backup_path, 'w') as f:
            subprocess.run(cmd, stdout=f, stderr=subprocess.PIPE)
        
        print(f"✅ Database backup created: {backup_path}")
        
    except Exception as e:
        print(f"❌ Error creating backup: {e}")

def main():
    """Main migration function"""
    print("🔧 Carbon Footprint Database Migration Tool")
    print("=" * 50)
    
    # Check database exists
    print("\n1. Checking database...")
    if not check_database_exists():
        print("❌ Database does not exist. Please run init_database.py first.")
        return False
    
    # Check tables exist
    print("\n2. Checking tables...")
    if not check_tables_exist():
        print("❌ Required tables are missing. Please run init_database.py first.")
        return False
    
    # Get table information
    print("\n3. Getting table information...")
    get_table_info()
    
    # Get user statistics
    print("\n4. Getting user statistics...")
    get_user_stats()
    
    # Ask for cleanup
    print("\n5. Cleanup options...")
    cleanup_choice = input("Do you want to clean up old data? (y/n): ").lower()
    if cleanup_choice == 'y':
        cleanup_old_data()
    
    # Ask for backup
    print("\n6. Backup options...")
    backup_choice = input("Do you want to create a backup? (y/n): ").lower()
    if backup_choice == 'y':
        backup_database()
    
    print("\n" + "=" * 50)
    print("✅ Migration check completed successfully!")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
