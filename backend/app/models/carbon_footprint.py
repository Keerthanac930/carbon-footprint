from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, Boolean, DECIMAL, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
import uuid

Base = declarative_base()

class PriorityEnum(PyEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class GoalTypeEnum(PyEnum):
    EMISSION_REDUCTION = "emission_reduction"
    CARBON_NEUTRAL = "carbon_neutral"
    SPECIFIC_TARGET = "specific_target"

class CarbonFootprint(Base):
    __tablename__ = "carbon_footprints"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    calculation_uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Input data stored as JSON for flexibility
    input_data = Column(JSON, nullable=False)
    
    # Calculated results
    total_emissions = Column(DECIMAL(10, 2), nullable=False)
    confidence_score = Column(DECIMAL(5, 4), nullable=False)  # 0.0000 to 1.0000
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=True)
    
    # Breakdown by category
    electricity_emissions = Column(DECIMAL(10, 2), default=0)
    transportation_emissions = Column(DECIMAL(10, 2), default=0)
    heating_emissions = Column(DECIMAL(10, 2), default=0)
    waste_emissions = Column(DECIMAL(10, 2), default=0)
    lifestyle_emissions = Column(DECIMAL(10, 2), default=0)
    other_emissions = Column(DECIMAL(10, 2), default=0)
    
    # Metadata
    calculation_date = Column(DateTime, default=func.now())
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    is_anonymous = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    recommendations = relationship("Recommendation", back_populates="carbon_footprint")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    carbon_footprint_id = Column(Integer, ForeignKey("carbon_footprints.id"), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    action_required = Column(Text, nullable=False)
    potential_savings = Column(String(255), nullable=False)
    priority = Column(Enum(PriorityEnum), nullable=False, index=True)
    estimated_impact = Column(DECIMAL(5, 2), nullable=True)  # Percentage reduction
    is_implemented = Column(Boolean, default=False)
    implemented_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    carbon_footprint = relationship("CarbonFootprint", back_populates="recommendations")

class UserGoal(Base):
    __tablename__ = "user_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    goal_type = Column(Enum(GoalTypeEnum), nullable=False)
    target_emissions = Column(DECIMAL(10, 2), nullable=True)
    reduction_percentage = Column(DECIMAL(5, 2), nullable=True)
    target_date = Column(DateTime, nullable=False)
    description = Column(Text, nullable=True)
    is_achieved = Column(Boolean, default=False, index=True)
    achieved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    table_name = Column(String(100), nullable=False, index=True)
    record_id = Column(Integer, nullable=True)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), index=True)

class SystemConfig(Base):
    __tablename__ = "system_config"
    
    id = Column(Integer, primary_key=True, index=True)
    config_key = Column(String(100), unique=True, nullable=False, index=True)
    config_value = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
