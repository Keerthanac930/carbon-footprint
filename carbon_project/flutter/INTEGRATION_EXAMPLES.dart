// Integration Examples for Mobile App & Web Application
// This file contains practical examples of using all integrated features

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';

// Import services
import 'lib/services/auth_service.dart';
import 'lib/services/carbon_footprint_service.dart';
import 'lib/services/chatbot_service.dart';
import 'lib/services/gamification_service.dart';
import 'lib/services/global_stats_service.dart';
import 'lib/services/ocr_service.dart';
import 'lib/services/voice_service.dart';
import 'lib/services/theme_service.dart';
import 'lib/utils/app_theme.dart';

// ============================================================================
// 1. AUTHENTICATION EXAMPLES
// ============================================================================

class AuthenticationExamples {
  static Future<void> registerUser(AuthService authService) async {
    try {
      await authService.register(
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword123',
      );
      print('Registration successful!');
    } catch (e) {
      print('Registration failed: $e');
    }
  }

  static Future<void> loginUser(AuthService authService) async {
    try {
      await authService.login(
        email: 'john@example.com',
        password: 'securepassword123',
      );
      print('Login successful!');
      print('User: ${authService.currentUser?.name}');
      print('Email: ${authService.currentUser?.email}');
    } catch (e) {
      print('Login failed: $e');
    }
  }

  static Future<void> checkAuthStatus(AuthService authService) async {
    final isAuthenticated = await authService.checkAuthStatus();
    if (isAuthenticated) {
      print('User is authenticated');
      print('Session Token: ${authService.sessionToken}');
    } else {
      print('User is not authenticated');
    }
  }

  static Future<void> logoutUser(AuthService authService) async {
    await authService.logout(notifyServer: true);
    print('Logged out successfully');
  }
}

// ============================================================================
// 2. CARBON FOOTPRINT CALCULATION EXAMPLES
// ============================================================================

class CarbonFootprintExamples {
  static Future<void> calculateFootprint(
    CarbonFootprintService carbonService,
  ) async {
    try {
      final calculation = await carbonService.calculateCarbonFootprint({
        // Energy
        'monthly_electricity_kwh': 200.0,
        'monthly_gas_therms': 50.0,
        'monthly_heating_oil_gallons': 0.0,

        // Transportation
        'monthly_vehicle_miles': 500.0,
        'vehicle_fuel_efficiency_mpg': 25.0,
        'monthly_flight_hours': 2.0,
        'monthly_public_transit_miles': 100.0,

        // Food & Lifestyle
        'monthly_grocery_bill': 300.0,
        'diet_type': 'omnivore', // 'vegan', 'vegetarian', 'omnivore'
        'waste_recycling_percentage': 50.0,

        // Housing
        'household_size': 2,
        'home_size_sqft': 1500.0,
      });

      print('Calculation Results:');
      print('Total Emissions: ${calculation.predictedEmissions} tons CO2/year');
      print('Confidence Score: ${calculation.confidenceScore}');
      print('Breakdown: ${calculation.breakdown}');
      print('Recommendations: ${calculation.recommendations.length}');
    } catch (e) {
      print('Calculation failed: $e');
    }
  }

  static Future<void> getHistory(CarbonFootprintService carbonService) async {
    try {
      final history = await carbonService.getCalculationHistory(
        page: 0,
        limit: 20,
      );

      print('Calculation History (${history.length} items):');
      history.forEach((calculation) {
        print(
          '- ${calculation.predictedEmissions} tons on ${calculation.createdAt}',
        );
      });
    } catch (e) {
      print('Failed to fetch history: $e');
    }
  }

  static Future<void> getUserStats(CarbonFootprintService carbonService) async {
    try {
      final stats = await carbonService.getUserStats();

      print('User Statistics:');
      print('Total Calculations: ${stats['total_calculations']}');
      print('Average Emissions: ${stats['average_emissions']} tons');
      print('Min Emissions: ${stats['min_emissions']} tons');
      print('Max Emissions: ${stats['max_emissions']} tons');
    } catch (e) {
      print('Failed to fetch stats: $e');
    }
  }

  static Future<void> getTrends(CarbonFootprintService carbonService) async {
    try {
      final trends = await carbonService.getEmissionTrends(days: 30);

      print('Emission Trends (last 30 days):');
      trends.forEach((trend) {
        print('${trend['date']}: ${trend['emissions']} tons');
      });
    } catch (e) {
      print('Failed to fetch trends: $e');
    }
  }
}

// ============================================================================
// 3. GLOBAL STATS EXAMPLES
// ============================================================================

