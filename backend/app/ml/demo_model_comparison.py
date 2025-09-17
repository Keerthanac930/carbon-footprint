#!/usr/bin/env python3
"""
Demo script showing the model comparison system in action
This script demonstrates how the system trains multiple models and selects the best one
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train_with_comparison import CarbonEmissionModelComparator
import time

def demo_model_comparison():
    """Demonstrate the model comparison system"""
    print("🔬 Carbon Emission Model Comparison Demo")
    print("=" * 60)
    print("This demo will show how the system:")
    print("1. Trains 12 different machine learning models")
    print("2. Evaluates each model using multiple metrics")
    print("3. Automatically selects the best performing model")
    print("4. Generates comprehensive reports and visualizations")
    print("=" * 60)
    
    # Check if data exists
    data_path = "../../../data/processed/v3_processed_carbon_data.csv"
    if not os.path.exists(data_path):
        print(f"❌ Data file not found: {data_path}")
        print("Please ensure the processed data exists before running the demo.")
        return
    
    print(f"✅ Data file found: {data_path}")
    
    # Initialize comparator
    print("\n🚀 Initializing Model Comparator...")
    comparator = CarbonEmissionModelComparator(data_path)
    
    # Record start time
    start_time = time.time()
    
    try:
        print("\n🔬 Starting Model Comparison...")
        print("This may take 2-5 minutes depending on your hardware...")
        
        # Run comparison
        results = comparator.run_complete_comparison()
        
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        
        print("\n" + "=" * 60)
        print("🎉 DEMO COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print(f"⏱️  Total Time: {elapsed_time:.1f} seconds")
        print(f"🏆 Best Model: {results['best_model_name']}")
        print(f"🎯 Best R² Score: {results['best_score']:.4f}")
        print(f"💾 Model saved: {results['model_path']}")
        print(f"📊 Comparison results: {results['comparison_path']}")
        print(f"📋 Detailed report: {results['report_path']}")
        print(f"📈 Visualization: ../../../reports/model_comparison_analysis.png")
        
        # Show model ranking
        print("\n📊 MODEL PERFORMANCE RANKING:")
        print("-" * 50)
        sorted_results = sorted(
            results['all_results'].items(), 
            key=lambda x: x[1]['test_r2'], 
            reverse=True
        )
        
        for rank, (model_name, model_results) in enumerate(sorted_results[:5], 1):
            print(f"{rank}. {model_name:<20} R²: {model_results['test_r2']:.4f}")
        
        print("\n🚀 The best model is now ready for production use!")
        print("You can use it in your carbon emission prediction system.")
        
    except Exception as e:
        print(f"❌ Error during demo: {e}")
        print("Please check the error message and try again.")

def show_model_details():
    """Show details about the models being compared"""
    print("\n📋 MODELS BEING COMPARED:")
    print("-" * 40)
    
    models = [
        ("Random Forest", "Ensemble of decision trees"),
        ("Extra Trees", "Extremely randomized trees"),
        ("Gradient Boosting", "Sequential ensemble learning"),
        ("XGBoost", "Extreme gradient boosting"),
        ("LightGBM", "Light gradient boosting machine"),
        ("Linear Regression", "Basic linear model"),
        ("Ridge Regression", "Linear with L2 regularization"),
        ("Lasso Regression", "Linear with L1 regularization"),
        ("Elastic Net", "Linear with L1 + L2 regularization"),
        ("SVR", "Support Vector Regression"),
        ("K-Neighbors", "K-nearest neighbors regression"),
        ("Decision Tree", "Single decision tree")
    ]
    
    for model_name, description in models:
        print(f"• {model_name:<20} - {description}")

def show_evaluation_metrics():
    """Show the evaluation metrics used"""
    print("\n📊 EVALUATION METRICS:")
    print("-" * 30)
    
    metrics = [
        ("R² Score", "Coefficient of determination (primary metric)"),
        ("Cross-Validation R²", "5-fold CV score for stability"),
        ("RMSE", "Root Mean Square Error"),
        ("MAE", "Mean Absolute Error"),
        ("MAPE", "Mean Absolute Percentage Error"),
        ("Overfitting Score", "Train R² - Test R² (lower is better)")
    ]
    
    for metric, description in metrics:
        print(f"• {metric:<20} - {description}")

def main():
    """Main demo function"""
    print("Welcome to the Carbon Emission Model Comparison Demo!")
    print("=" * 60)
    
    # Show model details
    show_model_details()
    
    # Show evaluation metrics
    show_evaluation_metrics()
    
    # Ask if user wants to run the demo
    print("\n" + "=" * 60)
    try:
        run_demo = input("Do you want to run the model comparison demo? (y/n, default=y): ").strip().lower()
        if run_demo in ['n', 'no']:
            print("Demo cancelled. You can run it later with: python demo_model_comparison.py")
            return
    except:
        pass
    
    # Run the demo
    demo_model_comparison()

if __name__ == "__main__":
    main()
