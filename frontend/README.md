# Carbon Footprint Frontend

A modern, interactive frontend for the Carbon Footprint Prediction API with digital twin capabilities and voice assistant integration.

## Features

### 🌱 Individual Carbon Footprint Calculator
- Multi-step form with progress tracking
- Real-time validation and error handling
- Beautiful, responsive design with climate-themed background
- Smooth animations and transitions

### 🔮 Digital Twin Dashboard
- Real-time carbon footprint visualization
- Timeline charts showing footprint changes over time
- Scenario simulations (transport, energy, diet, waste optimization)
- Personalized recommendations with savings potential
- Interactive comparison between current and optimized footprints

### 🎤 Voice Assistant
- Soft, energetic, and happy tone [[memory:7597929]]
- Starts with "Hi I'm your carbon footprint assistant" in text
- Only speaks when user clicks the speaker icon
- American accent support
- Voice commands for navigation and assistance

### 📊 Results & Analytics
- Detailed breakdown of carbon footprint by category
- Annual and monthly emissions with comparisons
- Personalized recommendations
- Digital twin integration

## Technology Stack

- **React 18** - Modern React with hooks
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **Web Speech API** - Voice recognition and synthesis
- **Chart.js** - Data visualization (timeline charts)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Backend API running on http://localhost:9005

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Or use the provided batch file on Windows:
```bash
start-frontend.bat
```

The application will open at http://localhost:3000

## API Integration

The frontend integrates with the Carbon Footprint Prediction API:

- **Individual Predictions**: `/predict/individual`
- **Digital Twin Management**: `/api/twin/*`
- **Scenario Simulations**: `/api/twin/simulate`
- **Recommendations**: `/api/twin/recommendations`
- **Timeline Data**: `/api/twin/timeline`

## Key Components

### CarbonCalculator
Multi-step form for collecting individual carbon footprint data with:
- Household information
- Energy usage
- Transportation details
- Climate and lifestyle factors
- Waste and consumption patterns

### Results
Displays carbon footprint results with:
- Monthly and annual emissions
- Category breakdown
- Digital twin comparison
- Personalized recommendations

### DigitalTwinDashboard
Advanced dashboard featuring:
- Current vs optimized footprint comparison
- Interactive timeline visualization
- Scenario simulation tools
- Recommendation management
- Real-time data updates

### VoiceAssistant
Voice-enabled assistant with:
- Speech recognition for voice commands
- Text-to-speech with American accent
- Navigation assistance
- Contextual help and guidance

## Styling & Animations

The frontend features:
- Climate-themed video background
- Smooth scroll animations
- Hover effects and transitions
- Responsive design for all devices
- Accessibility features (reduced motion, high contrast)
- Custom scrollbar styling

## Voice Commands

The voice assistant responds to:
- "Calculate footprint" - Navigate to calculator
- "View results" - Show results page
- "Digital twin" - Open digital twin dashboard
- "Help" - Get assistance information

## Browser Support

- Chrome (recommended for voice features)
- Firefox
- Safari
- Edge

## Development

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── CarbonCalculator.js
│   │   ├── Results.js
│   │   ├── DigitalTwinDashboard.js
│   │   ├── VoiceAssistant.js
│   │   └── ...
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   └── App.js
├── public/
└── package.json
```

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Contributing

1. Follow the existing code style
2. Add comments for complex functionality
3. Test voice features in Chrome
4. Ensure responsive design
5. Maintain accessibility standards

## License

This project is part of the Carbon Footprint Prediction System.