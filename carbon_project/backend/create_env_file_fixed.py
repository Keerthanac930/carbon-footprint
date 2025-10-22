#!/usr/bin/env python3
"""
Create .env file for MySQL configuration with proper password encoding
"""

import urllib.parse

def create_env_file():
    """Create .env file with MySQL configuration"""
    print("🔧 Creating .env file for MySQL configuration...")
    
    # MySQL password with special characters
    mysql_password = "Keerthu@73380"
    encoded_password = urllib.parse.quote(mysql_password)
    
    env_content = f"""# Carbon Footprint Project - Environment Configuration
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD={mysql_password}
DB_NAME=carbon_footprint_db
DATABASE_URL=mysql+pymysql://root:{encoded_password}@localhost:3306/carbon_footprint_db

# JWT Configuration (for authentication)
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application Configuration
APP_NAME=Carbon Footprint Calculator
APP_VERSION=1.0.0
DEBUG=True
ENVIRONMENT=development

# CORS Configuration (for frontend connection)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=100

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ .env file created successfully with proper password encoding!")
        print(f"   Original password: {mysql_password}")
        print(f"   Encoded password: {encoded_password}")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

if __name__ == "__main__":
    create_env_file()
