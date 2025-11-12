"""
Database integration tests
"""
import pytest
from sqlalchemy import text

from app.models.user import User
from app.models.carbon_footprint import CarbonFootprint
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate

@pytest.mark.database
@pytest.mark.integration
class TestDatabase:
    """Test suite for database operations"""
    
    def test_database_connection(self, test_db):
        """Test database connection"""
        result = test_db.execute(text("SELECT 1"))
        assert result.fetchone()[0] == 1
    
    def test_user_table_creation(self, test_db):
        """Test that user table can be created and used"""
        user_repo = UserRepository(test_db)
        user_data = UserCreate(
            email="dbtest@example.com",
            name="DB Test User",
            password="TestPassword123!"
        )
        
        user = user_repo.create_user(user_data)
        
        assert user is not None
        assert user.id is not None
        assert user.email == "dbtest@example.com"
    
    def test_user_query(self, test_db):
        """Test querying users from database"""
        user_repo = UserRepository(test_db)
        
        # Create user
        user_data = UserCreate(
            email="querytest@example.com",
            name="Query Test",
            password="TestPassword123!"
        )
        created_user = user_repo.create_user(user_data)
        
        # Query by email
        found_user = user_repo.get_user_by_email("querytest@example.com")
        
        assert found_user is not None
        assert found_user.id == created_user.id
        assert found_user.email == created_user.email
    
    def test_user_update(self, test_db):
        """Test updating user information"""
        from app.schemas.user import UserUpdate
        
        user_repo = UserRepository(test_db)
        
        # Create user
        user_data = UserCreate(
            email="updatetest@example.com",
            name="Update Test",
            password="TestPassword123!"
        )
        user = user_repo.create_user(user_data)
        
        # Update user
        update_data = UserUpdate(name="Updated Name")
        updated_user = user_repo.update_user(user.id, update_data)
        
        assert updated_user is not None
        assert updated_user.name == "Updated Name"
        assert updated_user.email == "updatetest@example.com"
    
    def test_user_delete(self, test_db):
        """Test deleting user"""
        user_repo = UserRepository(test_db)
        
        # Create user
        user_data = UserCreate(
            email="deletetest@example.com",
            name="Delete Test",
            password="TestPassword123!"
        )
        user = user_repo.create_user(user_data)
        user_id = user.id
        
        # Delete user
        result = user_repo.delete_user(user_id)
        
        assert result is True
        
        # Verify deletion
        deleted_user = user_repo.get_user_by_id(user_id)
        assert deleted_user is None
    
    def test_session_creation(self, test_db, test_user):
        """Test user session creation"""
        from app.repositories.user_repository import UserSessionRepository
        from datetime import datetime, timedelta
        
        session_repo = UserSessionRepository(test_db)
        
        session = session_repo.create_session(
            user_id=test_user.id,
            session_token="test_token_12345",
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        
        assert session is not None
        assert session.user_id == test_user.id
        assert session.session_token == "test_token_12345"
    
    def test_session_retrieval(self, test_db, test_user):
        """Test retrieving session by token"""
        from app.repositories.user_repository import UserSessionRepository
        from datetime import datetime, timedelta
        
        session_repo = UserSessionRepository(test_db)
        
        token = "retrieve_test_token"
        session_repo.create_session(
            user_id=test_user.id,
            session_token=token,
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        
        retrieved = session_repo.get_session_by_token(token)
        
        assert retrieved is not None
        assert retrieved.session_token == token
        assert retrieved.user_id == test_user.id
    
    def test_carbon_footprint_creation(self, test_db, test_user):
        """Test carbon footprint record creation"""
        from app.repositories.carbon_footprint_repository import CarbonFootprintRepository
        from app.schemas.carbon_footprint import CarbonFootprintCreate
        from decimal import Decimal
        
        footprint_repo = CarbonFootprintRepository(test_db)
        
        footprint_data = CarbonFootprintCreate(
            input_data={"test": "data"},
            total_emissions=Decimal("5000.0"),
            confidence_score=Decimal("0.95"),
            model_name="test_model",
            model_version="v1"
        )
        
        footprint = footprint_repo.create_carbon_footprint(test_user.id, footprint_data)
        
        assert footprint is not None
        assert footprint.user_id == test_user.id
        assert float(footprint.total_emissions) == 5000.0
    
    def test_carbon_footprint_query(self, test_db, test_user):
        """Test querying carbon footprints"""
        from app.repositories.carbon_footprint_repository import CarbonFootprintRepository
        from app.schemas.carbon_footprint import CarbonFootprintCreate
        from decimal import Decimal
        
        footprint_repo = CarbonFootprintRepository(test_db)
        
        # Create multiple footprints
        for i in range(3):
            footprint_data = CarbonFootprintCreate(
                input_data={"test": f"data{i}"},
                total_emissions=Decimal(f"{5000 + i * 100}"),
                confidence_score=Decimal("0.95"),
                model_name="test_model",
                model_version="v1"
            )
            footprint_repo.create_carbon_footprint(test_user.id, footprint_data)
        
        # Query footprints
        footprints = footprint_repo.get_user_footprints(test_user.id, skip=0, limit=10)
        
        assert len(footprints) == 3
        assert all(f.user_id == test_user.id for f in footprints)

