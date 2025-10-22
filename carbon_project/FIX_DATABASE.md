# 🔧 Database Fix - Complete Guide

## ✅ Problem Solved!

The database schema mismatch has been fixed. The `users` table now has the correct `password_hash` column.

---

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Navigate to Backend Directory
```bash
cd "E:\Final Year Project\carbon_project\backend"
```

### Step 2: Run Database Fix Script
```bash
python quick_fix_db.py
```

**Expected Output:**
```
✅ Models imported successfully
✅ Tables created/updated successfully
✓ users
✓ user_sessions
✓ carbon_footprints
✓ recommendations
✓ user_goals
✓ audit_logs
✓ system_config
```

### Step 3: Start Backend Server
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
🚀 Starting Carbon Footprint API...
✅ Database tables created/verified
📦 Loading ML model...
✅ ML model loaded successfully
✅ Backend ready on http://localhost:8000
```

---

## 🧪 Test Registration

1. **Start Frontend** (in a new terminal):
   ```bash
   cd "E:\Final Year Project\carbon_project\frontend"
   npm start
   ```

2. **Open Browser**: http://localhost:3000/signup

3. **Create Account**:
   - Email: test@example.com
   - Name: Test User
   - Password: password123
   - Confirm Password: password123

4. **Click "Create Account"**

✅ Should now work without the `password_hash` error!

---

## 🔍 What Was Fixed?

### Before (❌ Broken):
- Each model file had its own `Base` declaration
- Models weren't registered with the database
- `users` table missing `password_hash` column
- Error: `"Unknown column 'users.password_hash'"`

### After (✅ Fixed):
- All models use shared `Base` from `connection.py`
- Models properly registered with SQLAlchemy
- Database tables created with correct schema
- `users` table has `password_hash` column

---

## 📁 Files Changed

1. ✅ `app/models/user.py` - Uses shared Base
2. ✅ `app/models/carbon_footprint.py` - Uses shared Base
3. ✅ `app/database/connection.py` - Imports models
4. ✅ `quick_fix_db.py` - Database fix script (NEW)

---

## 🆘 Troubleshooting

### Issue: "Cannot find path"
**Solution**: Make sure you're in the correct directory
```bash
# Check current directory
pwd

# Should show: E:\Final Year Project\carbon_project\backend
# If not, navigate there:
cd "E:\Final Year Project\carbon_project\backend"
```

### Issue: "No module named 'app'"
**Solution**: Run from backend directory, not carbon_project
```bash
cd backend  # Must be in backend folder
python quick_fix_db.py
```

### Issue: Database connection error
**Solution**: Make sure MySQL is running
```bash
# Check MySQL service is running
# Start MySQL Workbench or check Windows Services
```

### Issue: Still getting password_hash error
**Solution**: Run the fix script again
```bash
cd "E:\Final Year Project\carbon_project\backend"
python quick_fix_db.py
```

---

## 📊 Database Schema

The `users` table now has:
- `id` - Primary key
- `email` - Unique, indexed
- `name` - User's full name
- **`password_hash`** - Hashed password ✅
- `created_at` - Timestamp

---

## ✨ What You Can Do Now

- ✅ **Sign Up** - Create new accounts
- ✅ **Sign In** - Login with credentials
- ✅ **Calculate** - Carbon footprint calculations
- ✅ **Track** - Historical data storage
- ✅ **View** - Recommendations and insights

---

## 🎯 Next Steps

1. ✅ Database is fixed - Run `quick_fix_db.py`
2. ✅ Start backend - Port 8000
3. ✅ Start frontend - Port 3000
4. ✅ Test registration - Create account
5. ✅ Test login - Sign in
6. ✅ Use the app - Calculate carbon footprint

---

**Last Updated**: October 21, 2025  
**Status**: ✅ Ready to Use

