"""
Tests for ML model functionality
"""
import pytest
import os
import sys

# Add ml directory to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "app", "ml"))

@pytest.mark.ml
@pytest.mark.slow
class TestMLModel:
    """Test suite for ML model predictions"""
    
    def test_model_loading(self):
        """Test that ML model can be loaded"""
        try:
            from app.ml.predict_carbon_fixed import CarbonEmissionPredictorFixed
            
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            model_path = os.path.join(current_dir, "app", "ml", "models", "v3_carbon_emission_model_minimal.pkl")
            preprocessor_path = os.path.join(current_dir, "app", "ml", "models", "v3_preprocessor.pkl")
            
            if os.path.exists(model_path) and os.path.exists(preprocessor_path):
                predictor = CarbonEmissionPredictorFixed(
                    model_path=model_path,
                    preprocessor_path=preprocessor_path
                )
                assert predictor is not None
                assert predictor.model is not None
            else:
                pytest.skip("Model files not found")
        except ImportError as e:
            pytest.skip(f"ML dependencies not available: {e}")
    
    def test_prediction_with_sample_data(self):
        """Test prediction with sample input data"""
        try:
            from app.ml.predict_carbon_fixed import CarbonEmissionPredictorFixed
            
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            model_path = os.path.join(current_dir, "app", "ml", "models", "v3_carbon_emission_model_minimal.pkl")
            preprocessor_path = os.path.join(current_dir, "app", "ml", "models", "v3_preprocessor.pkl")
            
            if not (os.path.exists(model_path) and os.path.exists(preprocessor_path)):
                pytest.skip("Model files not found")
            
            predictor = CarbonEmissionPredictorFixed(
                model_path=model_path,
                preprocessor_path=preprocessor_path
            )
            
            sample_data = {
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
            
            result = predictor.predict_from_raw_inputs(sample_data)
            
            assert result is not None
            assert "predicted_carbon_footprint" in result
            assert "model_confidence" in result
            assert result["predicted_carbon_footprint"] > 0
        except ImportError as e:
            pytest.skip(f"ML dependencies not available: {e}")
    
    def test_recommendations_generation(self):
        """Test that recommendations are generated"""
        try:
            from app.ml.predict_carbon_fixed import CarbonEmissionPredictorFixed
            
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            model_path = os.path.join(current_dir, "app", "ml", "models", "v3_carbon_emission_model_minimal.pkl")
            preprocessor_path = os.path.join(current_dir, "app", "ml", "models", "v3_preprocessor.pkl")
            
            if not (os.path.exists(model_path) and os.path.exists(preprocessor_path)):
                pytest.skip("Model files not found")
            
            predictor = CarbonEmissionPredictorFixed(
                model_path=model_path,
                preprocessor_path=preprocessor_path
            )
            
            sample_data = {
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
            
            prediction = predictor.predict_from_raw_inputs(sample_data)
            recommendations = predictor.get_recommendations(sample_data, prediction["predicted_carbon_footprint"])
            
            assert isinstance(recommendations, list)
            # Recommendations may be empty, but should be a list
        except ImportError as e:
            pytest.skip(f"ML dependencies not available: {e}")
    
    def test_prediction_with_various_inputs(self):
        """Test prediction with various input combinations"""
        try:
            from app.ml.predict_carbon_fixed import CarbonEmissionPredictorFixed
            
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            model_path = os.path.join(current_dir, "app", "ml", "models", "v3_carbon_emission_model_minimal.pkl")
            preprocessor_path = os.path.join(current_dir, "app", "ml", "models", "v3_preprocessor.pkl")
            
            if not (os.path.exists(model_path) and os.path.exists(preprocessor_path)):
                pytest.skip("Model files not found")
            
            predictor = CarbonEmissionPredictorFixed(
                model_path=model_path,
                preprocessor_path=preprocessor_path
            )
            
            test_cases = [
                {
                    "household_size": 1,
                    "electricity_usage_kwh": 200,
                    "home_size_sqft": 1000,
                    "heating_energy_source": "Electric",
                    "vehicle_type": "Electric",
                    "climate_zone": "Hot",
                    "meat_consumption": "Low",
                    "shopping_frequency": "Monthly",
                    "social_activity": "Low"
                },
                {
                    "household_size": 6,
                    "electricity_usage_kwh": 1000,
                    "home_size_sqft": 4000,
                    "heating_energy_source": "Oil",
                    "vehicle_type": "Gasoline",
                    "climate_zone": "Cold",
                    "meat_consumption": "High",
                    "shopping_frequency": "Daily",
                    "social_activity": "High"
                }
            ]
            
            for test_data in test_cases:
                result = predictor.predict_from_raw_inputs(test_data)
                assert result is not None
                assert result["predicted_carbon_footprint"] > 0
        except ImportError as e:
            pytest.skip(f"ML dependencies not available: {e}")

