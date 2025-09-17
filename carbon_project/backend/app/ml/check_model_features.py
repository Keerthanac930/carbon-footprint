import joblib
import os

def check_model_features():
    """Check what features the trained model expects"""
    model_path = "models/v3_carbon_emission_model_minimal.pkl"
    
    if not os.path.exists(model_path):
        print(f"❌ Model not found: {model_path}")
        return
    
    # Load the model
    model_data = joblib.load(model_path)
    model = model_data['model']
    
    print("🔍 Checking Model Features...")
    print("=" * 50)
    
    # Check if model has feature names
    if hasattr(model, 'feature_names_in_'):
        print(f"✅ Model expects {len(model.feature_names_in_)} features:")
        for i, feature in enumerate(model.feature_names_in_):
            print(f"  {i+1:2d}. {feature}")
    else:
        print("⚠️  Model doesn't have feature names stored")
        
        # Try to get from training data
        if 'feature_names' in model_data:
            feature_names = model_data['feature_names']
            if feature_names:
                print(f"✅ Found {len(feature_names)} features in model data:")
                for i, feature in enumerate(feature_names):
                    print(f"  {i+1:2d}. {feature}")
            else:
                print("❌ No feature names found in model data")
        else:
            print("❌ No feature names found in model data")
    
    print(f"\n🎯 Model Score: {model_data.get('score', 'Unknown')}")
    print(f"🏷️  Model Name: {model_data.get('model_name', 'Unknown')}")

if __name__ == "__main__":
    check_model_features()
