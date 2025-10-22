from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import json

from ..repositories.carbon_footprint_repository import (
    CarbonFootprintRepository, 
    RecommendationRepository, 
    UserGoalRepository
)
from ..schemas.carbon_footprint import (
    CarbonFootprintCreate, 
    CarbonFootprintResponse,
    RecommendationCreate,
    UserGoalCreate,
    CarbonFootprintStats,
    EmissionTrend,
    RecommendationStats,
    UserGoalProgress
)
from ..ml.predict_carbon_fixed import CarbonEmissionPredictorFixed
import os

class CarbonFootprintService:
    def __init__(self, db_session):
        self.db = db_session
        self.footprint_repo = CarbonFootprintRepository(db_session)
        self.recommendation_repo = RecommendationRepository(db_session)
        self.goal_repo = UserGoalRepository(db_session)
        
        # Initialize ML predictor
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(current_dir, "ml", "models", "v3_carbon_emission_model_minimal.pkl")
        preprocessor_path = os.path.join(current_dir, "ml", "models", "v3_preprocessor.pkl")
        
        self.predictor = CarbonEmissionPredictorFixed(
            model_path=model_path,
            preprocessor_path=preprocessor_path
        )
    
    def calculate_carbon_footprint(self, user_id: int, input_data: Dict[str, Any], 
                                 ip_address: str = None, user_agent: str = None) -> CarbonFootprintResponse:
        """Calculate carbon footprint and save to database"""
        try:
            # Get prediction from ML model
            prediction_result = self.predictor.predict_from_raw_inputs(input_data)
            recommendations = self.predictor.get_recommendations(input_data, prediction_result["predicted_carbon_footprint"])
            
            # Parse confidence score
            confidence_str = prediction_result["model_confidence"]
            confidence_score = float(confidence_str.replace('%', '')) / 100 if '%' in confidence_str else float(confidence_str)
            
            # Calculate breakdown (simplified - you might want to enhance this)
            breakdown = self._calculate_breakdown(input_data, prediction_result["predicted_carbon_footprint"])
            
            # Create carbon footprint record
            footprint_data = CarbonFootprintCreate(
                input_data=input_data,
                total_emissions=Decimal(str(prediction_result["predicted_carbon_footprint"])),
                confidence_score=Decimal(str(confidence_score)),
                model_name=self.predictor.model_name,
                model_version="v3",
                electricity_emissions=Decimal(str(breakdown.get("electricity", 0))),
                transportation_emissions=Decimal(str(breakdown.get("transportation", 0))),
                heating_emissions=Decimal(str(breakdown.get("heating", 0))),
                waste_emissions=Decimal(str(breakdown.get("waste", 0))),
                lifestyle_emissions=Decimal(str(breakdown.get("lifestyle", 0))),
                other_emissions=Decimal(str(breakdown.get("other", 0))),
                ip_address=ip_address,
                user_agent=user_agent,
                is_anonymous=user_id is None
            )
            
            # Save to database
            footprint = self.footprint_repo.create_carbon_footprint(user_id, footprint_data)
            
            # Create recommendations
            recommendation_data = []
            for rec in recommendations:
                rec_data = RecommendationCreate(
                    carbon_footprint_id=footprint.id,
                    category=rec.get("category", "General"),
                    title=rec.get("action", "Improvement Suggestion"),
                    description=rec.get("action", ""),
                    action_required=rec.get("action", ""),
                    potential_savings=rec.get("potential_savings", ""),
                    priority=rec.get("priority", "medium").lower(),
                    estimated_impact=Decimal(str(rec.get("estimated_impact", 0))) if rec.get("estimated_impact") else None
                )
                recommendation_data.append(rec_data)
            
            if recommendation_data:
                self.recommendation_repo.create_recommendations_batch(recommendation_data)
            
            return CarbonFootprintResponse.from_orm(footprint)
            
        except Exception as e:
            raise Exception(f"Failed to calculate carbon footprint: {str(e)}")
    
    def _calculate_breakdown(self, input_data: Dict[str, Any], total_emissions: float) -> Dict[str, float]:
        """Calculate emissions breakdown by category"""
        # This is a simplified breakdown calculation
        # In a real implementation, you'd want more sophisticated calculations
        
        electricity_usage = float(input_data.get('electricity_usage_kwh', 0))
        home_size = float(input_data.get('home_size_sqft', 0))
        vehicle_distance = float(input_data.get('vehicle_monthly_distance_km', 0))
        household_size = float(input_data.get('household_size', 1))
        
        # Rough estimates based on typical carbon footprint breakdowns
        electricity_emissions = electricity_usage * 0.4  # kg CO2 per kWh
        transportation_emissions = vehicle_distance * 0.2  # kg CO2 per km
        heating_emissions = home_size * 0.1  # kg CO2 per sq ft
        waste_emissions = household_size * 200  # kg CO2 per person
        lifestyle_emissions = household_size * 100  # kg CO2 per person
        
        # Normalize to match total
        calculated_total = electricity_emissions + transportation_emissions + heating_emissions + waste_emissions + lifestyle_emissions
        if calculated_total > 0:
            factor = total_emissions / calculated_total
            electricity_emissions *= factor
            transportation_emissions *= factor
            heating_emissions *= factor
            waste_emissions *= factor
            lifestyle_emissions *= factor
        
        other_emissions = max(0, total_emissions - (electricity_emissions + transportation_emissions + heating_emissions + waste_emissions + lifestyle_emissions))
        
        return {
            "electricity": electricity_emissions,
            "transportation": transportation_emissions,
            "heating": heating_emissions,
            "waste": waste_emissions,
            "lifestyle": lifestyle_emissions,
            "other": other_emissions
        }
    
    def get_user_footprints(self, user_id: int, skip: int = 0, limit: int = 50) -> List[CarbonFootprintResponse]:
        """Get user's carbon footprint history"""
        footprints = self.footprint_repo.get_user_footprints(user_id, skip, limit)
        return [CarbonFootprintResponse.from_orm(footprint) for footprint in footprints]
    
    def get_footprint_by_id(self, footprint_id: int, user_id: int = None) -> Optional[CarbonFootprintResponse]:
        """Get carbon footprint by ID"""
        footprint = self.footprint_repo.get_footprint_by_id(footprint_id)
        if not footprint:
            return None
        
        if user_id and footprint.user_id != user_id:
            return None
        
        return CarbonFootprintResponse.from_orm(footprint)
    
    def get_footprint_stats(self, user_id: int) -> CarbonFootprintStats:
        """Get user's carbon footprint statistics"""
        stats = self.footprint_repo.get_user_footprint_stats(user_id)
        return CarbonFootprintStats(**stats)
    
    def get_emission_trends(self, user_id: int, days: int = 30) -> List[EmissionTrend]:
        """Get user's emission trends over time"""
        trends = self.footprint_repo.get_footprint_trends(user_id, days)
        return [EmissionTrend(**trend) for trend in trends]
    
    def get_recommendations(self, user_id: int, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        """Get user's recommendations"""
        recommendations = self.recommendation_repo.get_user_recommendations(user_id, skip, limit)
        return [
            {
                "id": rec.id,
                "category": rec.category,
                "title": rec.title,
                "description": rec.description,
                "action_required": rec.action_required,
                "potential_savings": rec.potential_savings,
                "priority": rec.priority,
                "estimated_impact": float(rec.estimated_impact) if rec.estimated_impact else None,
                "is_implemented": rec.is_implemented,
                "implemented_at": rec.implemented_at.isoformat() if rec.implemented_at else None,
                "created_at": rec.created_at.isoformat()
            }
            for rec in recommendations
        ]
    
    def mark_recommendation_implemented(self, recommendation_id: int, user_id: int) -> bool:
        """Mark recommendation as implemented"""
        # Verify recommendation belongs to user
        recommendation = self.recommendation_repo.db.query(self.recommendation_repo.db.query(Recommendation).join(CarbonFootprint).filter(
            Recommendation.id == recommendation_id,
            CarbonFootprint.user_id == user_id
        ).first())
        
        if not recommendation:
            return False
        
        return self.recommendation_repo.mark_recommendation_implemented(recommendation_id)
    
    def get_recommendation_stats(self, user_id: int) -> RecommendationStats:
        """Get recommendation implementation statistics"""
        stats = self.recommendation_repo.get_implementation_stats(user_id)
        return RecommendationStats(**stats)
    
    def create_goal(self, user_id: int, goal_data: UserGoalCreate) -> Dict[str, Any]:
        """Create user goal"""
        goal = self.goal_repo.create_goal(user_id, goal_data)
        return {
            "id": goal.id,
            "goal_type": goal.goal_type,
            "target_emissions": float(goal.target_emissions) if goal.target_emissions else None,
            "reduction_percentage": float(goal.reduction_percentage) if goal.reduction_percentage else None,
            "target_date": goal.target_date.isoformat(),
            "description": goal.description,
            "is_achieved": goal.is_achieved,
            "created_at": goal.created_at.isoformat()
        }
    
    def get_user_goals(self, user_id: int, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        """Get user's goals"""
        goals = self.goal_repo.get_user_goals(user_id, skip, limit)
        return [
            {
                "id": goal.id,
                "goal_type": goal.goal_type,
                "target_emissions": float(goal.target_emissions) if goal.target_emissions else None,
                "reduction_percentage": float(goal.reduction_percentage) if goal.reduction_percentage else None,
                "target_date": goal.target_date.isoformat(),
                "description": goal.description,
                "is_achieved": goal.is_achieved,
                "achieved_at": goal.achieved_at.isoformat() if goal.achieved_at else None,
                "created_at": goal.created_at.isoformat()
            }
            for goal in goals
        ]
    
    def get_goal_progress(self, user_id: int, goal_id: int) -> Optional[UserGoalProgress]:
        """Get goal progress"""
        progress = self.goal_repo.get_goal_progress(user_id, goal_id)
        if not progress:
            return None
        
        return UserGoalProgress(**progress)
    
    def mark_goal_achieved(self, goal_id: int, user_id: int) -> bool:
        """Mark goal as achieved"""
        # Verify goal belongs to user
        goal = self.goal_repo.get_goal_by_id(goal_id)
        if not goal or goal.user_id != user_id:
            return False
        
        return self.goal_repo.mark_goal_achieved(goal_id)
    
    def delete_goal(self, goal_id: int, user_id: int) -> bool:
        """Delete user goal"""
        # Verify goal belongs to user
        goal = self.goal_repo.get_goal_by_id(goal_id)
        if not goal or goal.user_id != user_id:
            return False
        
        return self.goal_repo.delete_goal(goal_id)
    
    def get_dashboard_data(self, user_id: int) -> Dict[str, Any]:
        """Get comprehensive dashboard data for user"""
        stats = self.get_footprint_stats(user_id)
        trends = self.get_emission_trends(user_id, 30)
        recommendations = self.get_recommendations(user_id, 0, 10)
        rec_stats = self.get_recommendation_stats(user_id)
        goals = self.get_user_goals(user_id, 0, 5)
        
        # Get latest footprint
        latest_footprints = self.get_user_footprints(user_id, 0, 1)
        latest_footprint = latest_footprints[0] if latest_footprints else None
        
        return {
            "stats": stats.dict(),
            "trends": [trend.dict() for trend in trends],
            "recommendations": recommendations,
            "recommendation_stats": rec_stats.dict(),
            "goals": goals,
            "latest_footprint": latest_footprint.dict() if latest_footprint else None
        }
