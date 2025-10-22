from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional, List
from datetime import datetime, timedelta
import secrets

from ..models.user import User, UserSession
from ..schemas.user import UserCreate, UserUpdate

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        db_user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=user_data.password
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get list of all users"""
        return self.db.query(User).offset(skip).limit(limit).all()
    
    def search_users(self, query: str, skip: int = 0, limit: int = 100) -> List[User]:
        """Search users by email or name"""
        return self.db.query(User).filter(
            or_(
                User.email.ilike(f"%{query}%"),
                User.name.ilike(f"%{query}%")
            )
        ).offset(skip).limit(limit).all()
    
    def delete_user(self, user_id: int) -> bool:
        """Delete user"""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        self.db.delete(user)
        self.db.commit()
        return True

class UserSessionRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_session(self, user_id: int, session_token: str, expires_at: datetime) -> UserSession:
        """Create user session"""
        db_session = UserSession(
            user_id=user_id,
            session_token=session_token,
            expires_at=expires_at
        )
        self.db.add(db_session)
        self.db.commit()
        self.db.refresh(db_session)
        return db_session
    
    def get_session_by_token(self, session_token: str) -> Optional[UserSession]:
        """Get session by token"""
        return self.db.query(UserSession).filter(
            and_(
                UserSession.session_token == session_token,
                UserSession.expires_at > datetime.utcnow()
            )
        ).first()
    
    def invalidate_session(self, session_token: str) -> bool:
        """Invalidate user session"""
        session = self.get_session_by_token(session_token)
        if not session:
            return False
        
        self.db.delete(session)
        self.db.commit()
        return True
    
    def invalidate_user_sessions(self, user_id: int) -> int:
        """Invalidate all user sessions"""
        sessions = self.db.query(UserSession).filter(UserSession.user_id == user_id).all()
        
        count = 0
        for session in sessions:
            self.db.delete(session)
            count += 1
        
        self.db.commit()
        return count
    
    def cleanup_expired_sessions(self) -> int:
        """Clean up expired sessions"""
        expired_sessions = self.db.query(UserSession).filter(
            UserSession.expires_at < datetime.utcnow()
        ).all()
        
        count = 0
        for session in expired_sessions:
            self.db.delete(session)
            count += 1
        
        self.db.commit()
        return count
