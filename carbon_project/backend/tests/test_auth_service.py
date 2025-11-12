"""
Unit tests for AuthService
"""
import pytest
from datetime import datetime, timedelta
from fastapi import HTTPException

from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, LoginRequest

@pytest.mark.unit
@pytest.mark.auth
class TestAuthService:
    """Test suite for AuthService"""
    
    def test_hash_password(self, test_db):
        """Test password hashing"""
        auth_service = AuthService(test_db)
        password = "TestPassword123!"
        hashed = auth_service.hash_password(password)
        
        assert hashed != password
        assert len(hashed) > 50  # bcrypt hashes are long
        assert hashed.startswith("$2b$")  # bcrypt format
    
    def test_verify_password_correct(self, test_db):
        """Test password verification with correct password"""
        auth_service = AuthService(test_db)
        password = "TestPassword123!"
        hashed = auth_service.hash_password(password)
        
        assert auth_service.verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self, test_db):
        """Test password verification with incorrect password"""
        auth_service = AuthService(test_db)
        password = "TestPassword123!"
        wrong_password = "WrongPassword123!"
        hashed = auth_service.hash_password(password)
        
        assert auth_service.verify_password(wrong_password, hashed) is False
    
    def test_register_new_user(self, test_db):
        """Test user registration"""
        auth_service = AuthService(test_db)
        user_data = UserCreate(
            email="newuser@example.com",
            name="New User",
            password="SecurePassword123!"
        )
        
        user = auth_service.register(user_data)
        
        assert user is not None
        assert user.email == "newuser@example.com"
        assert user.name == "New User"
        assert user.password_hash != "SecurePassword123!"  # Should be hashed
    
    def test_register_duplicate_email(self, test_db):
        """Test registration with duplicate email"""
        auth_service = AuthService(test_db)
        user_data = UserCreate(
            email="duplicate@example.com",
            name="User 1",
            password="Password123!"
        )
        
        # First registration should succeed
        auth_service.register(user_data)
        
        # Second registration should fail
        with pytest.raises(HTTPException) as exc_info:
            auth_service.register(user_data)
        
        assert exc_info.value.status_code == 400
        assert "Email already registered" in str(exc_info.value.detail)
    
    def test_login_success(self, test_db, test_user):
        """Test successful login"""
        auth_service = AuthService(test_db)
        login_data = LoginRequest(
            email="test@example.com",
            name="Test User",
            password="TestPassword123!"
        )
        
        response = auth_service.login(login_data)
        
        assert response is not None
        assert response.session_token is not None
        assert len(response.session_token) > 20
        assert response.user.email == "test@example.com"
        assert response.expires_at > datetime.utcnow()
    
    def test_login_wrong_password(self, test_db, test_user):
        """Test login with wrong password"""
        auth_service = AuthService(test_db)
        login_data = LoginRequest(
            email="test@example.com",
            name="Test User",
            password="WrongPassword123!"
        )
        
        with pytest.raises(HTTPException) as exc_info:
            auth_service.login(login_data)
        
        assert exc_info.value.status_code == 401
        assert "Incorrect password" in str(exc_info.value.detail)
    
    def test_login_nonexistent_user(self, test_db):
        """Test login with non-existent user"""
        auth_service = AuthService(test_db)
        login_data = LoginRequest(
            email="nonexistent@example.com",
            name="Nonexistent",
            password="SomePassword123!"
        )
        
        with pytest.raises(HTTPException) as exc_info:
            auth_service.login(login_data)
        
        assert exc_info.value.status_code == 401
        assert "Email not found" in str(exc_info.value.detail)
    
    def test_get_current_user_valid_token(self, test_db, test_user):
        """Test getting current user with valid token"""
        auth_service = AuthService(test_db)
        login_data = LoginRequest(
            email="test@example.com",
            name="Test User",
            password="TestPassword123!"
        )
        
        login_response = auth_service.login(login_data)
        user = auth_service.get_current_user(login_response.session_token)
        
        assert user is not None
        assert user.email == "test@example.com"
        assert user.id == test_user.id
    
    def test_get_current_user_invalid_token(self, test_db):
        """Test getting current user with invalid token"""
        auth_service = AuthService(test_db)
        user = auth_service.get_current_user("invalid_token_12345")
        
        assert user is None
    
    def test_logout(self, test_db, test_user):
        """Test user logout"""
        auth_service = AuthService(test_db)
        login_data = LoginRequest(
            email="test@example.com",
            name="Test User",
            password="TestPassword123!"
        )
        
        login_response = auth_service.login(login_data)
        session_token = login_response.session_token
        
        # Verify session exists
        user = auth_service.get_current_user(session_token)
        assert user is not None
        
        # Logout
        result = auth_service.logout(session_token)
        assert result is True
        
        # Verify session is invalidated
        user = auth_service.get_current_user(session_token)
        assert user is None
    
    def test_logout_all_sessions(self, test_db, test_user):
        """Test logging out from all sessions"""
        auth_service = AuthService(test_db)
        login_data = LoginRequest(
            email="test@example.com",
            name="Test User",
            password="TestPassword123!"
        )
        
        # Create multiple sessions
        session1 = auth_service.login(login_data)
        session2 = auth_service.login(login_data)
        session3 = auth_service.login(login_data)
        
        # Verify all sessions work
        assert auth_service.get_current_user(session1.session_token) is not None
        assert auth_service.get_current_user(session2.session_token) is not None
        assert auth_service.get_current_user(session3.session_token) is not None
        
        # Logout all
        count = auth_service.logout_all_sessions(test_user.id)
        assert count == 3
        
        # Verify all sessions are invalidated
        assert auth_service.get_current_user(session1.session_token) is None
        assert auth_service.get_current_user(session2.session_token) is None
        assert auth_service.get_current_user(session3.session_token) is None
    
    def test_create_session_token(self, test_db):
        """Test session token creation"""
        auth_service = AuthService(test_db)
        token1 = auth_service.create_session_token()
        token2 = auth_service.create_session_token()
        
        assert token1 is not None
        assert token2 is not None
        assert token1 != token2  # Should be unique
        assert len(token1) > 20  # Should be reasonably long

