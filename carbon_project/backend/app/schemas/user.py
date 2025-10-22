from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

# Simple user schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Simple authentication schemas
class LoginRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

class LoginResponse(BaseModel):
    session_token: str
    user: UserResponse
    expires_at: datetime

# Session schemas
class SessionInfo(BaseModel):
    session_id: int
    created_at: datetime
    expires_at: datetime

class UserSessionsResponse(BaseModel):
    active_sessions: List[SessionInfo]
    total_sessions: int

# User statistics
class UserStatsResponse(BaseModel):
    total_calculations: int
    average_emissions: float
    min_emissions: float
    max_emissions: float
    emissions_stddev: float
    last_calculation_date: Optional[datetime]
    calculations_last_30_days: int
    calculations_last_7_days: int

# Search and pagination
class UserSearchRequest(BaseModel):
    query: str
    skip: int = 0
    limit: int = 100

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    skip: int
    limit: int
