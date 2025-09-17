import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib
import os
from train_with_comparison import CarbonEmissionModelComparator

class V3CarbonEmissionTrainerMinimal:
    """
    Ultra-Minimal V3 Training - Train Random Forest in under 10 seconds
    Now includes option for full model comparison
    """
    
    def __init__(self, use_comparison: bool = False):
        self.model = None
        self.score = 0
        self.use_comparison = use_comparison
        self.comparator = None
        
    def load_and_train(self, data_path: str = "../../../data/processed/v3_processed_carbon_data.csv"):
        """Load data and train model in one go"""
        if self.use_comparison:
            print("🔬 Running full model comparison...")
            self.comparator = CarbonEmissionModelComparator(data_path)
            results = self.comparator.run_complete_comparison()
            
            self.model = results['best_model']
            self.score = results['best_score']
            self.best_model_name = results['best_model_name']
            
            print(f"🏆 Best model selected: {self.best_model_name}")
            print(f"🎯 Best R² Score: {self.score:.4f}")
            return self.score
        else:
            print("⚡ Loading data and training Random Forest...")
            
            # Load data
            df = pd.read_csv(data_path)
            print(f"✅ Data loaded: {df.shape}")
            
            # Separate features and target
            X = df.drop(columns=['total_carbon_footprint'])
            y = df['total_carbon_footprint']
            
            # Use minimal data for speed (first 5000 samples)
            if len(X) > 5000:
                X = X.iloc[:5000]
                y = y.iloc[:5000]
                print(f"⚡ Using first 5000 samples for speed")
            
            # Train Random Forest with minimal parameters
            model = RandomForestRegressor(
                n_estimators=50,    # Very small for speed
                max_depth=10,        # Very small for speed
                random_state=42,
                n_jobs=-1           # Use all CPU cores
            )
            
            # Train on 80% of data, test on 20%
            split_idx = int(len(X) * 0.8)
            X_train, X_test = X[:split_idx], X[split_idx:]
            y_train, y_test = y[:split_idx], y[split_idx:]
            
            print(f"⚡ Training on {len(X_train)} samples...")
            model.fit(X_train, y_train)
            
            # Quick test
            y_pred = model.predict(X_test)
            r2 = r2_score(y_test, y_pred)
            
            self.model = model
            self.score = r2
            
            print(f"🎯 R² Score: {r2:.4f}")
            return r2
    
    def save_model(self, save_path: str = 'models/v3_carbon_emission_model_minimal.pkl'):
        """Save the trained model"""
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        if self.use_comparison and self.comparator:
            # Use the best model from comparison
            model_data = {
                'model': self.model,
                'score': self.score,
                'model_name': self.best_model_name,
                'comparison_results': self.comparator.results,
                'is_best_model': True
            }
        else:
            # Use minimal model
            model_data = {
                'model': self.model,
                'score': self.score,
                'model_name': 'Random Forest (Minimal)',
                'is_best_model': False
            }
        
        joblib.dump(model_data, save_path)
        print(f"💾 Model saved to: {save_path}")
        return save_path

def main():
    """Main function - ultra-fast training"""
    print("⚡ Starting ULTRA-MINIMAL V3 Training")
    print("=" * 50)
    
    # Initialize trainer
    trainer = V3CarbonEmissionTrainerMinimal()
    
    # Train model
    score = trainer.load_and_train()
    
    # Save model
    model_path = trainer.save_model()
    
    print("\n" + "=" * 50)
    print(f"🎯 Training Complete in under 10 seconds!")
    print(f"�� R² Score: {score:.4f}")
    print(f"💾 Model saved to: {model_path}")
    
    if score >= 0.95:
        print("🎉 High accuracy achieved!")

if __name__ == "__main__":
    main()