class GlobalStatsExamples {
  static Future<void> getGlobalStats(GlobalStatsService globalStatsService) async {
    try {
      final stats = await globalStatsService.getGlobalStats();

      print('Global Statistics:');
      print('Global Average: ${stats.globalAverageEmissions} tons CO2/year');
      print('India Average: ${stats.indiaAverageEmissions} tons CO2/year');
      print('World Average: ${stats.worldAverageEmissions} tons CO2/year');

      print('\nRegional Comparisons:');
      stats.regionalComparisons.forEach((region, emissions) {
        print('$region: $emissions tons CO2/year');
      });

      print('\nCategory Breakdown:');
      stats.categoryBreakdown.forEach((category, percentage) {
        print('$category: ${(percentage * 100).toStringAsFixed(1)}%');
      });
    } catch (e) {
      print('Failed to fetch global stats: $e');
    }
  }
}

// ============================================================================
// 4. GAMIFICATION EXAMPLES
// ============================================================================

class GamificationExamples {
  static Future<void> getUserProgress(
    GamificationService gamificationService,
  ) async {
    try {
      final progress = await gamificationService.getUserProgress();

      print('User Progress:');
      print('Total Points: ${progress.totalPoints}');
      print('Current Level: ${progress.currentLevel}');
      print('Current Streak: ${progress.currentStreak} days');
      print('Longest Streak: ${progress.longestStreak} days');
      print('Badges: ${progress.badges}');
      print('Calculations: ${progress.calculationsCount}');
      print('Emissions Reduced: ${progress.totalEmissionsReduced} tons');

      // Get suggested badges
      final suggestedBadges =
          gamificationService.getSuggestedBadges(progress);
      if (suggestedBadges.isNotEmpty) {
        print('\nSuggested Badges:');
        suggestedBadges.forEach((badge) => print('- $badge'));
      }
    } catch (e) {
      print('Failed to fetch progress: $e');
    }
  }

  static void calculatePoints(GamificationService gamificationService) {
    final points = gamificationService.calculatePoints(
      calculationsCount: 10,
      emissionsReduced: 2.5,
      streakDays: 7,
    );

    final level = gamificationService.calculateLevel(points);

    print('Calculated Points: $points');
    print('Calculated Level: $level');
  }
}

// ============================================================================
// 5. AI CHATBOT EXAMPLES
// ============================================================================

class ChatbotExamples {
  static Future<void> chatWithAI(ChatbotService chatbotService) async {
    try {
      // Ask a question
      final response = await chatbotService.chatWithAI(
        'How can I reduce my carbon footprint?',
      );

      print('AI Response: $response');

      // View chat history
      final messages = chatbotService.messages;
      print('\nChat History:');
      messages.forEach((message) {
        print('${message.isUser ? "User" : "AI"}: ${message.text}');
        print('Time: ${message.timestamp}');
      });
    } catch (e) {
      print('Chatbot error: $e');
    }
  }

  static void clearChat(ChatbotService chatbotService) {
    chatbotService.clearMessages();
    print('Chat history cleared');
  }
}

// ============================================================================
// 6. OCR BILL SCANNER EXAMPLES
// ============================================================================

class OCRExamples {
  static Future<void> scanBill(OCRService ocrService) async {
    try {
      // Scan from camera
      final analysis = await ocrService.scanAndCalculate(ImageSource.camera);

      print('Bill Analysis:');
      print('Electricity kWh: ${analysis['electricity_kwh']}');
      print('Gas Usage: ${analysis['gas_usage']}');
      print('Total Amount: \$${analysis['total_amount']}');
      print('Items: ${analysis['items']}');
    } catch (e) {
      print('OCR scan failed: $e');
    }
  }

  static Future<void> scanFromGallery(OCRService ocrService) async {
    try {
      // Scan from gallery
      final extractedText = await ocrService.scanBill(ImageSource.gallery);
      print('Extracted Text:\n$extractedText');

      // Analyze the text
      final analysis = await ocrService.analyzeBillText(extractedText);
      print('\nAnalysis: $analysis');
    } catch (e) {
      print('OCR scan failed: $e');
    }
  }
}

// ============================================================================
// 7. VOICE ASSISTANT EXAMPLES
// ============================================================================

class VoiceExamples {
  static Future<void> initializeVoice(VoiceService voiceService) async {
    final isAvailable = await voiceService.initialize();
    if (isAvailable) {
      print('Voice recognition is available');
    } else {
      print('Voice recognition is not available');
    }
  }

  static Future<void> listenAndProcess(VoiceService voiceService) async {
    await voiceService.startListening(
      onResult: (recognizedText) {
        print('Recognized: $recognizedText');

        // Process with AI
        voiceService.processVoiceInput(recognizedText).then((response) {
          print('AI Response: $response');
        });
      },
      onError: (error) {
        print('Voice recognition error: $error');
      },
    );
  }

  static Future<void> completeInteraction(VoiceService voiceService) async {
    final response = await voiceService.completeVoiceInteraction(
      onListening: (text) {
        print('Listening: $text');
      },
      onProcessing: (message) {
        print(message);
      },
      onError: (error) {
        print('Error: $error');
      },
    );

    print('Final Response: $response');
  }
}

