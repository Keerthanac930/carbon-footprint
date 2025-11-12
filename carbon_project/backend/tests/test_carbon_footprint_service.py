"""
Unit tests for CarbonFootprintService
"""
import pytest
from decimal import Decimal

from app.services.carbon_footprint_service import CarbonFootprintService

@pytest.mark.unit
@pytest.mark.carbon
class TestCarbonFootprintService:
    """Test suite for CarbonFootprintService"""
    
    def test_calculate_carbon_footprint(self, test_db, test_user, sample_carbon_data):
        """Test carbon footprint calculation"""
        service = CarbonFootprintService(test_db)
        
        footprint = service.calculate_carbon_footprint(
            user_id=test_user.id,
            input_data=sample_carbon_data
        )
        
        assert footprint is not None
        assert footprint.total_emissions > 0
        assert footprint.confidence_score > 0
        assert footprint.user_id == test_user.id
        assert footprint.model_name is not None
    
    def test_calculate_carbon_footprint_anonymous(self, test_db, sample_carbon_data):
        """Test anonymous carbon footprint calculation"""
        service = CarbonFootprintService(test_db)
        
        footprint = service.calculate_carbon_footprint(
            user_id=None,
            input_data=sample_carbon_data
        )
        
        assert footprint is not None
        assert footprint.total_emissions > 0
        assert footprint.is_anonymous is True
    
    def test_get_user_footprints(self, test_db, test_user, sample_carbon_data):
        """Test retrieving user's carbon footprint history"""
        service = CarbonFootprintService(test_db)
        
        # Create multiple footprints
        for i in range(3):
            data = sample_carbon_data.copy()
            data["electricity_usage_kwh"] = 500 + (i * 100)
            service.calculate_carbon_footprint(
                user_id=test_user.id,
                input_data=data
            )
        
        footprints = service.get_user_footprints(test_user.id)
        
        assert len(footprints) == 3
        assert all(f.user_id == test_user.id for f in footprints)
    
    def test_get_footprint_by_id(self, test_db, test_user, sample_carbon_data):
        """Test retrieving footprint by ID"""
        service = CarbonFootprintService(test_db)
        
        footprint = service.calculate_carbon_footprint(
            user_id=test_user.id,
            input_data=sample_carbon_data
        )
        
        retrieved = service.get_footprint_by_id(footprint.id, test_user.id)
        
        assert retrieved is not None
        assert retrieved.id == footprint.id
        assert retrieved.user_id == test_user.id
    
    def test_get_footprint_by_id_wrong_user(self, test_db, multiple_test_users, sample_carbon_data):
        """Test that users can't access other users' footprints"""
        service = CarbonFootprintService(test_db)
        
        # Create footprint for user 0
        footprint = service.calculate_carbon_footprint(
            user_id=multiple_test_users[0].id,
            input_data=sample_carbon_data
        )
        
        # Try to access with user 1
        retrieved = service.get_footprint_by_id(footprint.id, multiple_test_users[1].id)
        
        assert retrieved is None  # Should not be accessible
    
    def test_get_footprint_stats(self, test_db, test_user, sample_carbon_data):
        """Test getting user's carbon footprint statistics"""
        service = CarbonFootprintService(test_db)
        
        # Create multiple footprints
        for i in range(5):
            data = sample_carbon_data.copy()
            data["electricity_usage_kwh"] = 400 + (i * 50)
            service.calculate_carbon_footprint(
                user_id=test_user.id,
                input_data=data
            )
        
        stats = service.get_footprint_stats(test_user.id)
        
        assert stats is not None
        assert stats.total_calculations == 5
        assert stats.average_emissions > 0
        assert stats.latest_emissions > 0
    
    def test_get_emission_trends(self, test_db, test_user, sample_carbon_data):
        """Test getting emission trends"""
        service = CarbonFootprintService(test_db)
        
        # Create footprints
        for i in range(3):
            data = sample_carbon_data.copy()
            service.calculate_carbon_footprint(
                user_id=test_user.id,
                input_data=data
            )
        
        trends = service.get_emission_trends(test_user.id, days=30)
        
        assert isinstance(trends, list)
        assert len(trends) > 0
    
    def test_get_recommendations(self, test_db, test_user, sample_carbon_data):
        """Test getting recommendations"""
        service = CarbonFootprintService(test_db)
        
        # Create footprint
        service.calculate_carbon_footprint(
            user_id=test_user.id,
            input_data=sample_carbon_data
        )
        
        recommendations = service.get_recommendations(test_user.id)
        
        assert isinstance(recommendations, list)
    
    def test_get_dashboard_data(self, test_db, test_user, sample_carbon_data):
        """Test getting comprehensive dashboard data"""
        service = CarbonFootprintService(test_db)
        
        # Create some data
        service.calculate_carbon_footprint(
            user_id=test_user.id,
            input_data=sample_carbon_data
        )
        
        dashboard = service.get_dashboard_data(test_user.id)
        
        assert dashboard is not None
        assert "stats" in dashboard
        assert "trends" in dashboard
        assert "recommendations" in dashboard
        assert "goals" in dashboard
    
    def test_calculate_breakdown(self, test_db, sample_carbon_data):
        """Test emissions breakdown calculation"""
        service = CarbonFootprintService(test_db)
        
        # Calculate footprint to get total
        footprint = service.calculate_carbon_footprint(
            user_id=None,
            input_data=sample_carbon_data
        )
        
        # Check breakdown exists in footprint
        assert footprint.electricity_emissions is not None
        assert footprint.transportation_emissions is not None
        assert footprint.heating_emissions is not None
        assert footprint.waste_emissions is not None
        assert footprint.lifestyle_emissions is not None

