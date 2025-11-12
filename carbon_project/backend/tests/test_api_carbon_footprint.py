"""
Integration tests for Carbon Footprint API endpoints
"""
import pytest
from fastapi import status

@pytest.mark.integration
@pytest.mark.api
@pytest.mark.carbon
class TestCarbonFootprintAPI:
    """Test suite for Carbon Footprint API endpoints"""
    
    def test_calculate_endpoint_authenticated(self, authenticated_client, sample_carbon_data):
        """Test carbon footprint calculation for authenticated user"""
        response = authenticated_client.post(
            "/carbon-footprint/calculate",
            json=sample_carbon_data
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "predicted_emissions" in data
        assert "confidence_score" in data
        assert "recommendations" in data
        assert "breakdown" in data
        assert data["predicted_emissions"] > 0
        assert 0 <= data["confidence_score"] <= 1
    
    def test_calculate_endpoint_anonymous(self, client, sample_carbon_data):
        """Test anonymous carbon footprint calculation"""
        response = client.post(
            "/carbon-footprint/calculate-anonymous",
            json=sample_carbon_data
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "predicted_emissions" in data
        assert "confidence_score" in data
        assert data["predicted_emissions"] > 0
    
    def test_calculate_endpoint_invalid_data(self, authenticated_client):
        """Test calculation with invalid data"""
        response = authenticated_client.post(
            "/carbon-footprint/calculate",
            json={
                "household_size": "invalid",  # Should be int
                "electricity_usage_kwh": -100  # Should be positive
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_calculate_endpoint_unauthorized(self, client, sample_carbon_data):
        """Test calculation endpoint without authentication"""
        response = client.post(
            "/carbon-footprint/calculate",
            json=sample_carbon_data
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_get_history_endpoint(self, authenticated_client, sample_carbon_data):
        """Test getting carbon footprint history"""
        # Create some footprints
        for i in range(3):
            data = sample_carbon_data.copy()
            data["electricity_usage_kwh"] = 400 + (i * 50)
            authenticated_client.post(
                "/carbon-footprint/calculate",
                json=data
            )
        
        response = authenticated_client.get("/carbon-footprint/history")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 3
    
    def test_get_history_endpoint_pagination(self, authenticated_client, sample_carbon_data):
        """Test history endpoint with pagination"""
        # Create multiple footprints
        for i in range(5):
            authenticated_client.post(
                "/carbon-footprint/calculate",
                json=sample_carbon_data
            )
        
        response = authenticated_client.get(
            "/carbon-footprint/history?skip=0&limit=2"
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) <= 2
    
    def test_get_stats_endpoint(self, authenticated_client, sample_carbon_data):
        """Test getting carbon footprint statistics"""
        # Create some footprints
        for i in range(3):
            authenticated_client.post(
                "/carbon-footprint/calculate",
                json=sample_carbon_data
            )
        
        response = authenticated_client.get("/carbon-footprint/stats")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total_calculations" in data
        assert "average_emissions" in data
        assert "latest_emissions" in data
        assert data["total_calculations"] == 3
    
    def test_get_trends_endpoint(self, authenticated_client, sample_carbon_data):
        """Test getting emission trends"""
        # Create footprints
        for i in range(3):
            authenticated_client.post(
                "/carbon-footprint/calculate",
                json=sample_carbon_data
            )
        
        response = authenticated_client.get("/carbon-footprint/trends?days=30")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_trends_endpoint_invalid_days(self, authenticated_client):
        """Test trends endpoint with invalid days parameter"""
        response = authenticated_client.get("/carbon-footprint/trends?days=500")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_get_recommendations_endpoint(self, authenticated_client, sample_carbon_data):
        """Test getting recommendations"""
        # Create footprint
        authenticated_client.post(
            "/carbon-footprint/calculate",
            json=sample_carbon_data
        )
        
        response = authenticated_client.get("/carbon-footprint/recommendations")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_dashboard_endpoint(self, authenticated_client, sample_carbon_data):
        """Test getting dashboard data"""
        # Create some data
        authenticated_client.post(
            "/carbon-footprint/calculate",
            json=sample_carbon_data
        )
        
        response = authenticated_client.get("/carbon-footprint/dashboard")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "stats" in data
        assert "trends" in data
        assert "recommendations" in data
        assert "goals" in data
    
    def test_create_goal_endpoint(self, authenticated_client):
        """Test creating a user goal"""
        response = authenticated_client.post(
            "/carbon-footprint/goals",
            json={
                "goal_type": "reduction",
                "target_emissions": 5000.0,
                "reduction_percentage": 20.0,
                "target_date": "2024-12-31",
                "description": "Reduce carbon footprint by 20%"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "id" in data
        assert data["goal_type"] == "reduction"
    
    def test_get_goals_endpoint(self, authenticated_client):
        """Test getting user goals"""
        # Create a goal
        authenticated_client.post(
            "/carbon-footprint/goals",
            json={
                "goal_type": "reduction",
                "target_emissions": 5000.0,
                "reduction_percentage": 20.0,
                "target_date": "2024-12-31",
                "description": "Test goal"
            }
        )
        
        response = authenticated_client.get("/carbon-footprint/goals")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