// ============================================================================
// 8. THEME EXAMPLES
// ============================================================================

class ThemeExamples {
  static Future<void> toggleTheme(ThemeService themeService) async {
    await themeService.toggleTheme();
    print('Theme toggled. Dark mode: ${themeService.isDarkMode}');
  }

  static Future<void> setDarkMode(ThemeService themeService) async {
    await themeService.setDarkMode(true);
    print('Dark mode enabled');
  }

  static Future<void> setLightMode(ThemeService themeService) async {
    await themeService.setDarkMode(false);
    print('Light mode enabled');
  }
}

// ============================================================================
// 9. COMPLETE INTEGRATION EXAMPLE WIDGET
// ============================================================================

class CompleteIntegrationExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => CarbonFootprintService()),
        ChangeNotifierProvider(create: (_) => ChatbotService()),
        ChangeNotifierProvider(create: (_) => GamificationService()),
        ChangeNotifierProvider(create: (_) => GlobalStatsService()),
        ChangeNotifierProvider(create: (_) => OCRService()),
        ChangeNotifierProvider(create: (_) => VoiceService()),
        ChangeNotifierProvider(create: (_) => ThemeService()),
      ],
      child: Consumer<ThemeService>(
        builder: (context, themeService, _) {
          return MaterialApp(
            title: 'Carbon Footprint Calculator',
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeService.themeMode,
            home: IntegrationDemoScreen(),
          );
        },
      ),
    );
  }
}

class IntegrationDemoScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final carbonService = Provider.of<CarbonFootprintService>(context);
    final chatbotService = Provider.of<ChatbotService>(context);
    final gamificationService = Provider.of<GamificationService>(context);
    final globalStatsService = Provider.of<GlobalStatsService>(context);
    final ocrService = Provider.of<OCRService>(context);
    final voiceService = Provider.of<VoiceService>(context);
    final themeService = Provider.of<ThemeService>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Integration Demo'),
        actions: [
          IconButton(
            icon: Icon(themeService.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            onPressed: () => ThemeExamples.toggleTheme(themeService),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Authentication Section
            _buildSection(
              title: 'Authentication',
              children: [
                ElevatedButton(
                  onPressed: () => AuthenticationExamples.loginUser(authService),
                  child: Text('Login'),
                ),
                ElevatedButton(
                  onPressed: () => AuthenticationExamples.checkAuthStatus(authService),
                  child: Text('Check Auth Status'),
                ),
                ElevatedButton(
                  onPressed: () => AuthenticationExamples.logoutUser(authService),
                  child: Text('Logout'),
                ),
              ],
            ),

            SizedBox(height: 16),

            // Carbon Footprint Section
            _buildSection(
              title: 'Carbon Footprint',
              children: [
                ElevatedButton(
                  onPressed: () => CarbonFootprintExamples.calculateFootprint(carbonService),
                  child: Text('Calculate'),
                ),
                ElevatedButton(
                  onPressed: () => CarbonFootprintExamples.getHistory(carbonService),
                  child: Text('Get History'),
                ),
                ElevatedButton(
                  onPressed: () => CarbonFootprintExamples.getUserStats(carbonService),
                  child: Text('Get Stats'),
                ),
              ],
            ),

            SizedBox(height: 16),

            // Global Stats Section
            _buildSection(
              title: 'Global Stats',
              children: [
                ElevatedButton(
                  onPressed: () => GlobalStatsExamples.getGlobalStats(globalStatsService),
                  child: Text('Get Global Stats'),
                ),
              ],
            ),

            SizedBox(height: 16),

            // Gamification Section
            _buildSection(
              title: 'Gamification',
              children: [
                ElevatedButton(
                  onPressed: () => GamificationExamples.getUserProgress(gamificationService),
                  child: Text('Get Progress'),
                ),
              ],
            ),

            SizedBox(height: 16),

            // Chatbot Section
            _buildSection(
              title: 'AI Chatbot',
              children: [
                ElevatedButton(
                  onPressed: () => ChatbotExamples.chatWithAI(chatbotService),
                  child: Text('Ask AI'),
                ),
              ],
            ),

            SizedBox(height: 16),

            // OCR Section
            _buildSection(
              title: 'OCR Scanner',
              children: [
                ElevatedButton(
                  onPressed: () => OCRExamples.scanBill(ocrService),
                  child: Text('Scan Bill (Camera)'),
                ),
                ElevatedButton(
                  onPressed: () => OCRExamples.scanFromGallery(ocrService),
                  child: Text('Scan Bill (Gallery)'),
                ),
              ],
            ),

            SizedBox(height: 16),

            // Voice Section
            _buildSection(
              title: 'Voice Assistant',
              children: [
                ElevatedButton(
                  onPressed: () => VoiceExamples.listenAndProcess(voiceService),
                  child: Text('Listen & Process'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required List<Widget> children,
  }) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            ...children,
          ],
        ),
      ),
    );
  }
}

