#!/usr/bin/env python3
"""
Install missing dependencies for the model comparison system
"""

import subprocess
import sys
import os

def install_package(package_name):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
        print(f"✅ {package_name} installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package_name}: {e}")
        return False

def check_package(package_name):
    """Check if a package is available"""
    try:
        __import__(package_name)
        print(f"✅ {package_name} is already available")
        return True
    except ImportError:
        print(f"⚠️ {package_name} not found")
        return False

def main():
    """Install missing dependencies"""
    print("🔧 Installing Dependencies for Model Comparison System")
    print("=" * 60)
    
    # List of required packages
    packages = [
        ("lightgbm", "LightGBM for gradient boosting"),
        ("xgboost", "XGBoost for gradient boosting"),
        ("scikit-learn", "Scikit-learn for machine learning"),
        ("pandas", "Pandas for data manipulation"),
        ("numpy", "NumPy for numerical computing"),
        ("matplotlib", "Matplotlib for visualization"),
        ("seaborn", "Seaborn for statistical visualization"),
        ("joblib", "Joblib for model serialization")
    ]
    
    print("Checking and installing required packages...")
    print("-" * 40)
    
    all_installed = True
    
    for package, description in packages:
        print(f"\n📦 {package} - {description}")
        if not check_package(package):
            if not install_package(package):
                all_installed = False
    
    print("\n" + "=" * 60)
    if all_installed:
        print("🎉 All dependencies installed successfully!")
        print("You can now run the model comparison system:")
        print("  python run_model_comparison.py")
        print("  python train_v3_minimal_updated.py")
    else:
        print("⚠️ Some dependencies failed to install.")
        print("You can still use the fast training mode:")
        print("  python train_v3_minimal_updated.py")
        print("  (Choose option 1 for fast training)")

if __name__ == "__main__":
    main()
