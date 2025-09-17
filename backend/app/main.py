from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

# Add the ml directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ml'))

from app.ml.predict_carbon_fixed import CarbonEmissionPredictorFixed
from app.config import settings
from app.database.connection import create_tables

# Create FastAPI app
app = FastAPI(
    title="Carbon Emission Prediction API", 
    version="1.0.0",
    description="API for predicting carbon footprint with user management and historical tracking"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the predictor with correct paths
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(current_dir, "app", "ml", "models", "v3_carbon_emission_model_minimal.pkl")
preprocessor_path = os.path.join(current_dir, "app", "ml", "models", "v3_preprocessor.pkl")

predictor = CarbonEmissionPredictorFixed(
    model_path=model_path,
    preprocessor_path=preprocessor_path
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    try:
        create_tables()
        print("✅ Database tables created/verified")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")

# Include API routers
from app.api.auth import router as auth_router
from app.api.carbon_footprint_api import router as carbon_router

app.include_router(auth_router)
app.include_router(carbon_router)

class CarbonPredictionRequest(BaseModel):
    # Core features
    household_size: int
    electricity_usage_kwh: float
    home_size_sqft: float
    
    # Categorical features (will be encoded)
    heating_energy_source: str  # Natural Gas, Electric, Oil, etc.
    vehicle_type: str  # Gasoline, Hybrid, Electric, etc.
    climate_zone: str  # Hot, Moderate, Cold, etc.
    
    # Lifestyle features
    meat_consumption: str  # High, Medium, Low, None
    shopping_frequency: str  # Daily, Weekly, Monthly, Rarely
    social_activity: str  # High, Medium, Low, None
    
    # Transportation features
    vehicle_monthly_distance_km: float = 800.0
    
    # Optional features (can be calculated if not provided)
    heating_efficiency: float = 0.5
    cooling_efficiency: float = 0.5
    heating_days: int = 120
    cooling_days: int = 90
    waste_bag_weekly_count: int = 2
    new_clothes_monthly: int = 2
    vehicles_per_household: int = 1
    monthly_grocery_bill: float = 300.0

class CarbonPredictionResponse(BaseModel):
    predicted_emissions: float
    confidence_score: float
    feature_importance: Dict[str, float]
    recommendations: list

@app.get("/")
async def root():
    return {"message": "Carbon Emission Prediction API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.post("/predict", response_model=CarbonPredictionResponse)
async def predict_carbon_emissions(request: CarbonPredictionRequest):
    """
    Predict carbon emissions based on household characteristics
    """
    try:
        # Convert request to dictionary
        input_data = request.dict()
        
        # Make prediction using the correct method
        prediction_result = predictor.predict_from_raw_inputs(input_data)
        
        # Get recommendations
        recommendations = predictor.get_recommendations(input_data, prediction_result["predicted_carbon_footprint"])
        
        # Extract numeric confidence score from percentage string
        confidence_str = prediction_result["model_confidence"]
        confidence_score = float(confidence_str.replace('%', '')) / 100 if '%' in confidence_str else float(confidence_str)
        
        return CarbonPredictionResponse(
            predicted_emissions=prediction_result["predicted_carbon_footprint"],
            confidence_score=confidence_score,
            feature_importance={},  # Will be populated if available
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """
    Get information about the loaded model
    """
    try:
        return {
            "model_loaded": True,
            "model_type": "XGBoost",
            "features": predictor.feature_names if hasattr(predictor, 'feature_names') else "Unknown",
            "status": "Ready for predictions"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get model info: {str(e)}")

@app.get("/test-request")
async def test_request_format():
    """
    Get an example request format for testing
    """
    return {
        "example_request": {
            "household_size": 4,
            "electricity_usage_kwh": 500,
            "home_size_sqft": 2000,
            "heating_energy_source": "Natural Gas",
            "vehicle_type": "Gasoline",
            "climate_zone": "Moderate",
            "meat_consumption": "Medium",
            "shopping_frequency": "Weekly",
            "social_activity": "Medium",
            "vehicle_monthly_distance_km": 800.0,
            "heating_efficiency": 0.7,
            "cooling_efficiency": 0.6,
            "heating_days": 120,
            "cooling_days": 90,
            "waste_bag_weekly_count": 2,
            "new_clothes_monthly": 2,
            "vehicles_per_household": 1,
            "monthly_grocery_bill": 400.0
        },
        "required_fields": [
            "household_size", "electricity_usage_kwh", "home_size_sqft",
            "heating_energy_source", "vehicle_type", "climate_zone",
            "meat_consumption", "shopping_frequency", "social_activity"
        ],
        "optional_fields": [
            "heating_efficiency", "cooling_efficiency", "heating_days",
            "cooling_days", "waste_bag_weekly_count", "new_clothes_monthly",
            "vehicles_per_household", "monthly_grocery_bill"
        ]
    }

@app.get("/model-details")
async def get_model_details():
    """
    Get detailed information about the loaded model
    """
    try:
        return {
            "model_type": type(predictor.model).__name__,
            "model_name": predictor.model_name,
            "model_score": predictor.score,
            "features_count": len(predictor.selected_features) if hasattr(predictor, 'selected_features') else "Unknown",
            "status": "Ready for predictions"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get model details: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
