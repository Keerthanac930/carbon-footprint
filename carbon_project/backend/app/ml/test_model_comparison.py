#!/usr/bin/env python3
"""
Test script to verify the model comparison system works correctly
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all required imports work"""
    print("🧪 Testing Imports...")
    
    try:
        import pandas as pd
        print("✅ pandas imported successfully")
    except ImportError as e:
        print(f"❌ pandas import failed: {e}")
        return False
    
    try:
        import numpy as np
        print("✅ numpy imported successfully")
    except ImportError as e:
        print(f"❌ numpy import failed: {e}")
        return False
    
    try:
        from sklearn.ensemble import RandomForestRegressor
        print("✅ scikit-learn imported successfully")
    except ImportError as e:
        print(f"❌ scikit-learn import failed: {e}")
        return False
    
    try:
        import xgboost as xgb
        print("✅ xgboost imported successfully")
    except ImportError as e:
        print(f"❌ xgboost import failed: {e}")
        return False
    
    try:
        import lightgbm as lgb
        print("✅ lightgbm imported successfully")
    except ImportError as e:
        print(f"⚠️ lightgbm not available (optional)")
    
    try:
        import matplotlib.pyplot as plt
        print("✅ matplotlib imported successfully")
    except ImportError as e:
        print(f"❌ matplotlib import failed: {e}")
        return False
    
    return True

def test_model_comparison():
    """Test if the model comparison class can be imported"""
    print("\n🧪 Testing Model Comparison Class...")
    
    try:
        from train_with_comparison import CarbonEmissionModelComparator
        print("✅ CarbonEmissionModelComparator imported successfully")
        
        # Test initialization
        comparator = CarbonEmissionModelComparator()
        print("✅ CarbonEmissionModelComparator initialized successfully")
        
        return True
    except ImportError as e:
        print(f"❌ Model comparison import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Model comparison initialization failed: {e}")
        return False

def test_data_availability():
    """Test if the required data file exists"""
    print("\n🧪 Testing Data Availability...")
    
    data_path = "../../../data/processed/v3_processed_carbon_data.csv"
    
    if os.path.exists(data_path):
        print(f"✅ Data file found: {data_path}")
        
        # Check file size
        file_size = os.path.getsize(data_path)
        print(f"📊 File size: {file_size / (1024*1024):.2f} MB")
        
        return True
    else:
        print(f"❌ Data file not found: {data_path}")
        print("Please ensure the processed data exists before running model comparison")
        return False

def test_fast_training():
    """Test if fast training works"""
    print("\n🧪 Testing Fast Training...")
    
    try:
        from train_v3_minimal_updated import V3CarbonEmissionTrainerMinimal
        print("✅ V3CarbonEmissionTrainerMinimal imported successfully")
        
        # Test initialization
        trainer = V3CarbonEmissionTrainerMinimal(use_comparison=False)
        print("✅ V3CarbonEmissionTrainerMinimal initialized successfully")
        
        return True
    except ImportError as e:
        print(f"❌ Fast training import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Fast training initialization failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🔬 Model Comparison System Test Suite")
    print("=" * 50)
    
    tests = [
        ("Import Test", test_imports),
        ("Model Comparison Test", test_model_comparison),
        ("Data Availability Test", test_data_availability),
        ("Fast Training Test", test_fast_training)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:<25} {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! The system is ready to use.")
        print("\nYou can now run:")
        print("  python run_model_comparison.py")
        print("  python train_v3_minimal_updated.py")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please check the errors above.")
        print("\nTo fix dependency issues, run:")
        print("  python install_dependencies.py")

if __name__ == "__main__":
    main()
