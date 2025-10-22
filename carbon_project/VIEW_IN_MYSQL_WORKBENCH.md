# How to View Login Details in MySQL Workbench

## 📊 Your Current Database Stats

Based on the live check, you have:
- ✅ **7 registered users**
- ✅ **11 active login sessions**
- ✅ **11 logins in last 24 hours**

---

## 🚀 Quick Start - MySQL Workbench

### Step 1: Open MySQL Workbench
1. Launch MySQL Workbench application
2. Click on your database connection
3. Enter your password if prompted

### Step 2: Select Database
In the query window, run:
```sql
USE carbon_footprint_db;
```

### Step 3: View Your Users
Copy and paste this query:
```sql
SELECT 
    id,
    email,
    name,
    created_at
FROM users
ORDER BY created_at DESC;
```

Click the lightning bolt ⚡ to run it.

**You'll see all 7 of your registered users!**

---

## 📋 Essential Queries for Your Database

### 1. Count Total Users
```sql
SELECT COUNT(*) AS total_users FROM users;
```
**Result**: Shows `7`

### 2. See All Active Login Sessions
```sql
SELECT 
    u.email,
    u.name,
    us.created_at AS login_time,
    us.expires_at AS session_expires
FROM user_sessions us
JOIN users u ON us.user_id = u.id
WHERE us.expires_at > NOW()
ORDER BY us.created_at DESC;
```
**Result**: Shows all 11 active sessions with email and login times

### 3. Count Logins Per User
```sql
SELECT 
    u.email,
    u.name,
    COUNT(us.id) AS total_logins,
    MAX(us.created_at) AS last_login
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
GROUP BY u.id, u.email, u.name
ORDER BY total_logins DESC;
```
**Result**: Shows:
- lll@gmail.com: 4 logins (most active!)
- keerthu3399@gmail.com: 2 logins
- kkk@gmail.com: 2 logins
- Others: 1 login each
- keerthu73380@gmail.com: 0 logins (registered but never logged in)

### 4. See Recent Activity (Today)
```sql
SELECT 
    u.email,
    us.created_at AS login_time
FROM user_sessions us
JOIN users u ON us.user_id = u.id
WHERE DATE(us.created_at) = CURDATE()
ORDER BY us.created_at DESC;
```
**Result**: Shows all today's logins

### 5. Dashboard - All Stats at Once
```sql
SELECT 'Total Users' AS metric, COUNT(*) AS value FROM users
UNION ALL
SELECT 'Active Sessions', COUNT(*) FROM user_sessions WHERE expires_at > NOW()
UNION ALL
SELECT 'Total Logins', COUNT(*) FROM user_sessions
UNION ALL
SELECT 'Logins Today', COUNT(*) FROM user_sessions WHERE DATE(created_at) = CURDATE();
```
**Result**: Complete overview of your database

---

## 🎯 Your Specific Users (As of Now)

Based on the script output:

### All Registered Users:
1. **xyz@gmail.com** - Registered: 2025-10-22 15:09
2. **keerth@gmail.com** - Registered: 2025-10-22 11:56
3. **keerthu73380@gmail.com** - Registered: 2025-10-22 11:56 (Never logged in)
4. **kkk@gmail.com** - Registered: 2025-10-22 11:28
5. **aaa@gmail.com** - Registered: 2025-10-22 11:24
6. **lll@gmail.com** - Registered: 2025-10-22 11:09 (Most active - 4 logins!)
7. **keerthu3399@gmail.com** - Registered: 2025-10-22 10:39

### Login Statistics:
- **Most Active**: lll@gmail.com (4 logins)
- **Never Logged In**: keerthu73380@gmail.com
- **Latest Login**: xyz@gmail.com at 15:09

---

## 🔍 Quick MySQL Workbench Tips

### How to Run Queries:
1. Copy query from above
2. Paste in query window (top section)
3. Click lightning bolt ⚡ or press `Ctrl+Enter`
4. View results in bottom section

### How to Export Data:
1. Run any query
2. Right-click on results
3. Select "Export" → Choose format (CSV, Excel, etc.)

### How to Save Queries:
1. Write your query
2. Click the save icon 💾
3. Give it a name like "View All Users"
4. Access it later from Saved SQL tab

---

## 📊 Visual Guide

```
MySQL Workbench Layout:
┌─────────────────────────────────────┐
│  Query Window (Type SQL here)      │ ← Paste queries here
├─────────────────────────────────────┤
│  ⚡ Run Button                       │ ← Click to execute
├─────────────────────────────────────┤
│  Results Grid (Output appears here)│ ← See results here
└─────────────────────────────────────┘
```

---

## 🛠️ Common Tasks

### Find a Specific User:
```sql
SELECT * FROM users WHERE email = 'lll@gmail.com';
```

### See Who's Currently Logged In:
```sql
SELECT 
    u.email,
    us.created_at AS login_time
FROM user_sessions us
JOIN users u ON us.user_id = u.id
WHERE us.expires_at > NOW()
ORDER BY us.created_at DESC;
```

### Count Users Registered Today:
```sql
SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE();
```

### Delete Expired Sessions (Cleanup):
```sql
DELETE FROM user_sessions WHERE expires_at < NOW();
```

---

## 💡 Pro Tips

1. **Always use `USE carbon_footprint_db;` first** - Makes sure you're in the right database

2. **Use `LIMIT` for large results**:
   ```sql
   SELECT * FROM users LIMIT 10;
   ```

3. **Sort results with `ORDER BY`**:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC;
   ```

4. **Filter with `WHERE`**:
   ```sql
   SELECT * FROM users WHERE DATE(created_at) = '2025-10-22';
   ```

---

## 🎯 Quick Test

Try this complete query block in MySQL Workbench:

```sql
-- Select database
USE carbon_footprint_db;

-- Show all users
SELECT 
    id,
    email,
    name,
    created_at
FROM users
ORDER BY created_at DESC;

-- Show login count per user
SELECT 
    u.email,
    COUNT(us.id) AS logins
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
GROUP BY u.email
ORDER BY logins DESC;
```

---

## ✅ What You Should See

When you run the queries, you should see:
- Your 7 registered users
- Their login counts
- Active session information
- Registration dates

All matching the data from the script output!

---

## 📞 Need More Details?

Check these files:
- **MYSQL_QUERIES_GUIDE.md** - 20+ detailed SQL queries
- **check_database_stats.py** - Run from command line to see stats

Or run this command anytime:
```bash
cd "E:\Final Year Project\carbon_project\backend"
python check_database_stats.py
```

---

**Your database is working perfectly!** 🎉

You have 7 users, 11 active sessions, and everything is being tracked correctly.

