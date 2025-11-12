from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os
from typing import Generator
from dotenv import load_dotenv

from app.config import settings

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL") or settings.DATABASE_URL

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False  # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db() -> Generator:
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    Create all tables in the database
    """
    # Import models to register them with Base.metadata
    from ..models.user import User, UserSession
    from ..models.carbon_footprint import CarbonFootprint, Recommendation, UserGoal, AuditLog
    
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """
    Drop all tables in the database
    """
    Base.metadata.drop_all(bind=engine)


def test_database_connection() -> bool:
    """
    Attempt to establish a database connection and run a lightweight query.
    Returns True when successful, otherwise False.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as exc:  # pylint: disable=broad-except
        print(f"❌ Database connectivity check failed: {exc}")
        return False
