import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.svm import SVR
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

class CarbonEmissionTrainer:
    """
    Enhanced training pipeline for carbon emission prediction with new factors
    Target: R² > 0.95 with 45+ features
    """
    
    def __init__(self):
        self.models = {}
        self.best_model = None
        self.best_score = 0
        self.feature_importance = None
        self.best_model_name = None
        
    def load_processed_data(self, data_path: str = "data/processed/processed_carbon_data.csv"):
        """Load the enhanced preprocessed dataset"""
        # Debug: Print current working directory and file path
        print(f"🔍 DEBUG: Current working directory: {os.getcwd()}")
        print(f" DEBUG: Looking for processed data at: {data_path}")
        print(f" DEBUG: File exists: {os.path.exists(data_path)}")
        
        if not os.path.exists(data_path):
            # Debug: Try to find the processed data file with better path resolution
            script_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(script_dir)))
            
            possible_paths = [
                "data/processed/processed_carbon_data.csv",
                "../../data/processed/processed_carbon_data.csv",
                "../data/processed/processed_carbon_data.csv",
                "processed_carbon_data.csv",
                os.path.join(project_root, "data", "processed", "processed_carbon_data.csv"),
                os.path.join(script_dir, "..", "..", "data", "processed", "processed_carbon_data.csv")
            ]
            
            print(f"🔍 DEBUG: Script directory: {script_dir}")
            print(f"🔍 DEBUG: Project root: {project_root}")
            print(f"🔍 DEBUG: Trying possible paths for processed data:")
            
            for path in possible_paths:
                exists = os.path.exists(path)
                print(f"  - {path}: {'✅ EXISTS' if exists else '❌ NOT FOUND'}")
                if exists:
                    print(f"    Full path: {os.path.abspath(path)}")
                    data_path = path
                    break
            
            if not os.path.exists(data_path):
                raise FileNotFoundError(f"Processed data not found: {data_path}")
        
        df = pd.read_csv(data_path)
        print(f"✅ Enhanced processed data loaded: {df.shape}")
        print(f"🔍 DEBUG: Processed data file absolute path: {os.path.abspath(data_path)}")
        print(f"Features: {list(df.columns)}")
        
        # Separate features and target
        X = df.drop(columns=['total_carbon_footprint'])
        y = df['total_carbon_footprint']
        
        return X, y
    
    def split_data(self, X, y, test_size=0.2, random_state=42):
        """Split data into training and testing sets"""
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, shuffle=True
        )
        
        print(f"Training set: {X_train.shape}")
        print(f"Testing set: {X_test.shape}")
        
        return X_train, X_test, y_train, y_test
    
    def train_models(self, X_train, y_train, X_test, y_test):
        """Train multiple enhanced models and compare performance"""
        print("🚀 Training enhanced models with new factors...")
        
        # Enhanced models with optimized hyperparameters for larger feature set
        models = {
            'Random Forest': RandomForestRegressor(
                n_estimators=300, 
                max_depth=15, 
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            ),
            'Gradient Boosting': GradientBoostingRegressor(
                n_estimators=300, 
                learning_rate=0.1,
                max_depth=8,
                min_samples_split=10,
                random_state=42
            ),
            'XGBoost': xgb.XGBRegressor(
                n_estimators=300,
                learning_rate=0.1,
                max_depth=8,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42
            ),
            'Linear Regression': LinearRegression(),
            'Ridge Regression': Ridge(alpha=1.0),
            'Lasso Regression': Lasso(alpha=0.01),
            'SVR': SVR(kernel='rbf', C=100, gamma='scale')
        }
        
        results = {}
        
        for name, model in models.items():
            print(f"\n🏋️ Training {name}...")
            
            try:
                # Train model
                model.fit(X_train, y_train)
                
                # Make predictions
                y_pred = model.predict(X_test)
                
                # Calculate metrics
                r2 = r2_score(y_test, y_pred)
                mae = mean_absolute_error(y_test, y_pred)
                rmse = np.sqrt(mean_squared_error(y_test, y_pred))
                
                results[name] = {
                    'model': model,
                    'r2_score': r2,
                    'mae': mae,
                    'rmse': rmse,
                    'predictions': y_pred
                }
                
                print(f"  ✅ R² Score: {r2:.4f}")
                print(f"  📊 MAE: {mae:.2f}")
                print(f"  📈 RMSE: {rmse:.2f}")
                
                # Store model
                self.models[name] = model
                
                # Update best model
                if r2 > self.best_score:
                    self.best_score = r2
                    self.best_model = model
                    self.best_model_name = name
                    
            except Exception as e:
                print(f"  ❌ Error training {name}: {e}")
                continue
        
        return results
    
    def hyperparameter_tuning(self, X_train, y_train, model_name: str = 'XGBoost'):
        """Fast hyperparameter tuning for the best model"""
        print(f"🔍 Performing FAST hyperparameter tuning for {model_name}...")
        
        if model_name == 'XGBoost':
            # Reduced parameter grid for faster tuning
            param_grid = {
                'n_estimators': [200, 300],  # Reduced from 3 to 2
                'max_depth': [6, 8],         # Reduced from 3 to 2
                'learning_rate': [0.1, 0.15], # Reduced from 3 to 2
                'subsample': [0.8, 0.9],     # Reduced from 3 to 2
                'colsample_bytree': [0.8, 0.9] # Reduced from 3 to 2
            }
            base_model = xgb.XGBRegressor(random_state=42)
            
        elif model_name == 'Random Forest':
            # Reduced parameter grid
            param_grid = {
                'n_estimators': [200, 300],   # Reduced from 3 to 2
                'max_depth': [10, 15],        # Reduced from 3 to 2
                'min_samples_split': [5, 10], # Reduced from 3 to 2
                'min_samples_leaf': [2, 4]    # Reduced from 3 to 2
            }
            base_model = RandomForestRegressor(random_state=42)
            
        elif model_name == 'Gradient Boosting':
            # Reduced parameter grid
            param_grid = {
                'n_estimators': [200, 300],   # Reduced from 3 to 2
                'learning_rate': [0.1, 0.15], # Reduced from 3 to 2
                'max_depth': [6, 8],          # Reduced from 3 to 2
                'min_samples_split': [10, 15] # Reduced from 3 to 2
            }
            base_model = GradientBoostingRegressor(random_state=42)
        
        else:
            print(f"Hyperparameter tuning not implemented for {model_name}")
            return None
        
        # Perform grid search with reduced CV folds for speed
        grid_search = GridSearchCV(
            base_model, 
            param_grid, 
            cv=3,           # Reduced from 5 to 3 folds
            scoring='r2', 
            n_jobs=-1,      # Use all CPU cores
            verbose=0        # Reduced verbosity
        )
        
        print(f"🔍 Tuning with {len(param_grid)} parameter combinations and 3-fold CV...")
        grid_search.fit(X_train, y_train)
        
        print(f"✅ Best parameters: {grid_search.best_params_}")
        print(f"✅ Best CV score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def analyze_feature_importance(self, X, y, model_name: str = None):
        """Analyze feature importance for the enhanced feature set"""
        if model_name is None:
            model_name = self.best_model_name
        
        if model_name not in self.models:
            print(f"Model {model_name} not found")
            return
        
        model = self.models[model_name]
        
        if hasattr(model, 'feature_importances_'):
            # Tree-based models
            importance = model.feature_importances_
        elif hasattr(model, 'coef_'):
            # Linear models
            importance = np.abs(model.coef_)
        else:
            print(f"Feature importance not available for {model_name}")
            return
        
        # Create feature importance DataFrame
        feature_importance_df = pd.DataFrame({
            'feature': X.columns,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        self.feature_importance = feature_importance_df
        
        print(f"\n🏆 Top 15 Most Important Features for {model_name}:")
        print(feature_importance_df.head(15))
        
        return feature_importance_df
    
    def save_model(self, model_name: str = None, output_dir: str = "models"):
        """Save the best model with enhanced metadata"""
        if model_name is None:
            model_name = self.best_model_name
        
        if model_name not in self.models:
            print(f"Model {model_name} not found")
            return
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Prepare model data
        model_data = {
            'model': self.models[model_name],
            'model_name': model_name,
            'best_score': self.best_score,
            'feature_names': list(self.models[model_name].feature_names_in_) if hasattr(self.models[model_name], 'feature_names_in_') else None,
            'feature_importance': self.feature_importance,
            'training_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
            'dataset_shape': f"{len(self.models[model_name].feature_names_in_) if hasattr(self.models[model_name], 'feature_names_in_') else 'Unknown'} features"
        }
        
        # Save model
        output_path = os.path.join(output_dir, f"{model_name.lower().replace(' ', '_')}_model.pkl")
        joblib.dump(model_data, output_path)
        
        print(f"✅ Model saved successfully!")
        print(f" Path: {output_path}")
        print(f" Model: {model_name}")
        print(f"📊 R² Score: {self.best_score:.4f}")
        
        return output_path
    
    def train_pipeline(self, data_path: str = "data/processed/processed_carbon_data.csv"):
        """Complete training pipeline for enhanced dataset"""
        print("🚀 Starting enhanced training pipeline...")
        
        try:
            # Load data
            X, y = self.load_processed_data(data_path)
            
            # Split data
            X_train, X_test, y_train, y_test = self.split_data(X, y)
            
            # Train models
            results = self.train_models(X_train, y_train, X_test, y_test)
            
            # Analyze feature importance
            self.analyze_feature_importance(X, y)
            
            # Fast hyperparameter tuning for best model (only if R² > 0.98)
            if self.best_score > 0.98 and self.best_model_name in ['XGBoost', 'Random Forest', 'Gradient Boosting']:
                print(f"🚀 Skipping hyperparameter tuning for {self.best_model_name} as it already has excellent performance (R² = {self.best_score:.4f})")
            elif self.best_model_name in ['XGBoost', 'Random Forest', 'Gradient Boosting']:
                print(f"🔍 Performing fast hyperparameter tuning for {self.best_model_name}...")
                tuned_model = self.hyperparameter_tuning(X_train, y_train, self.best_model_name)
                if tuned_model is not None:
                    self.models[self.best_model_name] = tuned_model
                    self.best_model = tuned_model
                    print(f"✅ Hyperparameter tuning completed!")
            
            # Save best model
            self.save_model()
            
            print(f"\n🎉 Training pipeline completed successfully!")
            print(f"🏆 Best Model: {self.best_model_name}")
            print(f"📊 Best R² Score: {self.best_score:.4f}")
            
            return results
            
        except Exception as e:
            print(f"❌ Error in training pipeline: {e}")
            raise

if __name__ == "__main__":
    # Debug: Print script location and current working directory
    print(f"🔍 DEBUG: Script location: {__file__}")
    print(f"🔍 DEBUG: Script directory: {os.path.dirname(__file__)}")
    print(f"🔍 DEBUG: Current working directory: {os.getcwd()}")
    
    # Test the enhanced trainer with automatic path resolution
    trainer = CarbonEmissionTrainer()
    
    try:
        # Let the trainer automatically find the processed data
        results = trainer.train_pipeline()
        print("✅ Enhanced training test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during training: {e}")
        import traceback
        traceback.print_exc()
