# MySQL Workbench Setup Guide for Carbon Footprint Project

## 🚀 Quick Setup Steps

### Step 1: Install MySQL Server
1. Download MySQL Server from: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server (choose "Developer Default" option)
3. Set root password during installation
4. Make sure MySQL service is running

### Step 2: Install MySQL Workbench
1. Download MySQL Workbench from: https://dev.mysql.com/downloads/workbench/
2. Install MySQL Workbench
3. Launch MySQL Workbench

### Step 3: Create Database Connection in Workbench
1. Open MySQL Workbench
2. Click the "+" button next to "MySQL Connections"
3. Fill in connection details:
   - **Connection Name**: `Carbon Footprint DB`
   - **Hostname**: `localhost` (or `127.0.0.1`)
   - **Port**: `3306`
   - **Username**: `root` (or your MySQL username)
   - **Password**: Click "Store in Vault..." and enter your MySQL password
4. Click "Test Connection" to verify
5. Click "OK" to save

### Step 4: Create Database and User
1. Double-click your connection to connect
2. In the SQL Editor, run these commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS carbon_footprint_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional, for security)
CREATE USER IF NOT EXISTS 'carbon_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON carbon_footprint_db.* TO 'carbon_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE carbon_footprint_db;
```

### Step 5: Run Database Schema
1. In MySQL Workbench, go to File → Open SQL Script
2. Navigate to: `carbon_project/backend/database/schema.sql`
3. Open the file
4. Click the "Execute" button (lightning bolt icon) to run the schema
5. Verify tables are created in the Navigator panel

## 🔧 Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=carbon_user
DB_PASSWORD=secure_password
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://carbon_user:secure_password@localhost:3306/carbon_footprint_db

# Application Configuration
APP_NAME=Carbon Footprint Calculator
APP_VERSION=1.0.0
DEBUG=True
ENVIRONMENT=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080
```

## 🧪 Test Database Connection

Run the connection test script:

```bash
cd carbon_project/backend
python scripts/simple_setup.py
```

## 📊 Verify Database Setup

In MySQL Workbench:
1. Refresh the Navigator (F5)
2. Expand your connection
3. Expand "carbon_footprint_db"
4. Expand "Tables"
5. You should see these tables:
   - users
   - carbon_footprints
   - recommendations
   - user_goals
   - user_sessions
   - audit_logs
   - system_config

## 🔍 Troubleshooting

### Connection Issues
- **Error 1045**: Wrong username/password
- **Error 2003**: MySQL server not running
- **Error 1049**: Database doesn't exist

### Common Solutions
1. **MySQL not running**: Start MySQL service in Services (Windows) or `sudo service mysql start` (Linux/Mac)
2. **Wrong credentials**: Check username/password in Workbench connection
3. **Port issues**: Verify MySQL is running on port 3306

### Test Connection Manually
```bash
# Test MySQL connection from command line
mysql -u root -p -h localhost -P 3306
```

## 🚀 Next Steps

1. ✅ Database connected in Workbench
2. ✅ Tables created successfully
3. ✅ Environment variables configured
4. ✅ Connection test passed

Now you can:
- Start the FastAPI backend: `uvicorn app.main:app --reload`
- Access API docs: http://localhost:8000/docs
- Run the frontend: `npm start` in the frontend directory

## 📝 Quick Commands

```bash
# Start MySQL service (Windows)
net start mysql

# Start MySQL service (Linux/Mac)
sudo service mysql start

# Connect to MySQL from command line
mysql -u root -p

# Check if MySQL is running
netstat -an | findstr :3306  # Windows
netstat -an | grep :3306     # Linux/Mac
```
