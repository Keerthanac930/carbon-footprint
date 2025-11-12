from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ..database.connection import get_db
from ..services.auth_service import AuthService
from ..schemas.user import UserResponse

router = APIRouter(prefix="/marketplace", tags=["marketplace"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

def get_current_user(
    session_token: Optional[str] = Header(None, alias="X-Session-Token"),
    auth_service: AuthService = Depends(get_auth_service)
) -> Optional[UserResponse]:
    """Get current user if authenticated, otherwise return None (for anonymous access)"""
    if not session_token:
        return None
    try:
        user = auth_service.get_user_by_session_token(session_token)
        return user
    except Exception:
        return None

# Marketplace Item Models
class MarketplaceItem(BaseModel):
    id: str
    title: str
    description: str
    category: str  # 'offset', 'product', 'service'
    price: float
    image_url: Optional[str] = None
    icon: Optional[str] = None
    carbon_offset: Optional[float] = None
    sustainability_score: Optional[float] = None
    brand: Optional[str] = None
    tags: List[str] = []
    is_featured: bool = False
    stock: Optional[int] = None
    location: Optional[str] = None
    metadata: Optional[dict] = None

class PurchaseRequest(BaseModel):
    item_id: str
    quantity: int = 1

class PurchaseResponse(BaseModel):
    success: bool
    message: str
    purchase_id: Optional[str] = None

# Mock marketplace data (In production, this would come from a database)
MARKETPLACE_ITEMS = [
    # Carbon Offset Projects
    {
        "id": "offset_1",
        "title": "Tree Planting - India",
        "description": "Plant trees in reforestation projects across India. Each tree offsets approximately 0.5 tonnes of CO₂ over its lifetime.",
        "category": "offset",
        "price": 2500.0,
        "icon": "🌳",
        "carbon_offset": 5.0,
        "sustainability_score": 95.0,
        "location": "India",
        "tags": ["reforestation", "trees", "carbon-offset"],
        "is_featured": True,
        "metadata": {
            "project_type": "reforestation",
            "trees_planted": 10,
            "duration": "lifetime"
        }
    },
    {
        "id": "offset_2",
        "title": "Solar Energy Project",
        "description": "Support solar energy projects that reduce reliance on fossil fuels. Clean, renewable energy for communities.",
        "category": "offset",
        "price": 5000.0,
        "icon": "☀️",
        "carbon_offset": 10.0,
        "sustainability_score": 98.0,
        "location": "India",
        "tags": ["solar", "renewable-energy", "clean-energy"],
        "is_featured": True,
        "metadata": {
            "project_type": "renewable-energy",
            "energy_generated": "10 MWh"
        }
    },
    {
        "id": "offset_3",
        "title": "Ocean Cleanup Initiative",
        "description": "Contribute to ocean cleanup projects that remove plastic waste from oceans and protect marine life.",
        "category": "offset",
        "price": 4000.0,
        "icon": "🌊",
        "carbon_offset": 8.0,
        "sustainability_score": 92.0,
        "location": "Global",
        "tags": ["ocean", "plastic", "cleanup"],
        "is_featured": False
    },
    {
        "id": "offset_4",
        "title": "Wind Energy Farm",
        "description": "Support wind energy farms that generate clean electricity and reduce carbon emissions.",
        "category": "offset",
        "price": 6000.0,
        "icon": "💨",
        "carbon_offset": 12.0,
        "sustainability_score": 96.0,
        "location": "India",
        "tags": ["wind", "renewable-energy"]
    },
    {
        "id": "offset_5",
        "title": "Mangrove Restoration",
        "description": "Restore mangrove forests that act as carbon sinks and protect coastlines from erosion.",
        "category": "offset",
        "price": 3500.0,
        "icon": "🌿",
        "carbon_offset": 7.0,
        "sustainability_score": 94.0,
        "location": "India",
        "tags": ["mangrove", "restoration", "coastal"]
    },
    # Sustainable Products
    {
        "id": "product_1",
        "title": "Bamboo Toothbrush Set",
        "description": "Eco-friendly bamboo toothbrushes with biodegradable bristles. Pack of 4.",
        "category": "product",
        "price": 299.0,
        "icon": "🪥",
        "sustainability_score": 85.0,
        "brand": "EcoBrush",
        "tags": ["bamboo", "plastic-free", "biodegradable"],
        "is_featured": True,
        "stock": 50
    },
    {
        "id": "product_2",
        "title": "Reusable Water Bottle",
        "description": "Stainless steel water bottle, BPA-free, keeps drinks cold for 24 hours.",
        "category": "product",
        "price": 799.0,
        "icon": "🥤",
        "sustainability_score": 90.0,
        "brand": "GreenLife",
        "tags": ["reusable", "steel", "bpa-free"],
        "is_featured": True,
        "stock": 30
    },
    {
        "id": "product_3",
        "title": "Solar-Powered Charger",
        "description": "Portable solar charger for phones and tablets. Environmentally friendly charging solution.",
        "category": "product",
        "price": 1499.0,
        "icon": "🔌",
        "sustainability_score": 88.0,
        "brand": "SunCharge",
        "tags": ["solar", "charger", "portable"],
        "stock": 25
    },
    {
        "id": "product_4",
        "title": "Organic Cotton T-Shirt",
        "description": "100% organic cotton t-shirt, fair trade certified, sustainable fashion.",
        "category": "product",
        "price": 899.0,
        "icon": "👕",
        "sustainability_score": 87.0,
        "brand": "EcoWear",
        "tags": ["organic", "cotton", "fair-trade"],
        "stock": 40
    },
    {
        "id": "product_5",
        "title": "Compostable Food Containers",
        "description": "Biodegradable food containers made from plant-based materials. Pack of 20.",
        "category": "product",
        "price": 499.0,
        "icon": "🥡",
        "sustainability_score": 82.0,
        "brand": "BioBox",
        "tags": ["compostable", "biodegradable", "food-containers"],
        "stock": 60
    },
    {
        "id": "product_6",
        "title": "LED Energy-Saving Bulbs",
        "description": "Energy-efficient LED bulbs that last 10+ years and reduce electricity consumption by 80%.",
        "category": "product",
        "price": 399.0,
        "icon": "💡",
        "sustainability_score": 91.0,
        "brand": "EcoLight",
        "tags": ["led", "energy-efficient", "long-lasting"],
        "stock": 100
    },
    # Eco Services
    {
        "id": "service_1",
        "title": "Carbon Footprint Audit",
        "description": "Professional carbon footprint assessment for your home or business with detailed report and recommendations.",
        "category": "service",
        "price": 2999.0,
        "icon": "📊",
        "sustainability_score": 95.0,
        "tags": ["audit", "assessment", "consulting"],
        "is_featured": True
    },
    {
        "id": "service_2",
        "title": "Sustainable Home Consultation",
        "description": "Expert consultation to make your home more energy-efficient and sustainable.",
        "category": "service",
        "price": 4999.0,
        "icon": "🏠",
        "sustainability_score": 93.0,
        "tags": ["consultation", "home", "energy-efficiency"]
    },
    {
        "id": "service_3",
        "title": "E-Waste Recycling Service",
        "description": "Professional e-waste collection and recycling service for electronic devices.",
        "category": "service",
        "price": 1999.0,
        "icon": "♻️",
        "sustainability_score": 89.0,
        "tags": ["recycling", "e-waste", "collection"]
    },
    {
        "id": "service_4",
        "title": "Green Energy Consultation",
        "description": "Expert advice on transitioning to renewable energy sources for your home or business.",
        "category": "service",
        "price": 3999.0,
        "icon": "⚡",
        "sustainability_score": 96.0,
        "tags": ["energy", "renewable", "consultation"]
    },
]

@router.get("/items", response_model=List[MarketplaceItem])
async def get_marketplace_items(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    current_user: Optional[UserResponse] = Depends(get_current_user)
):
    """Get all marketplace items, optionally filtered by category or featured status"""
    items = MARKETPLACE_ITEMS.copy()
    
    # Filter by category if provided
    if category:
        items = [item for item in items if item["category"] == category]
    
    # Filter by featured if provided
    if featured is not None:
        items = [item for item in items if item.get("is_featured") == featured]
    
    return items

@router.get("/items/{item_id}", response_model=MarketplaceItem)
async def get_marketplace_item(
    item_id: str,
    current_user: Optional[UserResponse] = Depends(get_current_user)
):
    """Get a specific marketplace item by ID"""
    item = next((item for item in MARKETPLACE_ITEMS if item["id"] == item_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return item

@router.post("/purchase", response_model=PurchaseResponse)
async def purchase_item(
    purchase_request: PurchaseRequest,
    current_user: Optional[UserResponse] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Purchase a marketplace item"""
    # Find the item
    item = next((item for item in MARKETPLACE_ITEMS if item["id"] == purchase_request.item_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Check stock if it's a product
    if item["category"] == "product" and item.get("stock") is not None:
        if item["stock"] < purchase_request.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough stock. Available: {item['stock']}"
            )
    
    # In a real application, you would:
    # 1. Process payment
    # 2. Create purchase record in database
    # 3. Update inventory
    # 4. Send confirmation email
    # 5. Track user's carbon offset purchases
    
    # For now, return success response
    purchase_id = f"purchase_{purchase_request.item_id}_{current_user.id if current_user else 'anon'}"
    
    return PurchaseResponse(
        success=True,
        message=f"Purchase successful! {purchase_request.quantity} x {item['title']}",
        purchase_id=purchase_id
    )

