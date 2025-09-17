# Simple Carbon Footprint Database Setup

This is a simplified version of the Carbon Footprint application with basic user management and no complex authentication.

## 🗄️ Simplified Database Schema

### Core Tables
- **`users`** - Simple user table (id, email, name, created_at)
- **`user_sessions`** - Simple session management (id, user_id, session_token, created_at, expires_at)
- **`carbon_footprints`** - Carbon footprint calculations with full history
- **`recommendations`** - Personalized recommendations
- **`user_goals`** - User-defined carbon reduction goals
- **`audit_logs`** - System audit trail
- **`system_config`** - Application configuration

### Key Features
- ✅ Simple email/name based user creation
- ✅ Session-based authentication (no passwords)
- ✅ Historical carbon footprint tracking
- ✅ Personalized recommendations
- ✅ Goal setting and progress tracking
- ✅ Complete audit logging

## 🚀 Quick Setup

### 1. Prerequisites
- MySQL 8.0+ or MariaDB 10.3+
- Python 3.8+
- pip package manager

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Configuration
Create a MySQL database and user:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE carbon_footprint_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace with your credentials)
CREATE USER 'carbon_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON carbon_footprint_db.* TO 'carbon_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 4. Environment Configuration
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

### 5. Initialize Database
Run the simple setup script:

```bash
cd backend
python scripts/simple_setup.py
```

### 6. Start the Application
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 API Endpoints

### Authentication Endpoints
- `POST /auth/register` - Register a new user (email, name)
- `POST /auth/login` - Login (creates user if doesn't exist)
- `POST /auth/logout` - Logout (requires X-Session-Token header)
- `GET /auth/me` - Get current user info
- `GET /auth/sessions` - Get user's active sessions

### Carbon Footprint Endpoints
- `POST /carbon-footprint/calculate` - Calculate footprint (authenticated)
- `POST /carbon-footprint/calculate-anonymous` - Calculate footprint (anonymous)
- `GET /carbon-footprint/history` - Get user's history
- `GET /carbon-footprint/stats` - Get user's statistics
- `GET /carbon-footprint/trends` - Get emission trends
- `GET /carbon-footprint/recommendations` - Get recommendations
- `GET /carbon-footprint/goals` - Get user's goals
- `POST /carbon-footprint/goals` - Create new goal
- `GET /carbon-footprint/dashboard` - Get dashboard data

## 🔒 Simple Authentication

### How it Works
1. **Login**: User provides email and name
2. **Auto-Creation**: If user doesn't exist, they're automatically created
3. **Session Token**: A simple session token is generated and returned
4. **Authentication**: Include `X-Session-Token` header in subsequent requests
5. **Session Management**: Tokens expire after 7 days

### Example Usage
```bash
# Login (creates user if doesn't exist)
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe"}'

# Response
{
  "session_token": "abc123...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00"
  },
  "expires_at": "2024-01-08T00:00:00"
}

# Use session token for authenticated requests
curl -X GET "http://localhost:8000/carbon-footprint/history" \
  -H "X-Session-Token: abc123..."
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

### Carbon Footprints Table
```sql
CREATE TABLE carbon_footprints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    calculation_uuid VARCHAR(36) UNIQUE NOT NULL,
    input_data JSON NOT NULL,
    total_emissions DECIMAL(10, 2) NOT NULL,
    confidence_score DECIMAL(5, 4) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    electricity_emissions DECIMAL(10, 2) DEFAULT 0,
    transportation_emissions DECIMAL(10, 2) DEFAULT 0,
    heating_emissions DECIMAL(10, 2) DEFAULT 0,
    waste_emissions DECIMAL(10, 2) DEFAULT 0,
    lifestyle_emissions DECIMAL(10, 2) DEFAULT 0,
    other_emissions DECIMAL(10, 2) DEFAULT 0,
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🛠️ Maintenance

### Regular Tasks
1. **Session Cleanup**: Run cleanup endpoint or scheduled task
2. **Database Optimization**: Run `OPTIMIZE TABLE` on large tables
3. **Backup**: Regular database backups

### Cleanup Expired Sessions
```bash
curl -X POST "http://localhost:8000/auth/cleanup-sessions"
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check MySQL service is running
   - Verify database credentials
   - Check firewall settings

2. **Session Token Invalid**
   - Check if session has expired
   - Verify X-Session-Token header is included
   - Check if user still exists

3. **Database Errors**
   - Check MySQL error logs
   - Verify table permissions
   - Run simple setup script again

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation at `/docs`
3. Check the application logs
4. Contact the development team

---

**Note**: This simplified setup provides a basic but functional carbon footprint application with user management and historical data tracking, perfect for getting started quickly without complex authentication systems.

