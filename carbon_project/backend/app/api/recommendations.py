from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.connection import get_db

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/{user_id}")
async def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """Get personalized recommendations"""
    return {
        "recommendations": [
            {"category": "transport", "tip": "Use public transport", "impact": "High"},
            {"category": "energy", "tip": "Switch to LED bulbs", "impact": "Medium"},
            {"category": "food", "tip": "Reduce meat consumption", "impact": "High"}
        ]
    }

