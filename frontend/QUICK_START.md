# Quick Start Guide

## 🚀 Getting Your Carbon Footprint Frontend Running

### Step 1: Start the Backend API
Make sure your FastAPI backend is running on port 9005:
```bash
# In your backend directory
python main.py
# or
uvicorn main:app --host 127.0.0.1 --port 9005
```

### Step 2: Start the Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

### Step 3: Open Your Browser
The application will automatically open at: http://localhost:3000

## 🎯 What You Can Do

### 1. Calculate Your Carbon Footprint
- Fill out the multi-step form
- Get your personalized carbon footprint
- View detailed breakdown by category

### 2. Explore Your Digital Twin
- See current vs optimized footprint
- Run scenario simulations
- Get personalized recommendations
- Track your progress over time

### 3. Use the Voice Assistant
- Click the 🌱 button in the bottom-right
- Click the speaker icon to hear responses
- Try voice commands like:
  - "Calculate footprint"
  - "View results"
  - "Digital twin"
  - "Help"

## 🔧 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 9005
- Check console for API connection errors
- Verify CORS settings in backend

### Voice Assistant Not Working
- Use Chrome browser for best compatibility
- Allow microphone permissions when prompted
- Check browser console for speech API errors

### Styling Issues
- Clear browser cache
- Ensure all CSS files are loaded
- Check for JavaScript errors in console

## 📱 Mobile Support
The frontend is fully responsive and works on:
- Mobile phones
- Tablets
- Desktop computers
- All modern browsers

## 🎨 Features Overview

### Visual Design
- Climate-themed video background
- Smooth animations and transitions
- Responsive grid layouts
- Custom scrollbar styling

### Interactive Elements
- Multi-step form with progress tracking
- Real-time validation
- Hover effects and transitions
- Voice interaction

### Data Visualization
- Timeline charts
- Comparison graphs
- Category breakdowns
- Scenario simulations

## 🆘 Need Help?
- Check the browser console for errors
- Ensure all dependencies are installed
- Verify backend API is running
- Try refreshing the page

Happy calculating! 🌱
