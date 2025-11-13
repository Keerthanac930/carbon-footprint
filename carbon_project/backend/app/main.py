from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

# Import ML predictor
try:
    from app.ml.predict_carbon_fixed import CarbonEmissionPredictorFixed
except ImportError:
    # Fallback if import fails
    ml_path = os.path.join(os.path.dirname(__file__), 'ml')
    if ml_path not in sys.path:
        sys.path.insert(0, ml_path)
    from predict_carbon_fixed import CarbonEmissionPredictorFixed
from app.config import settings
from app.database.connection import create_tables, test_database_connection

# Create FastAPI app
app = FastAPI(
    title="Carbon Emission Prediction API", 
    version="1.0.0",
    description="API for predicting carbon footprint with user management and historical tracking"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for mobile app compatibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global predictor variable (will be initialized on startup)
predictor = None

# Create database tables and load ML model on startup
@app.on_event("startup")
async def startup_event():
    global predictor
    
    print("🚀 Starting Carbon Footprint API...")
    print("=" * 60)
    
    # Initialize database tables
    try:
        create_tables()
        print("✅ Database tables created/verified")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
        print("⚠️  Server will continue, but database features may not work")

    # Verify database connectivity (non-blocking)
    try:
        if test_database_connection():
            print("✅ Database connectivity verified")
        else:
            print("⚠️  Database connection failed, but server will continue")
            print("⚠️  You can still test the API, but database features won't work")
    except Exception as e:
        print(f"⚠️  Database connection check failed: {e}")
        print("⚠️  Server will continue - check database settings if you need database features")
    
    # Load ML model (this is the heavy part)
    try:
        print("📦 Loading ML model...")
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(current_dir, "app", "ml", "models", "v3_carbon_emission_model_minimal.pkl")
        preprocessor_path = os.path.join(current_dir, "app", "ml", "models", "v3_preprocessor.pkl")
        
        predictor = CarbonEmissionPredictorFixed(
            model_path=model_path,
            preprocessor_path=preprocessor_path
        )
        print("✅ ML model loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load ML model: {e}")
        print("⚠️  Prediction endpoints will not work until model is loaded")
    
    port = os.environ.get("PORT", 8000)
    print("=" * 60)
    print(f"✅ Backend ready on port {port}")
    print(f"📋 API Documentation: http://0.0.0.0:{port}/docs")
    print(f"🔗 Test endpoint: http://0.0.0.0:{port}/ping")
    print("=" * 60)

# Include API routers
from app.api.auth import router as auth_router
from app.api.carbon_footprint_api import router as carbon_router
from app.api.marketplace_api import router as marketplace_router
from app.api.chatbot_api import router as chatbot_router

app.include_router(auth_router)
app.include_router(carbon_router)
app.include_router(marketplace_router)
app.include_router(chatbot_router)

# Serve static files (including mobile build artifacts)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

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

@app.get("/ping")
async def ping():
    """Simple ping endpoint for connectivity testing"""
    return {"status": "ok", "message": "pong"}

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
    import os
    # Railway provides PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
