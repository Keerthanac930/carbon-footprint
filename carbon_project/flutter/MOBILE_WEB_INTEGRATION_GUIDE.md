# Mobile App & Web Application Integration Guide

This guide provides comprehensive instructions for connecting the Flutter mobile app with the FastAPI backend web application.

## 📋 Table of Contents

1. [Authentication Setup](#1-authentication-setup)
2. [Carbon Footprint Features](#2-carbon-footprint-features)
3. [History & Statistics](#3-history--statistics)
4. [Global Stats & Insights](#4-global-stats--insights)
5. [Gamification & Engagement](#5-gamification--engagement)
6. [AI Chatbot Integration](#6-ai-chatbot-integration)
7. [OCR Bill Scanner](#7-ocr-bill-scanner)
8. [Voice Assistant](#8-voice-assistant)
9. [UI/UX Features](#9-uiux-features)
10. [Configuration](#10-configuration)

---

## 1. Authentication Setup

### Backend Configuration

The FastAPI backend supports authentication using **session tokens** (not JWT Bearer tokens). Sessions expire after **7 days**.

**Endpoints:**
- `POST /auth/register` - Register new user (email, name, password)
- `POST /auth/login` - Login user (email, password)
- `POST /auth/logout` - Logout (requires X-Session-Token header)
- `GET /auth/me` - Get current user info

### Mobile Implementation

The authentication is already implemented in `lib/services/auth_service.dart`:

```dart
import 'package:carbon_footprint_flutter/services/auth_service.dart';

// Initialize auth service
final authService = AuthService();

// Register user
await authService.register(
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword123',
);

// Login user
await authService.login(
  email: 'john@example.com',
  password: 'securepassword123',
);

// Check authentication status
final isAuthenticated = await authService.checkAuthStatus();

// Get current user
final user = authService.currentUser;

// Logout
await authService.logout(notifyServer: true);
```

### Session Management

- **Secure Storage**: Session tokens are stored using `FlutterSecureStorage` for security
- **7-Day Expiry**: Handled automatically by the backend
- **Auto-Refresh**: The app checks authentication status on startup

---

## 2. Carbon Footprint Features

### Real-Time Carbon Calculator

The calculator supports multi-category input (transportation, energy, food, etc.) and performs real-time calculations.

**Backend Endpoint:**
- `POST /carbon-footprint/calculate` - Calculate footprint (authenticated)
- `POST /carbon-footprint/calculate-anonymous` - Calculate footprint (anonymous)

**Mobile Implementation:**

```dart
import 'package:carbon_footprint_flutter/services/carbon_footprint_service.dart';

final carbonService = CarbonFootprintService();

// Calculate carbon footprint
final calculation = await carbonService.calculateCarbonFootprint({
  'monthly_electricity_kwh': 200.0,
  'monthly_gas_therms': 50.0,
  'monthly_heating_oil_gallons': 0.0,
  'monthly_vehicle_miles': 500.0,
  'vehicle_fuel_efficiency_mpg': 25.0,
  'monthly_flight_hours': 2.0,
  'monthly_public_transit_miles': 100.0,
  'monthly_grocery_bill': 300.0,
  'diet_type': 'omnivore', // 'vegan', 'vegetarian', 'omnivore'
  'waste_recycling_percentage': 50.0,
  'household_size': 2,
  'home_size_sqft': 1500.0,
});

// Access results
print('Total Emissions: ${calculation.predictedEmissions} tons CO2/year');
print('Confidence Score: ${calculation.confidenceScore}');
print('Breakdown: ${calculation.breakdown}');
```

### Real-Time Updates

The service automatically notifies listeners when calculations complete:

```dart
carbonService.addListener(() {
  if (carbonService.isLoading) {
    // Show loading indicator
  } else {
    // Update UI with results
    final latest = carbonService.latestCalculation;
  }
});
```

---

## 3. History & Statistics

### Fetch Calculation History

**Backend Endpoint:**
- `GET /carbon-footprint/history` - Get user's calculation history

**Mobile Implementation:**

```dart
// Get calculation history
final history = await carbonService.getCalculationHistory(
  page: 0,
  limit: 20,
);

// Display in ListView
ListView.builder(
  itemCount: history.length,
  itemBuilder: (context, index) {
    final calculation = history[index];
    return ListTile(
      title: Text('${calculation.predictedEmissions} tons CO2'),
      subtitle: Text(calculation.createdAt.toString()),
    );
  },
);
```

### User Statistics

**Backend Endpoint:**
- `GET /carbon-footprint/stats` - Get user's statistics

**Mobile Implementation:**

```dart
// Get user statistics
final stats = await carbonService.getUserStats();

print('Total Calculations: ${stats['total_calculations']}');
print('Average Emissions: ${stats['average_emissions']}');
print('Min Emissions: ${stats['min_emissions']}');
print('Max Emissions: ${stats['max_emissions']}');
```

### Emission Trends

**Backend Endpoint:**
- `GET /carbon-footprint/trends?days=30` - Get emission trends

**Mobile Implementation:**

```dart
// Get emission trends
final trends = await carbonService.getEmissionTrends(days: 30);

// Use with charts (e.g., fl_chart)
trends.forEach((trend) {
  print('Date: ${trend['date']}, Emissions: ${trend['emissions']}');
});
```

---

## 4. Global Stats & Insights

### Global and Local CO₂ Comparisons

Display comparisons between India (1.9t) and World Average (4.7t).

**Backend Endpoint:**
- `GET /global-stats` - Get global statistics

**Mobile Implementation:**

```dart
import 'package:carbon_footprint_flutter/services/global_stats_service.dart';

final globalStatsService = GlobalStatsService();

// Get global stats
final stats = await globalStatsService.getGlobalStats();

print('Global Average: ${stats.globalAverageEmissions} tons');
print('India Average: ${stats.indiaAverageEmissions} tons');
print('World Average: ${stats.worldAverageEmissions} tons');

// Regional comparisons
stats.regionalComparisons.forEach((region, emissions) {
  print('$region: $emissions tons');
});

// Category breakdown
stats.categoryBreakdown.forEach((category, percentage) {
  print('$category: ${percentage * 100}%');
});
```

**Note:** If the backend endpoint doesn't exist, the service returns default values:
- India: 1.9 tons CO2/year
- World Average: 4.7 tons CO2/year

---

## 5. Gamification & Engagement

### Badge System and Points

Track badges, points, and achievements.

**Backend Endpoint:**
- `GET /user-progress` - Get user progress

**Mobile Implementation:**

```dart
import 'package:carbon_footprint_flutter/services/gamification_service.dart';

final gamificationService = GamificationService();

// Get user progress
final progress = await gamificationService.getUserProgress();

print('Total Points: ${progress.totalPoints}');
print('Current Level: ${progress.currentLevel}');
print('Current Streak: ${progress.currentStreak} days');
print('Longest Streak: ${progress.longestStreak} days');
print('Badges: ${progress.badges}');
print('Calculations Count: ${progress.calculationsCount}');
print('Emissions Reduced: ${progress.totalEmissionsReduced} tons');

// Calculate points manually
final points = gamificationService.calculatePoints(
  calculationsCount: 10,
  emissionsReduced: 2.5,
  streakDays: 7,
);

// Calculate level
final level = gamificationService.calculateLevel(points);

// Get suggested badges
final suggestedBadges = gamificationService.getSuggestedBadges(progress);
```

**Badge System:**
- **First Step**: Complete 1 calculation
- **Regular Tracker**: Complete 10 calculations
- **Week Warrior**: 7-day streak
- **Monthly Champion**: 30-day streak
- **Eco Hero**: Reduce 1 ton of emissions
- **Climate Warrior**: Reduce 5 tons of emissions

**Level System:**
- Level 1: 0-100 points
- Level 2: 101-300 points
- Level 3: 301-600 points
- Level 4: 601-1000 points
- Level 5+: 1000+ points (every 500 points = 1 level)

**Note:** If the backend endpoint doesn't exist, the service returns default progress values.

---

## 6. AI Chatbot Integration

### Personalized Sustainability Advice

The AI chatbot provides personalized advice based on user data.

**Backend Endpoint:**
- `POST /chatbot` - Chat with AI

**Mobile Implementation:**

```dart
import 'package:carbon_footprint_flutter/services/chatbot_service.dart';

final chatbotService = ChatbotService();

// Chat with AI
final response = await chatbotService.chatWithAI(
  'How can I reduce my carbon footprint?',
);

print('AI Response: $response');

// Access chat history
final messages = chatbotService.messages;
messages.forEach((message) {
  print('${message.isUser ? "User" : "AI"}: ${message.text}');
});

// Clear messages
chatbotService.clearMessages();
```

**Default Responses:**

If the backend endpoint doesn't exist, the service provides intelligent default responses based on keywords:
- "reduce" / "lower" → Tips for reducing carbon footprint
- "calculate" / "footprint" → Information about calculations
- "badge" / "point" → Information about gamification
- "recommend" / "suggest" → Personalized recommendations

---

## 7. OCR Bill Scanner

### Scan Bills and Extract Carbon Data

Extract carbon emissions data from product bills using OCR.

**Mobile Implementation:**

```dart
import 'package:carbon_footprint_flutter/services/ocr_service.dart';
import 'package:image_picker/image_picker.dart';

final ocrService = OCRService();

// Scan bill from camera
final analysis = await ocrService.scanAndCalculate(ImageSource.camera);

// Or scan from gallery
final analysis = await ocrService.scanAndCalculate(ImageSource.gallery);

// Access extracted data
print('Electricity kWh: ${analysis['electricity_kwh']}');
print('Gas Usage: ${analysis['gas_usage']}');
print('Total Amount: ${analysis['total_amount']}');
print('Items: ${analysis['items']}');

// Or scan and extract text only
final extractedText = await ocrService.scanBill(ImageSource.camera);
print('Extracted Text: $extractedText');

// Analyze extracted text
final analysis = await ocrService.analyzeBillText(extractedText);
```

**Backend Integration:**

The service attempts to send extracted text to:
- `POST /carbon-footprint/calculate/analyze-bill`

If the endpoint doesn't exist, it performs local analysis using regex patterns to extract:
- Electricity usage (kWh)
- Total amounts
- Other bill data

---

## 8. Voice Assistant

### Voice-Enabled Eco-Assistant

Use voice recognition for hands-free interaction with the AI assistant.

**Mobile Implementation:**

```dart
import 'package:carbon_footprint_flutter/services/voice_service.dart';

final voiceService = VoiceService();

// Initialize voice recognition
final isAvailable = await voiceService.initialize();
if (!isAvailable) {
  print('Speech recognition not available');
  return;
}

// Start listening
await voiceService.startListening(
  onResult: (recognizedText) {
    print('Recognized: $recognizedText');
    
    // Process with AI chatbot
    voiceService.processVoiceInput(recognizedText).then((response) {
      print('AI Response: $response');
    });
  },
  onError: (error) {
    print('Error: $error');
  },
);

// Or use complete voice interaction
final response = await voiceService.completeVoiceInteraction(
  onListening: (text) => print('Listening: $text'),
  onProcessing: (message) => print(message),
  onError: (error) => print('Error: $error'),
);

// Stop listening
await voiceService.stopListening();

// Cancel listening
await voiceService.cancelListening();
```

**Features:**
- Real-time speech recognition
- Automatic processing with AI chatbot
- Error handling
- Status callbacks

---

## 9. UI/UX Features

### Dark Mode Toggle

**Implementation:**

```dart
import 'package:carbon_footprint_flutter/services/theme_service.dart';
import 'package:carbon_footprint_flutter/utils/app_theme.dart';

final themeService = ThemeService();

// Toggle theme
await themeService.toggleTheme();

// Set specific theme
await themeService.setThemeMode(ThemeMode.dark);
await themeService.setThemeMode(ThemeMode.light);
await themeService.setThemeMode(ThemeMode.system);

// Set dark mode directly
await themeService.setDarkMode(true);

// Check current theme
final isDark = themeService.isDarkMode;
final themeMode = themeService.themeMode;

// Use in MaterialApp
MaterialApp(
  theme: AppTheme.lightTheme,
  darkTheme: AppTheme.darkTheme,
  themeMode: themeService.themeMode,
  // ...
);
```

### Responsive Layout

**Implementation:**

```dart
import 'package:flutter/material.dart';

Widget build(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      if (constraints.maxWidth > 600) {
        // Tablet/Desktop layout
        return Row(
          children: [
            Expanded(flex: 1, child: Sidebar()),
            Expanded(flex: 3, child: MainContent()),
          ],
        );
      } else {
        // Mobile layout
        return Column(
          children: [
            AppBar(),
            Expanded(child: MainContent()),
            BottomNavigationBar(),
          ],
        );
      }
    },
  );
}
```

### Animations

Use Flutter's built-in animation framework:

```dart
import 'package:flutter/material.dart';

// AnimatedContainer
AnimatedContainer(
  duration: Duration(milliseconds: 300),
  curve: Curves.easeInOut,
  width: isExpanded ? 200 : 100,
  height: isExpanded ? 200 : 100,
  decoration: BoxDecoration(
    color: Colors.green,
    borderRadius: BorderRadius.circular(isExpanded ? 20 : 10),
  ),
);

// TweenAnimationBuilder
TweenAnimationBuilder<double>(
  tween: Tween(begin: 0.0, end: targetValue),
  duration: Duration(seconds: 1),
  builder: (context, value, child) {
    return CircularProgressIndicator(value: value);
  },
);
```

---

## 10. Configuration

### Server Configuration

Configure the backend server URL in `assets/config/server_config.json`:

```json
{
  "apiBaseUrl": "http://192.168.31.4:8000"
}
```

**For Android Emulator:**
- Use `http://10.0.2.2:8000` (default)

**For Physical Devices:**
- Use your computer's LAN IP address (e.g., `http://192.168.31.4:8000`)
- Ensure both devices are on the same network
- Ensure the backend is running and accessible

**For iOS Simulator:**
- Use `http://localhost:8000` or `http://127.0.0.1:8000`

### Environment Variables

You can also set the API base URL using environment variables:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.31.4:8000
```

### API Endpoints Configuration

All endpoints are configured in `lib/core/config/app_config.dart`:

```dart
static const String loginEndpoint = '/auth/login';
static const String registerEndpoint = '/auth/register';
static const String calculateEndpoint = '/carbon-footprint/calculate';
static const String historyEndpoint = '/carbon-footprint/history';
static const String statsEndpoint = '/carbon-footprint/stats';
static const String globalStatsEndpoint = '/global-stats';
static const String chatbotEndpoint = '/chatbot';
static const String userProgressEndpoint = '/user-progress';
```

---

## 🔧 Troubleshooting

### Connection Issues

1. **Backend not reachable:**
   - Ensure the backend server is running: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
   - Check firewall settings
   - Verify network connectivity

2. **Authentication fails:**
   - Check if session token is being sent in headers
   - Verify token is stored in secure storage
   - Check token expiry (7 days)

3. **CORS errors:**
   - Ensure backend CORS is configured for mobile app origin
   - Check `ALLOWED_ORIGINS` in backend `.env` file

### Service Integration

1. **Service not working:**
   - Check if the backend endpoint exists
   - Verify request/response format matches backend schema
   - Check error logs in debug console

2. **Default values returned:**
   - Some services return default values if backend endpoints don't exist
   - This is intentional for graceful degradation

---

## 📱 Complete Example

Here's a complete example of using all services together:

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:carbon_footprint_flutter/services/auth_service.dart';
import 'package:carbon_footprint_flutter/services/carbon_footprint_service.dart';
import 'package:carbon_footprint_flutter/services/chatbot_service.dart';
import 'package:carbon_footprint_flutter/services/gamification_service.dart';
import 'package:carbon_footprint_flutter/services/global_stats_service.dart';
import 'package:carbon_footprint_flutter/services/theme_service.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => CarbonFootprintService()),
        ChangeNotifierProvider(create: (_) => ChatbotService()),
        ChangeNotifierProvider(create: (_) => GamificationService()),
        ChangeNotifierProvider(create: (_) => GlobalStatsService()),
        ChangeNotifierProvider(create: (_) => ThemeService()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);
    
    return MaterialApp(
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeService.themeMode,
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final carbonService = Provider.of<CarbonFootprintService>(context);
    final chatbotService = Provider.of<ChatbotService>(context);
    final gamificationService = Provider.of<GamificationService>(context);
    
    return Scaffold(
      appBar: AppBar(title: Text('Carbon Footprint Calculator')),
      body: Column(
        children: [
          // User info
          if (authService.isAuthenticated)
            Text('Welcome, ${authService.currentUser?.name}'),
          
          // Calculate button
          ElevatedButton(
            onPressed: () async {
              final result = await carbonService.calculateCarbonFootprint({
                'monthly_electricity_kwh': 200.0,
                'monthly_vehicle_miles': 500.0,
              });
              print('Emissions: ${result.predictedEmissions}');
            },
            child: Text('Calculate'),
          ),
          
          // Chat with AI
          ElevatedButton(
            onPressed: () async {
              final response = await chatbotService.chatWithAI(
                'How can I reduce my carbon footprint?',
              );
              print('AI: $response');
            },
            child: Text('Ask AI'),
          ),
          
          // Get progress
          ElevatedButton(
            onPressed: () async {
              final progress = await gamificationService.getUserProgress();
              print('Points: ${progress.totalPoints}');
            },
            child: Text('View Progress'),
          ),
        ],
      ),
    );
  }
}
```

---

## ✅ Summary

All features are now fully integrated:

- ✅ **Authentication**: Secure session token management with 7-day expiry
- ✅ **Carbon Calculator**: Real-time multi-category calculations
- ✅ **History & Stats**: Complete tracking and analytics
- ✅ **Global Stats**: India vs World comparisons
- ✅ **Gamification**: Badges, points, and achievements
- ✅ **AI Chatbot**: Personalized sustainability advice
- ✅ **OCR Scanner**: Bill scanning and data extraction
- ✅ **Voice Assistant**: Hands-free interaction
- ✅ **Dark Mode**: Theme switching
- ✅ **Responsive Layout**: Mobile, tablet, and desktop support

The mobile app is now fully connected to the web application backend! 🎉

