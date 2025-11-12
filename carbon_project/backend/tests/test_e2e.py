"""
End-to-end tests for the complete application flow
"""
import pytest
from fastapi import status

@pytest.mark.integration
class TestEndToEnd:
    """End-to-end test suite for complete user flows"""
    
    def test_complete_user_registration_and_calculation_flow(self, client):
        """Test complete flow: register -> login -> calculate footprint"""
        # Step 1: Register new user
        register_response = client.post(
            "/auth/register",
            json={
                "email": "e2e@example.com",
                "name": "E2E Test User",
                "password": "E2EPassword123!"
            }
        )
        assert register_response.status_code == status.HTTP_201_CREATED
        
        # Step 2: Login
        login_response = client.post(
            "/auth/login",
            json={
                "email": "e2e@example.com",
                "name": "E2E Test User",
                "password": "E2EPassword123!"
            }
        )
        assert login_response.status_code == status.HTTP_200_OK
        session_token = login_response.json()["session_token"]
        
        # Step 3: Calculate carbon footprint
        calculation_data = {
            "household_size": 4,
            "electricity_usage_kwh": 500,
            "home_size_sqft": 2000,
            "heating_energy_source": "Natural Gas",
            "vehicle_type": "Gasoline",
            "climate_zone": "Moderate",
            "meat_consumption": "Medium",
            "shopping_frequency": "Weekly",
            "social_activity": "Medium",
            "vehicle_monthly_distance_km": 800.0
        }
        
        calc_response = client.post(
            "/carbon-footprint/calculate",
            json=calculation_data,
            headers={"X-Session-Token": session_token}
        )
        assert calc_response.status_code == status.HTTP_200_OK
        assert calc_response.json()["predicted_emissions"] > 0
        
        # Step 4: Get history
        history_response = client.get(
            "/carbon-footprint/history",
            headers={"X-Session-Token": session_token}
        )
        assert history_response.status_code == status.HTTP_200_OK
        assert len(history_response.json()) == 1
        
        # Step 5: Get stats
        stats_response = client.get(
            "/carbon-footprint/stats",
            headers={"X-Session-Token": session_token}
        )
        assert stats_response.status_code == status.HTTP_200_OK
        assert stats_response.json()["total_calculations"] == 1
    
    def test_multiple_calculations_and_trends(self, authenticated_client, sample_carbon_data):
        """Test multiple calculations and trend analysis"""
        # Create multiple calculations
        for i in range(5):
            data = sample_carbon_data.copy()
            data["electricity_usage_kwh"] = 400 + (i * 50)
            response = authenticated_client.post(
                "/carbon-footprint/calculate",
                json=data
            )
            assert response.status_code == status.HTTP_200_OK
        
        # Get history
        history_response = authenticated_client.get("/carbon-footprint/history")
        assert history_response.status_code == status.HTTP_200_OK
        assert len(history_response.json()) == 5
        
        # Get trends
        trends_response = authenticated_client.get("/carbon-footprint/trends?days=30")
        assert trends_response.status_code == status.HTTP_200_OK
        trends = trends_response.json()
        assert isinstance(trends, list)
        
        # Get stats
        stats_response = authenticated_client.get("/carbon-footprint/stats")
        assert stats_response.status_code == status.HTTP_200_OK
        stats = stats_response.json()
        assert stats["total_calculations"] == 5
        assert stats["average_emissions"] > 0
    
    def test_goal_creation_and_tracking(self, authenticated_client, sample_carbon_data):
        """Test creating goals and tracking progress"""
        # Create initial calculation
        calc_response = authenticated_client.post(
            "/carbon-footprint/calculate",
            json=sample_carbon_data
        )
        assert calc_response.status_code == status.HTTP_200_OK
        initial_emissions = calc_response.json()["predicted_emissions"]
        
        # Create a goal
        goal_response = authenticated_client.post(
            "/carbon-footprint/goals",
            json={
                "goal_type": "reduction",
                "target_emissions": initial_emissions * 0.8,  # 20% reduction
                "reduction_percentage": 20.0,
                "target_date": "2024-12-31",
                "description": "Reduce carbon footprint by 20%"
            }
        )
        assert goal_response.status_code == status.HTTP_200_OK
        goal_id = goal_response.json()["id"]
        
        # Get goals
        goals_response = authenticated_client.get("/carbon-footprint/goals")
        assert goals_response.status_code == status.HTTP_200_OK
        goals = goals_response.json()
        assert len(goals) == 1
        
        # Get goal progress
        progress_response = authenticated_client.get(f"/carbon-footprint/goals/{goal_id}/progress")
        assert progress_response.status_code == status.HTTP_200_OK
        progress = progress_response.json()
        assert "current_emissions" in progress
        assert "target_emissions" in progress
    
    def test_session_management_flow(self, client):
        """Test session creation, validation, and logout"""
        # Register and login
        client.post(
            "/auth/register",
            json={
                "email": "session@example.com",
                "name": "Session User",
                "password": "SessionPassword123!"
            }
        )
        
        login_response = client.post(
            "/auth/login",
            json={
                "email": "session@example.com",
                "name": "Session User",
                "password": "SessionPassword123!"
            }
        )
        session_token = login_response.json()["session_token"]
        
        # Verify session works
        me_response = client.get(
            "/auth/me",
            headers={"X-Session-Token": session_token}
        )
        assert me_response.status_code == status.HTTP_200_OK
        
        # Logout
        logout_response = client.post(
            "/auth/logout",
            headers={"X-Session-Token": session_token}
        )
        assert logout_response.status_code == status.HTTP_200_OK
        
        # Verify session is invalidated
        me_response_after = client.get(
            "/auth/me",
            headers={"X-Session-Token": session_token}
        )
        assert me_response_after.status_code != status.HTTP_200_OK
    
    def test_anonymous_calculation_flow(self, client, sample_carbon_data):
        """Test anonymous user calculation flow"""
        # Anonymous calculation
        calc_response = client.post(
            "/carbon-footprint/calculate-anonymous",
            json=sample_carbon_data
        )
        assert calc_response.status_code == status.HTTP_200_OK
        assert calc_response.json()["predicted_emissions"] > 0
        
        # Anonymous users should not be able to access history
        # (This would require authentication)
    
    def test_error_handling_flow(self, client):
        """Test error handling across the application"""
        # Try to login with non-existent user
        login_response = client.post(
            "/auth/login",
            json={
                "email": "nonexistent@example.com",
                "name": "Nonexistent",
                "password": "SomePassword123!"
            }
        )
        assert login_response.status_code == status.HTTP_401_UNAUTHORIZED
        
        # Try to access protected endpoint without auth
        history_response = client.get("/carbon-footprint/history")
        assert history_response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Try invalid calculation data
        calc_response = client.post(
            "/carbon-footprint/calculate-anonymous",
            json={"invalid": "data"}
        )
        assert calc_response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

