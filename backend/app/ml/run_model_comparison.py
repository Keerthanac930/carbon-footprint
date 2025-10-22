#!/usr/bin/env python3
"""
Simple script to run model comparison for carbon emission prediction
This script will train multiple models and automatically select the best one
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train_with_comparison import CarbonEmissionModelComparator

def main():
    """Run model comparison and selection"""
    print("🔬 Carbon Emission Model Comparison System")
    print("=" * 60)
    print("This will train 12 different models and select the best one.")
    print("Estimated time: 2-5 minutes")
    print("=" * 60)
    
    # Ask for confirmation
    try:
        confirm = input("Do you want to proceed? (y/n, default=y): ").strip().lower()
        if confirm in ['n', 'no']:
            print("❌ Model comparison cancelled.")
            return
    except:
        pass
    
    # Initialize and run comparison
    comparator = CarbonEmissionModelComparator()
    
    try:
        results = comparator.run_complete_comparison()
        
        print("\n" + "=" * 60)
        print("🎉 MODEL COMPARISON COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print(f"🏆 Best Model: {results['best_model_name']}")
        print(f"🎯 Best R² Score: {results['best_score']:.4f}")
        print(f"💾 Model saved: {results['model_path']}")
        print(f"📊 Comparison results: {results['comparison_path']}")
        print(f"📋 Detailed report: {results['report_path']}")
        print(f"📈 Visualization: ../../../reports/model_comparison_analysis.png")
        
        print("\n🚀 The best model is now ready for production use!")
        
    except Exception as e:
        print(f"❌ Error during model comparison: {e}")
        print("Please check the error message and try again.")

if __name__ == "__main__":
    main()
