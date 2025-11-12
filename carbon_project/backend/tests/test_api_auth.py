"""
Integration tests for Authentication API endpoints
"""
import pytest
from fastapi import status

@pytest.mark.integration
@pytest.mark.api
@pytest.mark.auth
class TestAuthAPI:
    """Test suite for Authentication API endpoints"""
    
    def test_register_endpoint_success(self, client):
        """Test successful user registration"""
        response = client.post(
            "/auth/register",
            json={
                "email": "newuser@example.com",
                "name": "New User",
                "password": "SecurePassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["name"] == "New User"
        assert "password" not in data  # Password should not be returned
    
    def test_register_endpoint_duplicate_email(self, client, test_user):
        """Test registration with duplicate email"""
        response = client.post(
            "/auth/register",
            json={
                "email": "test@example.com",
                "name": "Another User",
                "password": "AnotherPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Email already registered" in response.json()["detail"]
    
    def test_register_endpoint_invalid_data(self, client):
        """Test registration with invalid data"""
        response = client.post(
            "/auth/register",
            json={
                "email": "invalid-email",  # Invalid email format
                "name": "User",
                "password": "short"  # Too short
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_login_endpoint_success(self, client, test_user):
        """Test successful login"""
        response = client.post(
            "/auth/login",
            json={
                "email": "test@example.com",
                "name": "Test User",
                "password": "TestPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "session_token" in data
        assert "user" in data
        assert data["user"]["email"] == "test@example.com"
        assert "expires_at" in data
    
    def test_login_endpoint_wrong_password(self, client, test_user):
        """Test login with wrong password"""
        response = client.post(
            "/auth/login",
            json={
                "email": "test@example.com",
                "name": "Test User",
                "password": "WrongPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Incorrect password" in response.json()["detail"]
    
    def test_login_endpoint_nonexistent_user(self, client):
        """Test login with non-existent user"""
        response = client.post(
            "/auth/login",
            json={
                "email": "nonexistent@example.com",
                "name": "Nonexistent",
                "password": "SomePassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Email not found" in response.json()["detail"]
    
    def test_get_current_user_endpoint(self, authenticated_client):
        """Test getting current user info"""
        response = authenticated_client.get("/auth/me")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "email" in data
        assert "name" in data
        assert "id" in data
    
    def test_get_current_user_endpoint_unauthorized(self, client):
        """Test getting current user without authentication"""
        response = client.get("/auth/me")
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_logout_endpoint(self, authenticated_client):
        """Test logout"""
        response = authenticated_client.post("/auth/logout")
        
        assert response.status_code == status.HTTP_200_OK
        assert "Successfully logged out" in response.json()["message"]
        
        # Verify session is invalidated
        me_response = authenticated_client.get("/auth/me")
        assert me_response.status_code != status.HTTP_200_OK
    
    def test_logout_all_endpoint(self, authenticated_client):
        """Test logout from all sessions"""
        response = authenticated_client.post("/auth/logout-all")
        
        assert response.status_code == status.HTTP_200_OK
        assert "Logged out" in response.json()["message"]
    
    def test_get_user_sessions_endpoint(self, authenticated_client):
        """Test getting user sessions"""
        response = authenticated_client.get("/auth/sessions")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "active_sessions" in data
        assert "total_sessions" in data
        assert isinstance(data["active_sessions"], list)

