from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from ..database.connection import get_db
from ..services.auth_service import AuthService
from ..schemas.user import UserResponse

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

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

# Chatbot Models
class ChatbotRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None

class ChatbotResponse(BaseModel):
    answer: str
    conversation_id: Optional[str] = None
    suggestions: Optional[list] = None

# Simple keyword-based response system
# In production, this would use a more sophisticated AI/ML model
def get_chatbot_response(question: str, user_name: Optional[str] = None) -> str:
    """Generate chatbot response based on user question"""
    question_lower = question.lower()
    
    # Greeting responses
    if any(word in question_lower for word in ["hello", "hi", "hey", "greetings"]):
        greeting = f"Hello{' ' + user_name if user_name else ''}! 👋" if user_name else "Hello! 👋"
        return f"{greeting} I'm your eco-assistant. Ask me about reducing your carbon footprint, sustainable living tips, or environmental news!"
    
    # Reduce emissions
    if any(word in question_lower for word in ["reduce", "lower", "decrease", "cut down", "minimize"]):
        return """Here are some effective ways to reduce your carbon footprint:

1. **Transportation**: Use public transportation, carpool, walk, or bike instead of driving alone
2. **Energy**: Switch to energy-efficient appliances, use LED bulbs, and turn off lights when not needed
3. **Diet**: Reduce meat consumption, especially beef, and choose locally sourced foods
4. **Waste**: Reduce, reuse, and recycle. Compost organic waste
5. **Energy Sources**: Switch to renewable energy sources like solar or wind power
6. **Water**: Reduce water consumption and fix leaks
7. **Shopping**: Buy less, choose sustainable products, and avoid single-use plastics
8. **Travel**: Consider carbon offsets when flying, or choose train/bus over flights

Would you like more specific tips for any of these areas?"""
    
    # Calculate footprint
    if any(word in question_lower for word in ["calculate", "footprint", "emissions", "carbon"]):
        return """To calculate your carbon footprint:

1. **Use the Calculator**: Navigate to the Calculator screen in the app
2. **Input Your Data**: Provide information about:
   - Your household size and energy usage
   - Transportation habits (car, public transport, flights)
   - Food consumption patterns
   - Lifestyle choices (shopping, waste, etc.)
3. **Get Results**: The app will calculate your total carbon footprint and provide:
   - Breakdown by category
   - Comparison with averages
   - Personalized recommendations
4. **Track Progress**: Save your calculations to track improvements over time

Would you like help with any specific category?"""
    
    # Badges and points
    if any(word in question_lower for word in ["badge", "point", "reward", "gamification", "achievement"]):
        return """You can earn badges and points by:

1. **Completing Calculations**: Calculate your carbon footprint regularly
2. **Maintaining Streaks**: Use the app daily to maintain streaks
3. **Reducing Emissions**: Track and reduce your carbon footprint over time
4. **Following Recommendations**: Implement the app's suggestions
5. **Engaging with Features**: Use OCR scanner, chatbot, marketplace, etc.
6. **Setting Goals**: Set and achieve carbon reduction goals
7. **Community Participation**: Engage with the community features

Check the Rewards section to see your current progress and available badges!"""
    
    # Recommendations
    if any(word in question_lower for word in ["recommend", "suggest", "advice", "tip", "help"]):
        return """Based on your carbon footprint, I recommend:

1. **Review Transportation**: Check if you can use public transport, carpool, or walk more
2. **Energy Efficiency**: Switch to energy-efficient appliances and LED bulbs
3. **Diet Changes**: Reduce meat consumption, especially beef and lamb
4. **Waste Reduction**: Reduce, reuse, and recycle. Compost organic waste
5. **Energy Sources**: Consider switching to renewable energy
6. **Water Conservation**: Fix leaks and reduce water usage
7. **Sustainable Shopping**: Buy less, choose sustainable products
8. **Carbon Offsets**: Support carbon offset projects through the marketplace

Check the Recommendations section for personalized tips based on your specific footprint!"""
    
    # Transportation
    if any(word in question_lower for word in ["transport", "car", "vehicle", "drive", "travel", "flight"]):
        return """Transportation is a major source of carbon emissions. Here are tips:

1. **Use Public Transport**: Buses, trains, and subways are more efficient than cars
2. **Carpool**: Share rides with others to reduce emissions per person
3. **Walk or Bike**: For short distances, walk or bike instead of driving
4. **Electric Vehicles**: Consider switching to electric or hybrid vehicles
5. **Flight Alternatives**: For short distances, consider trains or buses instead of flights
6. **Carbon Offsets**: When flying is necessary, purchase carbon offsets
7. **Maintain Your Vehicle**: Keep your car well-maintained for better fuel efficiency
8. **Drive Efficiently**: Avoid rapid acceleration and braking, maintain steady speeds

What type of transportation do you use most often?"""
    
    # Energy
    if any(word in question_lower for word in ["energy", "electricity", "power", "electric", "light", "appliance"]):
        return """Reduce energy consumption with these tips:

1. **LED Bulbs**: Replace incandescent bulbs with energy-efficient LED bulbs
2. **Energy Star Appliances**: Choose Energy Star certified appliances
3. **Unplug Devices**: Unplug electronics when not in use (phantom energy)
4. **Smart Thermostats**: Use programmable thermostats to optimize heating/cooling
5. **Insulation**: Improve home insulation to reduce heating/cooling needs
6. **Renewable Energy**: Switch to solar or wind power if possible
7. **Natural Light**: Use natural light during the day instead of artificial lighting
8. **Energy Audit**: Get a professional energy audit to identify savings opportunities

Would you like more specific tips for your home?"""
    
    # Food
    if any(word in question_lower for word in ["food", "diet", "eat", "meal", "meat", "vegetable"]):
        return """Food choices significantly impact your carbon footprint:

1. **Reduce Meat**: Especially beef and lamb, which have high carbon footprints
2. **Local and Seasonal**: Choose locally sourced and seasonal foods
3. **Plant-Based**: Increase plant-based foods in your diet
4. **Avoid Food Waste**: Plan meals, store food properly, and compost scraps
5. **Organic Options**: Choose organic when possible
6. **Reduce Packaging**: Buy foods with less packaging
7. **Grow Your Own**: Grow vegetables and herbs at home if possible
8. **Sustainable Seafood**: Choose sustainably sourced seafood

What's your current diet like?"""
    
    # Waste
    if any(word in question_lower for word in ["waste", "trash", "garbage", "recycle", "compost", "plastic"]):
        return """Reduce waste with these strategies:

1. **Reduce**: Buy less and choose products with less packaging
2. **Reuse**: Repurpose items instead of throwing them away
3. **Recycle**: Properly sort and recycle materials
4. **Compost**: Compost organic waste like food scraps
5. **Avoid Single-Use**: Avoid single-use plastics and disposable items
6. **Repair**: Repair items instead of replacing them
7. **Donate**: Donate items you no longer need
8. **E-Waste**: Properly dispose of electronic waste through recycling programs

What type of waste do you generate most?"""
    
    # Default response
    return """I'm here to help you with sustainability and carbon footprint reduction! 🌱

You can ask me about:
- How to reduce your carbon footprint
- Transportation tips
- Energy saving strategies
- Food and diet recommendations
- Waste reduction methods
- Calculating your footprint
- Badges and rewards
- Carbon offset projects
- And much more!

What would you like to know?"""

