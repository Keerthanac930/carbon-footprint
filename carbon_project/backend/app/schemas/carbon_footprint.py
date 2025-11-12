from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from enum import Enum

class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class GoalTypeEnum(str, Enum):
    EMISSION_REDUCTION = "emission_reduction"
    CARBON_NEUTRAL = "carbon_neutral"
    SPECIFIC_TARGET = "specific_target"

# Carbon Footprint schemas
class CarbonFootprintBase(BaseModel):
    input_data: Dict[str, Any]
    total_emissions: Decimal
    confidence_score: Decimal
    model_name: str
    model_version: Optional[str] = None
    electricity_emissions: Optional[Decimal] = 0
    transportation_emissions: Optional[Decimal] = 0
    heating_emissions: Optional[Decimal] = 0
    waste_emissions: Optional[Decimal] = 0
    lifestyle_emissions: Optional[Decimal] = 0
    other_emissions: Optional[Decimal] = 0
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    is_anonymous: bool = False

class CarbonFootprintCreate(CarbonFootprintBase):
    pass

class CarbonFootprintResponse(CarbonFootprintBase):
    id: int
    user_id: Optional[int] = None
    calculation_uuid: str
    calculation_date: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CarbonFootprintWithRecommendations(CarbonFootprintResponse):
    recommendations: List['RecommendationResponse'] = []

# Recommendation schemas
class RecommendationBase(BaseModel):
    category: str
    title: str
    description: str
    action_required: str
    potential_savings: str
    priority: PriorityEnum
    estimated_impact: Optional[Decimal] = None

class RecommendationCreate(RecommendationBase):
    carbon_footprint_id: int

class RecommendationUpdate(BaseModel):
    is_implemented: Optional[bool] = None

class RecommendationResponse(RecommendationBase):
    id: int
    carbon_footprint_id: int
    is_implemented: bool
    implemented_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

# User Goal schemas
class UserGoalBase(BaseModel):
    goal_type: GoalTypeEnum
    target_emissions: Optional[Decimal] = None
    reduction_percentage: Optional[Decimal] = None
    target_date: datetime
    description: Optional[str] = None
    
    @validator('target_date')
    def validate_target_date(cls, v):
        if v <= datetime.now().date():
            raise ValueError('Target date must be in the future')
        return v
    
    @validator('target_emissions', 'reduction_percentage')
    def validate_goal_targets(cls, v, values):
        if v is None and values.get('target_emissions') is None and values.get('reduction_percentage') is None:
            raise ValueError('Either target_emissions or reduction_percentage must be specified')
        return v

class UserGoalCreate(UserGoalBase):
    pass

class UserGoalUpdate(BaseModel):
    goal_type: Optional[GoalTypeEnum] = None
    target_emissions: Optional[Decimal] = None
    reduction_percentage: Optional[Decimal] = None
    target_date: Optional[datetime] = None
    description: Optional[str] = None

class UserGoalResponse(UserGoalBase):
    id: int
    user_id: int
    is_achieved: bool
    achieved_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserGoalProgress(BaseModel):
    goal_id: int
    current_emissions: float
    target_emissions: Optional[Decimal]
    reduction_percentage: Optional[Decimal]
    progress_percentage: float
    remaining_emissions: float
    is_achieved: bool
    days_remaining: int

# Statistics and analytics schemas
class CarbonFootprintStats(BaseModel):
    total_calculations: int
    average_emissions: float
    min_emissions: float
    max_emissions: float
    emissions_stddev: float
    last_calculation_date: Optional[datetime]
    calculations_last_30_days: int
    calculations_last_7_days: int

class EmissionTrend(BaseModel):
    date: str
    total_emissions: float
    electricity_emissions: float
    transportation_emissions: float
    heating_emissions: float
    waste_emissions: float
    lifestyle_emissions: float

class RecommendationStats(BaseModel):
    total_recommendations: int
    implemented_recommendations: int
    implementation_rate: float

class CategoryBreakdown(BaseModel):
    electricity: float
    transportation: float
    heating: float
    waste: float
    lifestyle: float
    other: float

class CarbonFootprintSummary(BaseModel):
    footprint: CarbonFootprintResponse
    breakdown: CategoryBreakdown
    recommendations: List[RecommendationResponse]
    stats: CarbonFootprintStats

# API request/response schemas
class CarbonFootprintCalculationRequest(BaseModel):
    # Core features
    household_size: int
    electricity_usage_kwh: float
    home_size_sqft: float
    
    # Categorical features
    home_type: str
    heating_energy_source: str
    cooling_energy_source: str
    vehicle_type: str
    fuel_type: str
    climate_zone: str
    
    # Lifestyle features
    meat_consumption: str
    cooking_method: str
    recycling_practice: str
    income_level: str
    location_type: str
    
    # Transportation features
    vehicle_monthly_distance_km: float = 500.0
    vehicles_per_household: int = 1
    
    # Waste & Consumption
    monthly_grocery_bill: float = 15000.0
    waste_per_person: float = 2.0
    air_travel_hours: float = 10.0
    
    # Optional features
    heating_efficiency: float = 0.8
    cooling_efficiency: float = 0.7
    heating_days: int = 30
    cooling_days: int = 120
    waste_bag_weekly_count: int = 2
    new_clothes_monthly: int = 1
    recycling_rate: float = 0.6
    composting_rate: float = 0.2
    fuel_efficiency: float = 15.0
    fuel_usage_liters: float = 30.0
    home_age: int = 10
    
    @validator('household_size')
    def validate_household_size(cls, v):
        if v < 1 or v > 15:
            raise ValueError('Household size must be between 1 and 15')
        return v
    
    @validator('electricity_usage_kwh')
    def validate_electricity_usage(cls, v):
        if v < 0 or v > 2000:
            raise ValueError('Electricity usage must be between 0 and 2,000 kWh')
        return v
    
    @validator('home_size_sqft')
    def validate_home_size(cls, v):
        if v < 200 or v > 5000:
            raise ValueError('Home size must be between 200 and 5,000 sq ft')
        return v

class CarbonFootprintCalculationResponse(BaseModel):
    predicted_emissions: float
    confidence_score: float
    feature_importance: Dict[str, float]
    recommendations: List[Dict[str, str]]
    calculation_uuid: str
    model_name: str
    model_version: str
    breakdown: Optional[Dict[str, float]] = None

# Pagination schemas
class PaginationParams(BaseModel):
    skip: int = 0
    limit: int = 50
    
    @validator('skip')
    def validate_skip(cls, v):
        if v < 0:
            raise ValueError('Skip must be non-negative')
        return v
    
    @validator('limit')
    def validate_limit(cls, v):
        if v < 1 or v > 1000:
            raise ValueError('Limit must be between 1 and 1000')
        return v

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool

# Search schemas
class CarbonFootprintSearchRequest(BaseModel):
    user_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_emissions: Optional[float] = None
    max_emissions: Optional[float] = None
    model_name: Optional[str] = None
    skip: int = 0
    limit: int = 50

# Update forward references
CarbonFootprintWithRecommendations.model_rebuild()
