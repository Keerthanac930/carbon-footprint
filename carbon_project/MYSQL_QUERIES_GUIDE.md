# MySQL Workbench - View Login and User Details

## Quick Start

1. **Open MySQL Workbench**
2. **Connect to your database**
3. **Select the database**: 
   ```sql
   USE carbon_footprint_db;
   ```
4. **Run the queries below**

---

## 📊 Essential Queries

### 1. View All Registered Users
```sql
-- See all users and when they registered
SELECT 
    id,
    email,
    name,
    created_at
FROM users
ORDER BY created_at DESC;
```

**Shows**: User ID, Email, Name, Registration Date

---

### 2. Count Total Number of Users
```sql
-- Get total number of registered users
SELECT COUNT(*) AS total_users 
FROM users;
```

**Shows**: Total number of users in your system

---

### 3. View All Active Login Sessions
```sql
-- See who is currently logged in
SELECT 
    us.id AS session_id,
    u.email,
    u.name,
    us.session_token,
    us.created_at AS login_time,
    us.expires_at AS session_expires,
    CASE 
        WHEN us.expires_at > NOW() THEN 'Active'
        ELSE 'Expired'
    END AS status
FROM user_sessions us
JOIN users u ON us.user_id = u.id
ORDER BY us.created_at DESC;
```

**Shows**: Who's logged in, when they logged in, and session status

---

### 4. Count Active vs Expired Sessions
```sql
-- Count how many sessions are active vs expired
SELECT 
    SUM(CASE WHEN expires_at > NOW() THEN 1 ELSE 0 END) AS active_sessions,
    SUM(CASE WHEN expires_at <= NOW() THEN 1 ELSE 0 END) AS expired_sessions,
    COUNT(*) AS total_sessions
FROM user_sessions;
```

**Shows**: Number of active and expired sessions

---

### 5. View User Login History
```sql
-- See all login attempts (sessions) for each user
SELECT 
    u.email,
    u.name,
    COUNT(us.id) AS total_logins,
    MAX(us.created_at) AS last_login,
    MIN(us.created_at) AS first_login
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
GROUP BY u.id, u.email, u.name
ORDER BY total_logins DESC;
```

**Shows**: How many times each user has logged in

---

### 6. View Recent Logins (Last 24 Hours)
```sql
-- See who logged in recently
SELECT 
    u.email,
    u.name,
    us.created_at AS login_time,
    us.expires_at AS session_expires
FROM user_sessions us
JOIN users u ON us.user_id = u.id
WHERE us.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY us.created_at DESC;
```

**Shows**: All logins in the last 24 hours

---

### 7. View Complete User Details with Session Info
```sql
-- Complete view: Users with their session information
SELECT 
    u.id AS user_id,
    u.email,
    u.name,
    u.created_at AS registered_date,
    COUNT(us.id) AS total_sessions,
    SUM(CASE WHEN us.expires_at > NOW() THEN 1 ELSE 0 END) AS active_sessions,
    MAX(us.created_at) AS last_login
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
GROUP BY u.id, u.email, u.name, u.created_at
ORDER BY last_login DESC;
```

**Shows**: Complete overview of each user and their activity

---

### 8. Find Users Who Never Logged In
```sql
-- See users who registered but never logged in
SELECT 
    u.id,
    u.email,
    u.name,
    u.created_at AS registered_date
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
WHERE us.id IS NULL
ORDER BY u.created_at DESC;
```

**Shows**: Registered users who haven't logged in yet

---

### 9. View Most Active Users
```sql
-- See users with the most login sessions
SELECT 
    u.email,
    u.name,
    COUNT(us.id) AS login_count,
    MAX(us.created_at) AS last_login
FROM users u
JOIN user_sessions us ON u.id = us.user_id
GROUP BY u.id, u.email, u.name
ORDER BY login_count DESC
LIMIT 10;
```

**Shows**: Top 10 most active users

---

### 10. View User Details by Email
```sql
-- Search for specific user by email
SELECT 
    u.id,
    u.email,
    u.name,
    u.created_at AS registered_date,
    COUNT(us.id) AS total_logins,
    MAX(us.created_at) AS last_login
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
WHERE u.email = 'yourname@example.com'  -- Change this email
GROUP BY u.id, u.email, u.name, u.created_at;
```

**Shows**: Detailed info for a specific user

---

## 🔍 Advanced Analytics Queries

### User Growth Over Time
```sql
-- See how many users registered each day
SELECT 
    DATE(created_at) AS registration_date,
    COUNT(*) AS new_users,
    SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) AS total_users
FROM users
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;
```

### Login Activity by Day
```sql
-- See login activity for each day
SELECT 
    DATE(created_at) AS login_date,
    COUNT(*) AS total_logins,
    COUNT(DISTINCT user_id) AS unique_users
FROM user_sessions
GROUP BY DATE(created_at)
ORDER BY login_date DESC;
```

