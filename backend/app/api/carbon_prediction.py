from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

# Add the ml directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml'))

from predict_carbon_fixed import CarbonEmissionPredictorFixed

app = FastAPI(title="Carbon Emission Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the predictor with correct paths
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "..", "ml", "models", "v3_carbon_emission_model_minimal.pkl")
preprocessor_path = os.path.join(current_dir, "..", "ml", "models", "v3_preprocessor.pkl")

predictor = CarbonEmissionPredictorFixed(
    model_path=model_path,
    preprocessor_path=preprocessor_path
)

class CarbonPredictionRequest(BaseModel):
    household_size: int
    electricity_usage_kwh: float
    vehicle_monthly_distance_km: float
    heating_energy_source: str
    heating_efficiency: float
    cooling_efficiency: float
    vehicle_type: str
    air_travel_hours: float
    recycling_rate: float
    monthly_grocery_bill: float
    fuel_usage_liters: float
    fuel_efficiency: float
    vehicles_per_household: int
    climate_zone: str
    heating_days: int
    cooling_days: int
    home_size_sqft: int
    home_age: int
    renewable_energy_percentage: float
    cooking_method: str
    public_transport_availability: str
    waste_per_person: float
    waste_bag_weekly_count: int
    composting_rate: float
    tv_pc_daily_hours: float
    internet_daily_hours: float
    new_clothes_monthly: int
    social_activity: str
    income_level: str
    home_type: str
    body_type: str
    sex: str
    home_efficiency: float
    climate_impact_factor: float
    meat_consumption: float = 0
    shopping_frequency: float = 0
    lifestyle_impact_score: float = 0.5
    waste_bag_size: float = 0

class CarbonPredictionResponse(BaseModel):
    predicted_carbon_footprint: float
    prediction_units: str
    model_confidence: str
    model_name: str
    recommendations: list

@app.post("/predict", response_model=CarbonPredictionResponse)
async def predict_carbon_emission(request: CarbonPredictionRequest):
    """Predict carbon emission based on user inputs"""
    try:
        # Convert request to dict
        input_data = request.dict()
        
        # Make prediction
        prediction_result = predictor.predict_from_raw_inputs(input_data)
        
        # Get recommendations
        recommendations = predictor.get_recommendations(input_data, prediction_result['predicted_carbon_footprint'])
        
        return CarbonPredictionResponse(
            predicted_carbon_footprint=prediction_result['predicted_carbon_footprint'],
            prediction_units=prediction_result['prediction_units'],
            model_confidence=prediction_result['model_confidence'],
            model_name=prediction_result['model_name'],
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
