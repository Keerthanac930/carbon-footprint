from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid

from ..models.carbon_footprint import CarbonFootprint, Recommendation, UserGoal, AuditLog
from ..schemas.carbon_footprint import CarbonFootprintCreate, RecommendationCreate, UserGoalCreate, UserGoalUpdate

class CarbonFootprintRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_carbon_footprint(self, user_id: int, footprint_data: CarbonFootprintCreate) -> CarbonFootprint:
        """Create a new carbon footprint calculation"""
        db_footprint = CarbonFootprint(
            user_id=user_id,
            calculation_uuid=str(uuid.uuid4()),
            input_data=footprint_data.input_data,
            total_emissions=footprint_data.total_emissions,
            confidence_score=footprint_data.confidence_score,
            model_name=footprint_data.model_name,
            model_version=footprint_data.model_version,
            electricity_emissions=footprint_data.electricity_emissions or 0,
            transportation_emissions=footprint_data.transportation_emissions or 0,
            heating_emissions=footprint_data.heating_emissions or 0,
            waste_emissions=footprint_data.waste_emissions or 0,
            lifestyle_emissions=footprint_data.lifestyle_emissions or 0,
            other_emissions=footprint_data.other_emissions or 0,
            ip_address=footprint_data.ip_address,
            user_agent=footprint_data.user_agent,
            is_anonymous=footprint_data.is_anonymous
        )
        
        self.db.add(db_footprint)
        self.db.commit()
        self.db.refresh(db_footprint)
        return db_footprint
    
    def get_footprint_by_id(self, footprint_id: int) -> Optional[CarbonFootprint]:
        """Get carbon footprint by ID"""
        return self.db.query(CarbonFootprint).filter(CarbonFootprint.id == footprint_id).first()
    
    def get_footprint_by_uuid(self, calculation_uuid: str) -> Optional[CarbonFootprint]:
        """Get carbon footprint by calculation UUID"""
        return self.db.query(CarbonFootprint).filter(CarbonFootprint.calculation_uuid == calculation_uuid).first()
    
    def get_user_footprints(self, user_id: int, skip: int = 0, limit: int = 50) -> List[CarbonFootprint]:
        """Get user's carbon footprint history"""
        return self.db.query(CarbonFootprint).filter(
            CarbonFootprint.user_id == user_id
        ).order_by(desc(CarbonFootprint.calculation_date)).offset(skip).limit(limit).all()
    
    def get_recent_footprints(self, days: int = 7, skip: int = 0, limit: int = 100) -> List[CarbonFootprint]:
        """Get recent carbon footprints across all users"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        return self.db.query(CarbonFootprint).filter(
            CarbonFootprint.calculation_date >= cutoff_date
        ).order_by(desc(CarbonFootprint.calculation_date)).offset(skip).limit(limit).all()
    
    def get_user_footprint_stats(self, user_id: int) -> Dict[str, Any]:
        """Get user's carbon footprint statistics"""
        stats = self.db.query(
            func.count(CarbonFootprint.id).label('total_calculations'),
            func.avg(CarbonFootprint.total_emissions).label('average_emissions'),
            func.min(CarbonFootprint.total_emissions).label('min_emissions'),
            func.max(CarbonFootprint.total_emissions).label('max_emissions'),
            func.stddev(CarbonFootprint.total_emissions).label('emissions_stddev'),
            func.max(CarbonFootprint.calculation_date).label('last_calculation_date')
        ).filter(CarbonFootprint.user_id == user_id).first()
        
        # Get calculations in last 30 and 7 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        last_30_days = self.db.query(func.count(CarbonFootprint.id)).filter(
            and_(
                CarbonFootprint.user_id == user_id,
                CarbonFootprint.calculation_date >= thirty_days_ago
            )
        ).scalar()
        
        last_7_days = self.db.query(func.count(CarbonFootprint.id)).filter(
            and_(
                CarbonFootprint.user_id == user_id,
                CarbonFootprint.calculation_date >= seven_days_ago
            )
        ).scalar()
        
        return {
            'total_calculations': stats.total_calculations or 0,
            'average_emissions': float(stats.average_emissions) if stats.average_emissions else 0,
            'min_emissions': float(stats.min_emissions) if stats.min_emissions else 0,
            'max_emissions': float(stats.max_emissions) if stats.max_emissions else 0,
            'emissions_stddev': float(stats.emissions_stddev) if stats.emissions_stddev else 0,
            'last_calculation_date': stats.last_calculation_date,
            'calculations_last_30_days': last_30_days or 0,
            'calculations_last_7_days': last_7_days or 0
        }
    
    def get_footprint_trends(self, user_id: int, days: int = 30) -> List[Dict[str, Any]]:
        """Get user's emission trends over time"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        footprints = self.db.query(CarbonFootprint).filter(
            and_(
                CarbonFootprint.user_id == user_id,
                CarbonFootprint.calculation_date >= cutoff_date
            )
        ).order_by(CarbonFootprint.calculation_date).all()
        
        return [
            {
                'date': footprint.calculation_date.isoformat(),
                'total_emissions': float(footprint.total_emissions),
                'electricity_emissions': float(footprint.electricity_emissions),
                'transportation_emissions': float(footprint.transportation_emissions),
                'heating_emissions': float(footprint.heating_emissions),
                'waste_emissions': float(footprint.waste_emissions),
                'lifestyle_emissions': float(footprint.lifestyle_emissions)
            }
            for footprint in footprints
        ]
    
    def delete_footprint(self, footprint_id: int) -> bool:
        """Delete carbon footprint calculation"""
        footprint = self.get_footprint_by_id(footprint_id)
        if not footprint:
            return False
        
        self.db.delete(footprint)
        self.db.commit()
        return True

class RecommendationRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_recommendation(self, recommendation_data: RecommendationCreate) -> Recommendation:
        """Create a new recommendation"""
        db_recommendation = Recommendation(
            carbon_footprint_id=recommendation_data.carbon_footprint_id,
            category=recommendation_data.category,
            title=recommendation_data.title,
            description=recommendation_data.description,
            action_required=recommendation_data.action_required,
            potential_savings=recommendation_data.potential_savings,
            priority=recommendation_data.priority,
            estimated_impact=recommendation_data.estimated_impact
        )
        
        self.db.add(db_recommendation)
        self.db.commit()
        self.db.refresh(db_recommendation)
        return db_recommendation
    
    def create_recommendations_batch(self, recommendations_data: List[RecommendationCreate]) -> List[Recommendation]:
        """Create multiple recommendations in batch"""
        db_recommendations = []
        for rec_data in recommendations_data:
            db_rec = Recommendation(
                carbon_footprint_id=rec_data.carbon_footprint_id,
                category=rec_data.category,
                title=rec_data.title,
                description=rec_data.description,
                action_required=rec_data.action_required,
                potential_savings=rec_data.potential_savings,
                priority=rec_data.priority,
                estimated_impact=rec_data.estimated_impact
            )
            db_recommendations.append(db_rec)
        
        self.db.add_all(db_recommendations)
        self.db.commit()
        
        for rec in db_recommendations:
            self.db.refresh(rec)
        
        return db_recommendations
    
    def get_recommendations_by_footprint(self, carbon_footprint_id: int) -> List[Recommendation]:
        """Get recommendations for a specific carbon footprint"""
        return self.db.query(Recommendation).filter(
            Recommendation.carbon_footprint_id == carbon_footprint_id
        ).order_by(Recommendation.priority, Recommendation.created_at).all()
    
    def get_user_recommendations(self, user_id: int, skip: int = 0, limit: int = 50) -> List[Recommendation]:
        """Get all recommendations for a user"""
        return self.db.query(Recommendation).join(CarbonFootprint).filter(
            CarbonFootprint.user_id == user_id
        ).order_by(desc(Recommendation.created_at)).offset(skip).limit(limit).all()
    
    def get_recommendations_by_priority(self, priority: str, skip: int = 0, limit: int = 50) -> List[Recommendation]:
        """Get recommendations by priority level"""
        return self.db.query(Recommendation).filter(
            Recommendation.priority == priority
        ).order_by(desc(Recommendation.created_at)).offset(skip).limit(limit).all()
    
    def mark_recommendation_implemented(self, recommendation_id: int) -> bool:
        """Mark recommendation as implemented"""
        recommendation = self.db.query(Recommendation).filter(
            Recommendation.id == recommendation_id
        ).first()
        
        if not recommendation:
            return False
        
        recommendation.is_implemented = True
        recommendation.implemented_at = datetime.utcnow()
        self.db.commit()
        return True
    
    def get_implementation_stats(self, user_id: int) -> Dict[str, Any]:
        """Get recommendation implementation statistics for user"""
        total_recs = self.db.query(func.count(Recommendation.id)).join(CarbonFootprint).filter(
            CarbonFootprint.user_id == user_id
        ).scalar()
        
        implemented_recs = self.db.query(func.count(Recommendation.id)).join(CarbonFootprint).filter(
            and_(
                CarbonFootprint.user_id == user_id,
                Recommendation.is_implemented == True
            )
        ).scalar()
        
        return {
            'total_recommendations': total_recs or 0,
            'implemented_recommendations': implemented_recs or 0,
            'implementation_rate': (implemented_recs / total_recs * 100) if total_recs else 0
        }

class UserGoalRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_goal(self, user_id: int, goal_data: UserGoalCreate) -> UserGoal:
        """Create a new user goal"""
        db_goal = UserGoal(
            user_id=user_id,
            goal_type=goal_data.goal_type,
            target_emissions=goal_data.target_emissions,
            reduction_percentage=goal_data.reduction_percentage,
            target_date=goal_data.target_date,
            description=goal_data.description
        )
        
        self.db.add(db_goal)
        self.db.commit()
        self.db.refresh(db_goal)
        return db_goal
    
    def get_goal_by_id(self, goal_id: int) -> Optional[UserGoal]:
        """Get goal by ID"""
        return self.db.query(UserGoal).filter(UserGoal.id == goal_id).first()
    
    def get_user_goals(self, user_id: int, skip: int = 0, limit: int = 50) -> List[UserGoal]:
        """Get user's goals"""
        return self.db.query(UserGoal).filter(
            UserGoal.user_id == user_id
        ).order_by(desc(UserGoal.target_date)).offset(skip).limit(limit).all()
    
    def get_active_goals(self, user_id: int) -> List[UserGoal]:
        """Get user's active (not achieved) goals"""
        return self.db.query(UserGoal).filter(
            and_(
                UserGoal.user_id == user_id,
                UserGoal.is_achieved == False
            )
        ).order_by(UserGoal.target_date).all()
    
    def update_goal(self, goal_id: int, goal_data: UserGoalUpdate) -> Optional[UserGoal]:
        """Update user goal"""
        db_goal = self.get_goal_by_id(goal_id)
        if not db_goal:
            return None
        
        update_data = goal_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_goal, field, value)
        
        db_goal.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(db_goal)
        return db_goal
    
    def mark_goal_achieved(self, goal_id: int) -> bool:
        """Mark goal as achieved"""
        goal = self.get_goal_by_id(goal_id)
        if not goal:
            return False
        
        goal.is_achieved = True
        goal.achieved_at = datetime.utcnow()
        self.db.commit()
        return True
    
    def delete_goal(self, goal_id: int) -> bool:
        """Delete user goal"""
        goal = self.get_goal_by_id(goal_id)
        if not goal:
            return False
        
        self.db.delete(goal)
        self.db.commit()
        return True
    
    def get_goal_progress(self, user_id: int, goal_id: int) -> Optional[Dict[str, Any]]:
        """Get progress towards a specific goal"""
        goal = self.get_goal_by_id(goal_id)
        if not goal or goal.user_id != user_id:
            return None
        
        # Get user's latest carbon footprint
        latest_footprint = self.db.query(CarbonFootprint).filter(
            CarbonFootprint.user_id == user_id
        ).order_by(desc(CarbonFootprint.calculation_date)).first()
        
        if not latest_footprint:
            return None
        
        current_emissions = float(latest_footprint.total_emissions)
        
        if goal.target_emissions:
            progress = max(0, (goal.target_emissions - current_emissions) / goal.target_emissions * 100)
            remaining = max(0, current_emissions - goal.target_emissions)
        elif goal.reduction_percentage:
            # Calculate baseline from average of last 10 calculations
            baseline = self.db.query(func.avg(CarbonFootprint.total_emissions)).filter(
                CarbonFootprint.user_id == user_id
            ).scalar() or current_emissions
            
            target_emissions = baseline * (1 - goal.reduction_percentage / 100)
            progress = max(0, (target_emissions - current_emissions) / target_emissions * 100)
            remaining = max(0, current_emissions - target_emissions)
        else:
            return None
        
        return {
            'goal_id': goal_id,
            'current_emissions': current_emissions,
            'target_emissions': goal.target_emissions,
            'reduction_percentage': goal.reduction_percentage,
            'progress_percentage': progress,
            'remaining_emissions': remaining,
            'is_achieved': progress >= 100,
            'days_remaining': (goal.target_date - datetime.utcnow().date()).days if goal.target_date > datetime.utcnow().date() else 0
        }
