// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:carbon_footprint_flutter/main.dart';
import 'package:carbon_footprint_flutter/services/auth_service.dart';
import 'package:carbon_footprint_flutter/services/api_service.dart';
import 'package:carbon_footprint_flutter/services/carbon_footprint_service.dart';
import 'package:carbon_footprint_flutter/services/chatbot_service.dart';
import 'package:carbon_footprint_flutter/services/gamification_service.dart';
import 'package:carbon_footprint_flutter/services/global_stats_service.dart';
import 'package:carbon_footprint_flutter/services/marketplace_service.dart';
import 'package:carbon_footprint_flutter/services/ocr_service.dart';
import 'package:carbon_footprint_flutter/services/voice_service.dart';
import 'package:carbon_footprint_flutter/services/theme_service.dart';

void main() {
  testWidgets('App launches successfully', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthService()),
          ChangeNotifierProvider(create: (_) => ApiService()),
          ChangeNotifierProvider(create: (_) => CarbonFootprintService()),
          ChangeNotifierProvider(create: (_) => ChatbotService()),
          ChangeNotifierProvider(create: (_) => GamificationService()),
          ChangeNotifierProvider(create: (_) => GlobalStatsService()),
          ChangeNotifierProvider(create: (_) => MarketplaceService()),
          ChangeNotifierProvider(create: (_) => OCRService()),
          ChangeNotifierProvider(create: (_) => VoiceService()),
          ChangeNotifierProvider(create: (_) => ThemeService()),
        ],
        child: const CarbonFootprintApp(),
      ),
    );

    // Wait for the app to initialize
    await tester.pumpAndSettle();

    // Verify that the app has launched (splash screen or login screen should be visible)
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
