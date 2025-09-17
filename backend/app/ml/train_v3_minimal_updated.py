import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV, KFold
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import joblib
import os
import warnings
warnings.filterwarnings('ignore')
try:
    from train_with_comparison import CarbonEmissionModelComparator
    COMPARISON_AVAILABLE = True
except ImportError as e:
    COMPARISON_AVAILABLE = False
    print(f"⚠️ Model comparison not available: {e}")

class V3CarbonEmissionTrainerMinimal:
    """
    Enhanced V3 Training - Random Forest with Cross-Validation and Hyperparameter Tuning
    Now includes comprehensive model optimization and evaluation
    """
    
    def __init__(self, use_comparison: bool = False, enable_tuning: bool = True):
        self.model = None
        self.score = 0
        self.use_comparison = use_comparison
        self.comparator = None
        self.enable_tuning = enable_tuning
        self.best_params = None
        self.cv_scores = None
        self.feature_names = None
        
    def load_and_train(self, data_path: str = "../../../data/processed/v3_processed_carbon_data.csv"):
        """Load data and train model in one go"""
        if self.use_comparison:
            if not COMPARISON_AVAILABLE:
                print("❌ Model comparison not available. Falling back to fast training...")
                self.use_comparison = False
            else:
                print("🔬 Running full model comparison...")
                self.comparator = CarbonEmissionModelComparator(data_path)
                results = self.comparator.run_complete_comparison()
                
                self.model = results['best_model']
                self.score = results['best_score']
                self.best_model_name = results['best_model_name']
                
                print(f"🏆 Best model selected: {self.best_model_name}")
                print(f"🎯 Best R² Score: {self.score:.4f}")
                return self.score
        
        if not self.use_comparison:
            print("🚀 Loading data and training Random Forest with Cross-Validation and Hyperparameter Tuning...")
            
            # Load data
            df = pd.read_csv(data_path)
            print(f"✅ Data loaded: {df.shape}")
            
            # Separate features and target
            X = df.drop(columns=['total_carbon_footprint'])
            y = df['total_carbon_footprint']
            self.feature_names = list(X.columns)
            
            # Handle missing values
            X = X.fillna(X.median())
            y = y.fillna(y.median())
            
            # Use more data for better tuning (first 10000 samples for speed)
            if len(X) > 10000:
                X = X.iloc[:10000]
                y = y.iloc[:10000]
                print(f"⚡ Using first 10000 samples for comprehensive training")
            
            # Proper train-test split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            print(f"📊 Training set: {X_train.shape}")
            print(f"📊 Test set: {X_test.shape}")
            
            if self.enable_tuning:
                # Perform hyperparameter tuning
                tuned_model, test_r2 = self.hyperparameter_tuning(X_train, y_train, X_test, y_test)
                self.model = tuned_model
                self.score = test_r2
                
                # Comprehensive evaluation
                eval_results = self.comprehensive_evaluation(tuned_model, X_test, y_test)
                
                return test_r2
            else:
                # Use default parameters with cross-validation
                print("🔄 Training Random Forest with default parameters and cross-validation...")
                
                model = RandomForestRegressor(
                    n_estimators=200,
                    max_depth=15,
                    min_samples_split=5,
                    min_samples_leaf=2,
                    random_state=42,
                    n_jobs=-1
                )
                
                # Perform cross-validation
                print("🔄 Performing 5-fold cross-validation...")
                cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
                print(f"📊 CV Scores: {cv_scores}")
                print(f"📊 CV Mean: {cv_scores.mean():.4f} (±{cv_scores.std() * 2:.4f})")
                
                # Train on full training set
                model.fit(X_train, y_train)
                
                # Evaluate on test set
                y_pred = model.predict(X_test)
                test_r2 = r2_score(y_test, y_pred)
                
                self.model = model
                self.score = test_r2
                self.cv_scores = cv_scores
                
                # Comprehensive evaluation
                eval_results = self.comprehensive_evaluation(model, X_test, y_test)
                
                print(f"🎯 Final Test R² Score: {test_r2:.4f}")
                return test_r2
    
    def hyperparameter_tuning(self, X_train, y_train, X_test, y_test):
        """Perform hyperparameter tuning for Random Forest with cross-validation"""
        if not self.enable_tuning:
            print("⏭️ Hyperparameter tuning disabled, using default parameters")
            return None
            
        print("🔍 Performing hyperparameter tuning for Random Forest...")
        
        # Define parameter grid for Random Forest
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 15, 20, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4],
            'max_features': ['sqrt', 'log2', None],
            'bootstrap': [True, False]
        }
        
        # Create base Random Forest model
        rf_base = RandomForestRegressor(random_state=42, n_jobs=-1)
        
        # Perform GridSearchCV with 5-fold cross-validation
        print("🔄 Running GridSearchCV with 5-fold cross-validation...")
        grid_search = GridSearchCV(
            estimator=rf_base,
            param_grid=param_grid,
            cv=5,
            scoring='r2',
            n_jobs=-1,
            verbose=1
        )
        
        # Fit the grid search
        grid_search.fit(X_train, y_train)
        
        # Get best parameters and model
        self.best_params = grid_search.best_params_
        best_model = grid_search.best_estimator_
        
        # Evaluate on test set
        y_pred = best_model.predict(X_test)
        test_r2 = r2_score(y_test, y_pred)
        
        # Perform cross-validation on best model
        cv_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='r2')
        
        print(f"✅ Hyperparameter tuning completed!")
        print(f"🏆 Best parameters: {self.best_params}")
        print(f"🎯 Best CV Score: {grid_search.best_score_:.4f}")
        print(f"🎯 Test R² Score: {test_r2:.4f}")
        print(f"📊 CV Scores: {cv_scores}")
        print(f"📊 CV Mean: {cv_scores.mean():.4f} (±{cv_scores.std() * 2:.4f})")
        
        self.cv_scores = cv_scores
        return best_model, test_r2
    
    def comprehensive_evaluation(self, model, X_test, y_test):
        """Perform comprehensive model evaluation"""
        print("📊 Performing comprehensive evaluation...")
        
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mape = mean_absolute_percentage_error(y_test, y_pred) * 100
        
        # Calculate additional metrics
        mse = mean_squared_error(y_test, y_pred)
        residuals = y_test - y_pred
        
        # Print evaluation results
        print(f"\n📈 EVALUATION RESULTS:")
        print(f"  R² Score: {r2:.4f}")
        print(f"  MAE: {mae:.2f}")
        print(f"  RMSE: {rmse:.2f}")
        print(f"  MAPE: {mape:.2f}%")
        print(f"  MSE: {mse:.2f}")
        print(f"  Mean Residual: {np.mean(residuals):.2f}")
        print(f"  Std Residual: {np.std(residuals):.2f}")
        
        return {
            'r2': r2,
            'mae': mae,
            'rmse': rmse,
            'mape': mape,
            'mse': mse,
            'residuals': residuals
        }
    
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
            # Use enhanced model with tuning results
            model_data = {
                'model': self.model,
                'score': self.score,
                'model_name': 'Random Forest (Enhanced with CV & Tuning)',
                'is_best_model': False,
                'best_params': self.best_params,
                'cv_scores': self.cv_scores,
                'feature_names': self.feature_names,
                'tuning_enabled': self.enable_tuning,
                'training_date': pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        
        joblib.dump(model_data, save_path)
        print(f"💾 Model saved to: {save_path}")
        return save_path

def main():
    """Main function - enhanced training with cross-validation and hyperparameter tuning"""
    print("🚀 Starting ENHANCED V3 Training with Cross-Validation & Hyperparameter Tuning")
    print("=" * 70)
    
    # Ask user for training options
    print("Choose training mode:")
    print("1. Enhanced Random Forest (with CV & hyperparameter tuning) - 2-5 minutes")
    print("2. Random Forest with CV only (no tuning) - 1-2 minutes")
    if COMPARISON_AVAILABLE:
        print("3. Full model comparison (11-12 models) - 3-8 minutes")
    else:
        print("3. Full model comparison - NOT AVAILABLE (missing dependencies)")
    
    try:
        choice = input("Enter choice (1, 2, or 3, default=1): ").strip()
        if choice == "2":
            use_comparison = False
            enable_tuning = False
        elif choice == "3" and COMPARISON_AVAILABLE:
            use_comparison = True
            enable_tuning = False
        else:
            use_comparison = False
            enable_tuning = True
    except:
        use_comparison = False
        enable_tuning = True
    
    if use_comparison:
        print("🔬 Running full model comparison...")
    elif enable_tuning:
        print("🔍 Running enhanced Random Forest with hyperparameter tuning...")
    else:
        print("🔄 Running Random Forest with cross-validation only...")
    
    # Initialize trainer
    trainer = V3CarbonEmissionTrainerMinimal(use_comparison=use_comparison, enable_tuning=enable_tuning)
    
    # Train model
    score = trainer.load_and_train()
    
    # Save model
    model_path = trainer.save_model()
    
    print("\n" + "=" * 70)
    if use_comparison:
        print(f"🎯 Model Comparison Complete!")
        print(f"🏆 Best Model: {trainer.best_model_name}")
        print(f"📊 Best R² Score: {score:.4f}")
    else:
        print(f"🎯 Enhanced Training Complete!")
        print(f"📊 Final R² Score: {score:.4f}")
        if trainer.cv_scores is not None:
            print(f"📊 Cross-Validation Mean: {trainer.cv_scores.mean():.4f} (±{trainer.cv_scores.std() * 2:.4f})")
        if trainer.best_params is not None:
            print(f"🏆 Best Parameters: {trainer.best_params}")
    
    print(f"💾 Model saved to: {model_path}")
    
    if score >= 0.95:
        print("🎉 High accuracy achieved!")
    elif score >= 0.90:
        print("✅ Good accuracy achieved!")
    else:
        print("⚠️ Consider further optimization or feature engineering")

if __name__ == "__main__":
    main()
