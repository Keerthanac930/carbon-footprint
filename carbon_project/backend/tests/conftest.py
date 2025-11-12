"""
Pytest configuration and fixtures for all tests
"""
import pytest
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import Base, get_db
from app.main import app
from app.models.user import User
from app.models.carbon_footprint import CarbonFootprint
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate

# Test database URL (SQLite in-memory for fast tests)
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def test_db():
    """Create a test database session"""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with test database"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(test_db):
    """Create a test user"""
    auth_service = AuthService(test_db)
    user_data = UserCreate(
        email="test@example.com",
        name="Test User",
        password="TestPassword123!"
    )
    user = auth_service.register(user_data)
    return user

@pytest.fixture
def authenticated_client(client, test_user):
    """Create an authenticated test client"""
    # Login to get session token
    login_response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "TestPassword123!"
        }
    )
    assert login_response.status_code == 200
    session_token = login_response.json()["session_token"]
    
    # Set default headers
    client.headers = {"X-Session-Token": session_token}
    return client

@pytest.fixture
def sample_carbon_data():
    """Sample carbon footprint calculation data"""
    return {
        "household_size": 4,
        "electricity_usage_kwh": 500,
        "home_size_sqft": 2000,
        "heating_energy_source": "Natural Gas",
        "vehicle_type": "Gasoline",
        "climate_zone": "Moderate",
        "meat_consumption": "Medium",
        "shopping_frequency": "Weekly",
        "social_activity": "Medium",
        "vehicle_monthly_distance_km": 800.0,
        "heating_efficiency": 0.7,
        "cooling_efficiency": 0.6,
        "heating_days": 120,
        "cooling_days": 90,
        "waste_bag_weekly_count": 2,
        "new_clothes_monthly": 2,
        "vehicles_per_household": 1,
        "monthly_grocery_bill": 400.0
    }

@pytest.fixture
def multiple_test_users(test_db):
    """Create multiple test users"""
    auth_service = AuthService(test_db)
    users = []
    for i in range(3):
        user_data = UserCreate(
            email=f"user{i}@example.com",
            name=f"User {i}",
            password="TestPassword123!"
        )
        user = auth_service.register(user_data)
        users.append(user)
    return users

