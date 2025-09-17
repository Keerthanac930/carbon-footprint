# Carbon Footprint Database Setup Guide

This guide will help you set up the MySQL database for the Carbon Footprint application with user management, authentication, and historical data tracking.

## 🗄️ Database Schema Overview

The database includes the following main tables:

### Core Tables
- **`users`** - User accounts and authentication
- **`user_profiles`** - Extended user information
- **`user_sessions`** - Active user sessions
- **`carbon_footprints`** - Carbon footprint calculations
- **`recommendations`** - Personalized recommendations
- **`user_goals`** - User-defined carbon reduction goals
- **`audit_logs`** - System audit trail
- **`system_config`** - Application configuration

### Key Features
- ✅ User registration and authentication
- ✅ JWT-based session management
- ✅ Historical carbon footprint tracking
- ✅ Personalized recommendations
- ✅ Goal setting and progress tracking
- ✅ Comprehensive audit logging
- ✅ Data analytics and reporting

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

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application Configuration
APP_NAME=Carbon Footprint Calculator
APP_VERSION=1.0.0
DEBUG=True
ENVIRONMENT=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080
```

### 5. Initialize Database

Run the database initialization script:

```bash
cd backend
python scripts/init_database.py
```

This will:
- Create the database if it doesn't exist
- Run the schema SQL to create all tables
- Set up indexes and constraints
- Create stored procedures and views
- Insert default configuration

### 6. Start the Application

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📊 Database Schema Details

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

## 🔧 API Endpoints

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info
- `POST /auth/change-password` - Change password
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/reset-password` - Reset password

### Carbon Footprint Endpoints
- `POST /carbon-footprint/calculate` - Calculate footprint (authenticated)
- `POST /carbon-footprint/calculate-anonymous` - Calculate footprint (anonymous)
- `GET /carbon-footprint/history` - Get user's history
- `GET /carbon-footprint/stats` - Get user's statistics
- `GET /carbon-footprint/trends` - Get emission trends
- `GET /carbon-footprint/recommendations` - Get recommendations
- `POST /carbon-footprint/recommendations/{id}/implement` - Mark recommendation as implemented
- `GET /carbon-footprint/goals` - Get user's goals
- `POST /carbon-footprint/goals` - Create new goal
- `GET /carbon-footprint/dashboard` - Get dashboard data

## 🔒 Security Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Password hashing using bcrypt
- Session management with automatic cleanup
- Email verification for new accounts
- Password reset functionality

### Data Protection
- Input validation using Pydantic schemas
- SQL injection prevention with SQLAlchemy ORM
- CORS configuration for cross-origin requests
- Rate limiting capabilities
- Audit logging for all data changes

### User Privacy
- Anonymous calculation support
- Data anonymization options
- User data export capabilities
- Account deletion with data cleanup

## 📈 Analytics and Reporting

### Built-in Views
- `user_carbon_summary` - User statistics summary
- `recent_calculations` - Recent calculations across all users

### Stored Procedures
- `GetUserCarbonHistory(user_id, limit)` - Get user's calculation history
- `GetUserStats(user_id)` - Get user's statistical data
- `CleanupExpiredSessions()` - Clean up expired sessions

### Key Metrics Tracked
- Total calculations per user
- Average, min, max emissions
- Emission trends over time
- Recommendation implementation rates
- Goal achievement rates
- User engagement metrics

## 🛠️ Maintenance

### Regular Tasks
1. **Session Cleanup**: Run `CleanupExpiredSessions()` procedure
2. **Audit Log Rotation**: Archive old audit logs
3. **Database Optimization**: Run `OPTIMIZE TABLE` on large tables
4. **Backup**: Regular database backups

### Monitoring
- Monitor database performance
- Track user growth and engagement
- Monitor API response times
- Check error rates and logs

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check MySQL service is running
   - Verify database credentials
   - Check firewall settings

2. **Authentication Failed**
   - Verify JWT secret key
   - Check token expiration settings
   - Ensure proper CORS configuration

3. **Database Errors**
   - Check MySQL error logs
   - Verify table permissions
   - Run database initialization script

### Debug Mode
Set `DEBUG=True` in your `.env` file for detailed error messages and SQL query logging.

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation at `/docs`
3. Check the application logs
4. Contact the development team

---

**Note**: This database setup provides a robust foundation for a production-ready carbon footprint application with comprehensive user management and data tracking capabilities.