@router.post("", response_model=ChatbotResponse)
async def chat_with_bot(
    request: ChatbotRequest,
    current_user: Optional[UserResponse] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with the AI sustainability assistant"""
    if not request.question or not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty"
        )
    
    # Get user name if authenticated
    user_name = current_user.name if current_user else None
    
    # Generate response
    answer = get_chatbot_response(request.question, user_name)
    
    # Generate suggestions based on question
    suggestions = []
    question_lower = request.question.lower()
    
    if "reduce" in question_lower or "lower" in question_lower:
        suggestions = [
            "How can I reduce transportation emissions?",
            "What are energy saving tips?",
            "How to reduce food waste?"
        ]
    elif "calculate" in question_lower or "footprint" in question_lower:
        suggestions = [
            "How do I use the calculator?",
            "What data do I need to provide?",
            "How accurate are the calculations?"
        ]
    elif "badge" in question_lower or "point" in question_lower:
        suggestions = [
            "How do I earn more points?",
            "What badges are available?",
            "How do I check my progress?"
        ]
    else:
        suggestions = [
            "How can I reduce my carbon footprint?",
            "What are transportation tips?",
            "How to save energy at home?"
        ]
    
    return ChatbotResponse(
        answer=answer,
        conversation_id=request.conversation_id,
        suggestions=suggestions
    )

@router.get("/health")
async def chatbot_health():
    """Health check for chatbot service"""
    return {"status": "healthy", "service": "chatbot"}