### Session Duration Analysis
```sql
-- See how long sessions last on average
SELECT 
    AVG(TIMESTAMPDIFF(HOUR, created_at, expires_at)) AS avg_session_hours,
    MIN(TIMESTAMPDIFF(HOUR, created_at, expires_at)) AS min_session_hours,
    MAX(TIMESTAMPDIFF(HOUR, created_at, expires_at)) AS max_session_hours
FROM user_sessions;
```

---

## 🛠️ Maintenance Queries

### Clean Up Expired Sessions
```sql
-- Delete expired sessions
DELETE FROM user_sessions 
WHERE expires_at < NOW();

-- Check how many were deleted
SELECT ROW_COUNT() AS deleted_sessions;
```

### Find Users with Expired Sessions
```sql
-- See users with only expired sessions
SELECT 
    u.email,
    u.name,
    COUNT(us.id) AS expired_session_count
FROM users u
JOIN user_sessions us ON u.id = us.user_id
WHERE us.expires_at < NOW()
GROUP BY u.id, u.email, u.name;
```

---

## 📊 Dashboard Query (All Stats at Once)
```sql
-- Complete dashboard view
SELECT 
    'Total Users' AS metric,
    COUNT(*) AS value
FROM users

UNION ALL

SELECT 
    'Active Sessions',
    COUNT(*)
FROM user_sessions
WHERE expires_at > NOW()

UNION ALL

SELECT 
    'Expired Sessions',
    COUNT(*)
FROM user_sessions
WHERE expires_at <= NOW()

UNION ALL

SELECT 
    'Total Sessions',
    COUNT(*)
FROM user_sessions

UNION ALL

SELECT 
    'Logins Today',
    COUNT(*)
FROM user_sessions
WHERE DATE(created_at) = CURDATE()

UNION ALL

SELECT 
    'Logins This Week',
    COUNT(*)
FROM user_sessions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

## 📝 How to Use in MySQL Workbench

### Step-by-Step:

1. **Open MySQL Workbench**

2. **Connect to Database**
   - Click your connection
   - Enter password if prompted

3. **Select Database**
   ```sql
   USE carbon_footprint_db;
   ```

4. **Run Query**
   - Copy any query from above
   - Paste into query window
   - Click the lightning bolt ⚡ or press `Ctrl+Enter`

5. **View Results**
   - Results appear in the bottom panel
   - Click column headers to sort
   - Right-click to export to CSV/Excel

---

## 🎯 Quick Reference Table

| What You Want to See | Query Number | Quick Query |
|---------------------|--------------|-------------|
| All users | 1 | `SELECT * FROM users;` |
| User count | 2 | `SELECT COUNT(*) FROM users;` |
| Active sessions | 3 | See query #3 above |
| Login history | 5 | See query #5 above |
| Recent logins | 6 | See query #6 above |
| Most active users | 9 | See query #9 above |
| All stats | Dashboard | See dashboard query |

---

## 💡 Tips

1. **Export Results**: Right-click on result → Export → CSV/Excel
2. **Save Queries**: Click 💾 to save frequently used queries
3. **Auto-refresh**: Create a view for real-time monitoring
4. **Filter Results**: Use `WHERE` clause to filter by date, email, etc.
5. **Limit Results**: Add `LIMIT 100` to see first 100 rows

---

## 🔐 Security Note

**DO NOT** run queries that expose password hashes:
```sql
-- ❌ DON'T DO THIS
SELECT * FROM users;  -- This shows password_hash column

-- ✅ DO THIS INSTEAD
SELECT id, email, name, created_at FROM users;
```

---

## 📊 Example Output

### Query: View All Users
```
+----+------------------------+-----------------+---------------------+
| id | email                  | name            | created_at          |
+----+------------------------+-----------------+---------------------+
|  1 | john@example.com       | John Doe        | 2025-10-22 10:30:00 |
|  2 | jane@example.com       | Jane Smith      | 2025-10-22 11:45:00 |
|  3 | bob@example.com        | Bob Wilson      | 2025-10-22 12:15:00 |
+----+------------------------+-----------------+---------------------+
3 rows in set (0.00 sec)
```

### Query: Count Active Sessions
```
+------------------+-------------------+----------------+
| active_sessions  | expired_sessions  | total_sessions |
+------------------+-------------------+----------------+
|        5         |         3         |       8        |
+------------------+-------------------+----------------+
1 row in set (0.00 sec)
```

---

## 🚀 Quick Start Commands

```sql
-- Copy and paste this entire block to get started
USE carbon_footprint_db;

-- 1. See all users
SELECT id, email, name, created_at FROM users ORDER BY created_at DESC;

-- 2. Count users
SELECT COUNT(*) AS total_users FROM users;

-- 3. See active sessions
SELECT 
    u.email,
    us.created_at AS login_time,
    CASE WHEN us.expires_at > NOW() THEN 'Active' ELSE 'Expired' END AS status
FROM user_sessions us
JOIN users u ON us.user_id = u.id
ORDER BY us.created_at DESC;
```

---

**Need Help?** All these queries are tested and ready to use! Just copy, paste, and run in MySQL Workbench. 📊

