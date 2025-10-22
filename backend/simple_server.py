from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn
import random

# Create FastAPI app
app = FastAPI(title="Carbon Emission Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CarbonFootprintRequest(BaseModel):
    household_size: int
    home_size_sqft: float
    home_type: str
    home_age: int
    electricity_usage_kwh: float
    heating_energy_source: str
    cooling_energy_source: str
    walking_cycling_distance_km: float
    public_transport_usage: str
    climate_zone: str
    meat_consumption: str
    air_travel_hours: float
    cooking_method: str
    monthly_grocery_bill: float
    waste_per_person: float
    recycling_practice: str
    income_level: str
    location_type: str
    vehicles: list = []

@app.get("/")
async def root():
    return {"message": "Carbon Footprint API is running!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/predict")
async def predict_carbon_footprint(request: CarbonFootprintRequest):
    try:
        # Simple carbon footprint calculation based on inputs
        base_emissions = 0
        
        # Electricity emissions (kg CO2 per kWh)
        electricity_emissions = request.electricity_usage_kwh * 0.4
        base_emissions += electricity_emissions
        
        # Transportation emissions
        vehicle_emissions = 0
        for vehicle in request.vehicles:
            if vehicle.get('monthly_distance_km', 0) > 0:
                vehicle_emissions += vehicle['monthly_distance_km'] * 0.2
        base_emissions += vehicle_emissions
        
        # Home size factor
        home_factor = request.home_size_sqft * 0.1
        base_emissions += home_factor
        
        # Household size factor
        household_factor = request.household_size * 200
        base_emissions += household_factor
        
        # Air travel factor
        air_travel_factor = request.air_travel_hours * 0.3
        base_emissions += air_travel_factor
        
        # Add some randomness for realistic variation
        variation = random.uniform(0.8, 1.2)
        predicted_emissions = base_emissions * variation
        
        # Generate some basic recommendations
        recommendations = []
        if electricity_emissions > 1000:
            recommendations.append({
                "category": "Energy",
                "action": "Switch to LED bulbs and energy-efficient appliances",
                "potential_savings": "20-30% reduction in electricity costs",
                "priority": "high"
            })
        
        if vehicle_emissions > 500:
            recommendations.append({
                "category": "Transportation", 
                "action": "Consider carpooling or using public transport",
                "potential_savings": "15-25% reduction in transport emissions",
                "priority": "medium"
            })
        
        if request.recycling_practice == "no":
            recommendations.append({
                "category": "Waste",
                "action": "Start recycling paper, plastic, and metal",
                "potential_savings": "5-10% reduction in waste emissions",
                "priority": "low"
            })
        
        return {
            "predicted_emissions": round(predicted_emissions, 2),
            "confidence_score": round(random.uniform(0.75, 0.95), 2),
            "recommendations": recommendations,
            "breakdown": {
                "electricity": round(electricity_emissions, 2),
                "transportation": round(vehicle_emissions, 2),
                "heating": round(home_factor, 2),
                "waste": round(household_factor * 0.3, 2),
                "lifestyle": round(air_travel_factor + household_factor * 0.2, 2)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating carbon footprint: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
