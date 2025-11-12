from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional

from ..database.connection import get_db
from ..services.auth_service import AuthService
from ..schemas.user import (
    LoginRequest, LoginResponse, UserCreate, UserResponse, 
    UserSessionsResponse
)

router = APIRouter(prefix="/auth", tags=["authentication"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

def get_current_user(
    session_token: str = Header(..., alias="X-Session-Token"),
    auth_service: AuthService = Depends(get_auth_service)
) -> UserResponse:
    """Get current authenticated user"""
    user = auth_service.get_current_user(session_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token"
        )
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user"""
    try:
        user = auth_service.register(user_data)
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """User login - optimized async version with fallback"""
    try:
        # Try async login method first (faster, non-blocking)
        try:
            response = await auth_service.login_async(login_data)
            return response
        except Exception as async_error:
            # If async fails, fallback to synchronous method
            print(f"Async login failed, using sync fallback: {async_error}")
            response = auth_service.login(login_data)
            return response
    except HTTPException:
        raise
    except Exception as e:
        # Log the error for debugging
        import traceback
        print(f"Login endpoint error: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed. Please check your connection and try again."
        )

@router.post("/logout")
async def logout(
    session_token: str = Header(..., alias="X-Session-Token"),
    auth_service: AuthService = Depends(get_auth_service)
):
    """User logout"""
    try:
        success = auth_service.logout(session_token)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Logout failed"
            )
        return {"message": "Successfully logged out"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.post("/logout-all")
async def logout_all_sessions(
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Logout from all sessions"""
    try:
        count = auth_service.logout_all_sessions(current_user.id)
        return {"message": f"Logged out from {count} sessions"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: UserResponse = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

@router.get("/sessions", response_model=UserSessionsResponse)
async def get_user_sessions(
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get user's active sessions"""
    try:
        sessions = auth_service.get_user_sessions(current_user.id)
        return UserSessionsResponse(
            active_sessions=sessions,
            total_sessions=len(sessions)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get sessions: {str(e)}"
        )

@router.post("/cleanup-sessions")
async def cleanup_expired_sessions(
    auth_service: AuthService = Depends(get_auth_service)
):
    """Clean up expired sessions (admin endpoint)"""
    try:
        count = auth_service.cleanup_expired_sessions()
        return {"message": f"Cleaned up {count} expired sessions"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Session cleanup failed: {str(e)}"
        )
