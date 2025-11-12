from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database.connection import get_db
from ..services.carbon_footprint_service import CarbonFootprintService
from ..services.auth_service import AuthService
from ..schemas.carbon_footprint import (
    CarbonFootprintCalculationRequest,
    CarbonFootprintCalculationResponse,
    CarbonFootprintResponse,
    CarbonFootprintStats,
    EmissionTrend,
    RecommendationStats,
    UserGoalCreate,
    UserGoalProgress,
    PaginationParams
)
from ..schemas.user import UserResponse

router = APIRouter(prefix="/carbon-footprint", tags=["carbon-footprint"])

def get_carbon_service(db: Session = Depends(get_db)) -> CarbonFootprintService:
    return CarbonFootprintService(db)

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

def get_current_user(
    session_token: str = Header(..., alias="X-Session-Token"),
    auth_service: AuthService = Depends(get_auth_service)
) -> UserResponse:
    """Get current authenticated user"""
    user = auth_service.get_current_user(session_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token"
        )
    return user

@router.post("/calculate", response_model=CarbonFootprintCalculationResponse)
async def calculate_carbon_footprint(
    calculation_data: CarbonFootprintCalculationRequest,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Calculate carbon footprint for authenticated user"""
    try:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        
        # Convert to dict for processing
        input_data = calculation_data.dict()
        
        # Calculate footprint
        footprint = carbon_service.calculate_carbon_footprint(
            user_id=current_user.id,
            input_data=input_data,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Get recommendations for this footprint
        recommendations = carbon_service.get_recommendations(current_user.id, 0, 10)
        footprint_recommendations = [rec for rec in recommendations if rec.get('carbon_footprint_id') == footprint.id]
        
        # Calculate breakdown for response
        breakdown = {
            "electricity": float(footprint.electricity_emissions or 0),
            "transportation": float(footprint.transportation_emissions or 0),
            "heating": float(footprint.heating_emissions or 0),
            "waste": float(footprint.waste_emissions or 0),
            "lifestyle": float(footprint.lifestyle_emissions or 0),
            "other": float(footprint.other_emissions or 0)
        }
        
        return CarbonFootprintCalculationResponse(
            predicted_emissions=float(footprint.total_emissions),
            confidence_score=float(footprint.confidence_score),
            feature_importance={},  # TODO: Implement feature importance
            recommendations=[
                {
                    "category": rec["category"],
                    "action": rec["action_required"],
                    "potential_savings": rec["potential_savings"],
                    "priority": rec["priority"]
                }
                for rec in footprint_recommendations
            ],
            calculation_uuid=footprint.calculation_uuid,
            model_name=footprint.model_name,
            model_version=footprint.model_version or "v3",
            breakdown=breakdown  # Include breakdown data
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Calculation failed: {str(e)}"
        )

@router.post("/calculate-anonymous", response_model=CarbonFootprintCalculationResponse)
async def calculate_carbon_footprint_anonymous(
    calculation_data: CarbonFootprintCalculationRequest,
    request: Request,
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Calculate carbon footprint for anonymous user"""
    try:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        
        # Convert to dict for processing
        input_data = calculation_data.dict()
        
        # Calculate footprint (anonymous)
        footprint = carbon_service.calculate_carbon_footprint(
            user_id=None,  # Anonymous
            input_data=input_data,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Calculate breakdown for response
        breakdown = {
            "electricity": float(footprint.electricity_emissions or 0),
            "transportation": float(footprint.transportation_emissions or 0),
            "heating": float(footprint.heating_emissions or 0),
            "waste": float(footprint.waste_emissions or 0),
            "lifestyle": float(footprint.lifestyle_emissions or 0),
            "other": float(footprint.other_emissions or 0)
        }
        
        return CarbonFootprintCalculationResponse(
            predicted_emissions=float(footprint.total_emissions),
            confidence_score=float(footprint.confidence_score),
            feature_importance={},
            recommendations=[],  # No recommendations for anonymous users
            calculation_uuid=footprint.calculation_uuid,
            model_name=footprint.model_name,
            model_version=footprint.model_version or "v3",
            breakdown=breakdown  # Include breakdown data
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Calculation failed: {str(e)}"
        )

@router.get("/history", response_model=List[CarbonFootprintResponse])
async def get_carbon_footprint_history(
    pagination: PaginationParams = Depends(),
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get user's carbon footprint history"""
    try:
        footprints = carbon_service.get_user_footprints(
            user_id=current_user.id,
            skip=pagination.skip,
            limit=pagination.limit
        )
        return footprints
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get history: {str(e)}"
        )

@router.get("/stats", response_model=CarbonFootprintStats)
async def get_carbon_footprint_stats(
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get user's carbon footprint statistics"""
    try:
        stats = carbon_service.get_footprint_stats(current_user.id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get stats: {str(e)}"
        )

@router.get("/trends", response_model=List[EmissionTrend])
async def get_emission_trends(
    days: int = 30,
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get user's emission trends over time"""
    try:
        if days < 1 or days > 365:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Days must be between 1 and 365"
            )
        
        trends = carbon_service.get_emission_trends(current_user.id, days)
        return trends
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trends: {str(e)}"
        )

@router.get("/recommendations")
async def get_recommendations(
    pagination: PaginationParams = Depends(),
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get user's recommendations"""
    try:
        recommendations = carbon_service.get_recommendations(
            user_id=current_user.id,
            skip=pagination.skip,
            limit=pagination.limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendations: {str(e)}"
        )

@router.post("/recommendations/{recommendation_id}/implement")
async def mark_recommendation_implemented(
    recommendation_id: int,
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Mark recommendation as implemented"""
    try:
        success = carbon_service.mark_recommendation_implemented(recommendation_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recommendation not found"
            )
        return {"message": "Recommendation marked as implemented"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark recommendation: {str(e)}"
        )

@router.get("/recommendations/stats", response_model=RecommendationStats)
async def get_recommendation_stats(
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get recommendation implementation statistics"""
    try:
        stats = carbon_service.get_recommendation_stats(current_user.id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendation stats: {str(e)}"
        )

@router.post("/goals")
async def create_goal(
    goal_data: UserGoalCreate,
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Create a new user goal"""
    try:
        goal = carbon_service.create_goal(current_user.id, goal_data)
        return goal
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create goal: {str(e)}"
        )

@router.get("/goals")
async def get_user_goals(
    pagination: PaginationParams = Depends(),
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get user's goals"""
    try:
        goals = carbon_service.get_user_goals(
            user_id=current_user.id,
            skip=pagination.skip,
            limit=pagination.limit
        )
        return goals
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get goals: {str(e)}"
        )

@router.get("/goals/{goal_id}/progress", response_model=UserGoalProgress)
async def get_goal_progress(
    goal_id: int,
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get goal progress"""
    try:
        progress = carbon_service.get_goal_progress(current_user.id, goal_id)
        if not progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        return progress
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get goal progress: {str(e)}"
        )

@router.post("/goals/{goal_id}/achieve")
async def mark_goal_achieved(
    goal_id: int,
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Mark goal as achieved"""
    try:
        success = carbon_service.mark_goal_achieved(goal_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        return {"message": "Goal marked as achieved"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark goal: {str(e)}"
        )

@router.delete("/goals/{goal_id}")
async def delete_goal(
    goal_id: int,
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Delete user goal"""
    try:
        success = carbon_service.delete_goal(goal_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        return {"message": "Goal deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete goal: {str(e)}"
        )

@router.get("/dashboard")
async def get_dashboard_data(
    current_user: UserResponse = Depends(get_current_user),
    carbon_service: CarbonFootprintService = Depends(get_carbon_service)
):
    """Get comprehensive dashboard data"""
    try:
        dashboard_data = carbon_service.get_dashboard_data(current_user.id)
        return dashboard_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard data: {str(e)}"
        )
