from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
import secrets
import bcrypt

from ..repositories.user_repository import UserRepository, UserSessionRepository
from ..schemas.user import LoginRequest, LoginResponse, UserCreate, UserResponse

class AuthService:
    def __init__(self, db_session):
        self.db = db_session
        self.user_repo = UserRepository(db_session)
        self.session_repo = UserSessionRepository(db_session)
    
    def create_session_token(self) -> str:
        """Create a simple session token"""
        return secrets.token_urlsafe(32)
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def login(self, login_data: LoginRequest) -> LoginResponse:
        """User login with password authentication - ONLY for registered users"""
        # Check if user exists
        user = self.user_repo.get_user_by_email(login_data.email)
        
        # Reject login if user doesn't exist - specific error message
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not found. Please register first or check your email address."
            )
        
        # Verify password for existing user - specific error message
        if not self.verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password. Please try again."
            )
        
        # Create session token
        session_token = self.create_session_token()
        expires_at = datetime.utcnow() + timedelta(days=7)  # 7 days session
        
        # Create session
        self.session_repo.create_session(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        return LoginResponse(
            session_token=session_token,
            user=UserResponse.from_orm(user),
            expires_at=expires_at
        )
    
    def register(self, user_data: UserCreate) -> UserResponse:
        """User registration"""
        # Check if user already exists
        if self.user_repo.get_user_by_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password and create new UserCreate object
        hashed_password = self.hash_password(user_data.password)
        
        # Create UserCreate with hashed password (validates hash length > 8)
        hashed_user_data = UserCreate(
            email=user_data.email,
            name=user_data.name,
            password=hashed_password
        )
        
        # Create user
        user = self.user_repo.create_user(hashed_user_data)
        return UserResponse.from_orm(user)
    
    def logout(self, session_token: str) -> bool:
        """User logout"""
        return self.session_repo.invalidate_session(session_token)
    
    def logout_all_sessions(self, user_id: int) -> int:
        """Logout user from all sessions"""
        return self.session_repo.invalidate_user_sessions(user_id)
    
    def get_current_user(self, session_token: str) -> Optional[UserResponse]:
        """Get current user from session token"""
        session = self.session_repo.get_session_by_token(session_token)
        if not session:
            return None
        
        user = self.user_repo.get_user_by_id(session.user_id)
        if not user:
            return None
        
        return UserResponse.from_orm(user)
    
    def cleanup_expired_sessions(self) -> int:
        """Clean up expired sessions"""
        return self.session_repo.cleanup_expired_sessions()
    
    def get_user_sessions(self, user_id: int) -> list:
        """Get user's active sessions"""
        sessions = self.db.query(UserSession).filter(UserSession.user_id == user_id).all()
        
        return [
            {
                "session_id": session.id,
                "created_at": session.created_at,
                "expires_at": session.expires_at
            }
            for session in sessions
        ]
