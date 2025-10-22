"""
Quick script to check database statistics
Run this to see user and login information from command line
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text, func
from app.database.connection import engine, SessionLocal
from app.models.user import User, UserSession
from datetime import datetime

print("\n" + "="*70)
print("DATABASE STATISTICS - USER & LOGIN INFORMATION")
print("="*70)
print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

db = SessionLocal()

try:
    # 1. Total Users
    print("1. TOTAL USERS")
    print("-" * 70)
    total_users = db.query(User).count()
    print(f"   Total Registered Users: {total_users}")
    
    # 2. List All Users
    if total_users > 0:
        print("\n2. ALL REGISTERED USERS")
        print("-" * 70)
        users = db.query(User).order_by(User.created_at.desc()).all()
        
        print(f"   {'ID':<5} {'Email':<30} {'Name':<20} {'Registered':<20}")
        print("   " + "-" * 75)
        
        for user in users:
            user_id = str(user.id)
            email = user.email[:28] + '..' if len(user.email) > 28 else user.email
            name = user.name[:18] + '..' if len(user.name) > 18 else user.name
            created = user.created_at.strftime('%Y-%m-%d %H:%M')
            print(f"   {user_id:<5} {email:<30} {name:<20} {created:<20}")
    
    # 3. Total Sessions
    print("\n3. LOGIN SESSIONS")
    print("-" * 70)
    total_sessions = db.query(UserSession).count()
    active_sessions = db.query(UserSession).filter(
        UserSession.expires_at > datetime.utcnow()
    ).count()
    expired_sessions = total_sessions - active_sessions
    
    print(f"   Total Sessions: {total_sessions}")
    print(f"   Active Sessions: {active_sessions}")
    print(f"   Expired Sessions: {expired_sessions}")
    
    # 4. Active Sessions Details
    if active_sessions > 0:
        print("\n4. ACTIVE SESSIONS DETAILS")
        print("-" * 70)
        
        active = db.query(UserSession, User).join(
            User, UserSession.user_id == User.id
        ).filter(
            UserSession.expires_at > datetime.utcnow()
        ).order_by(UserSession.created_at.desc()).all()
        
        print(f"   {'Email':<30} {'Login Time':<20} {'Expires':<20}")
        print("   " + "-" * 70)
        
        for session, user in active:
            email = user.email[:28] + '..' if len(user.email) > 28 else user.email
            login_time = session.created_at.strftime('%Y-%m-%d %H:%M')
            expires = session.expires_at.strftime('%Y-%m-%d %H:%M')
            print(f"   {email:<30} {login_time:<20} {expires:<20}")
    
    # 5. User Login Statistics
    print("\n5. USER LOGIN STATISTICS")
    print("-" * 70)
    
    # Query to get login counts per user
    result = db.query(
        User.email,
        User.name,
        func.count(UserSession.id).label('login_count'),
        func.max(UserSession.created_at).label('last_login')
    ).outerjoin(
        UserSession, User.id == UserSession.user_id
    ).group_by(
        User.id, User.email, User.name
    ).order_by(
        func.count(UserSession.id).desc()
    ).all()
    
    if result:
        print(f"   {'Email':<30} {'Total Logins':<15} {'Last Login':<20}")
        print("   " + "-" * 65)
        
        for email, name, login_count, last_login in result:
            email_str = email[:28] + '..' if len(email) > 28 else email
            last_login_str = last_login.strftime('%Y-%m-%d %H:%M') if last_login else 'Never'
            print(f"   {email_str:<30} {login_count:<15} {last_login_str:<20}")
    
    # 6. Recent Activity (Last 24 hours)
    print("\n6. RECENT ACTIVITY (Last 24 Hours)")
    print("-" * 70)
    
    from datetime import timedelta
    yesterday = datetime.utcnow() - timedelta(days=1)
    
    recent = db.query(UserSession, User).join(
        User, UserSession.user_id == User.id
    ).filter(
        UserSession.created_at >= yesterday
    ).order_by(UserSession.created_at.desc()).all()
    
    if recent:
        print(f"   Recent logins: {len(recent)}")
        print(f"\n   {'Email':<30} {'Login Time':<20}")
        print("   " + "-" * 50)
        
        for session, user in recent[:10]:  # Show last 10
            email = user.email[:28] + '..' if len(user.email) > 28 else user.email
            login_time = session.created_at.strftime('%Y-%m-%d %H:%M:%S')
            print(f"   {email:<30} {login_time:<20}")
        
        if len(recent) > 10:
            print(f"   ... and {len(recent) - 10} more")
    else:
        print("   No logins in the last 24 hours")
    
    # 7. Summary Dashboard
    print("\n" + "="*70)
    print("SUMMARY DASHBOARD")
    print("="*70)
    print(f"Total Registered Users:     {total_users}")
    print(f"Total Login Sessions:       {total_sessions}")
    print(f"Currently Active Sessions:  {active_sessions}")
    print(f"Expired Sessions:           {expired_sessions}")
    print(f"Logins in Last 24 Hours:    {len(recent) if recent else 0}")
    print("="*70)

except Exception as e:
    print(f"\nError: {e}")
    print("\nMake sure:")
    print("1. MySQL server is running")
    print("2. Database 'carbon_footprint_db' exists")
    print("3. Tables are created")

finally:
    db.close()

print("\n" + "="*70)
print("For more detailed queries, use MySQL Workbench with queries from")
print("MYSQL_QUERIES_GUIDE.md")
print("="*70 + "\n")

