import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt
import seaborn as sns

class CarbonEmissionTester:
    """
    Enhanced testing and validation for the trained carbon emission model
    Updated for new factors and enhanced features
    """
    
    def __init__(self, model_path: str = "models/xgboost_model.pkl"):
        self.model_path = model_path
        self.model_data = None
        self.model = None
        self.feature_names = None
        
    def load_trained_model(self):
        """Load the trained enhanced model and metadata"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found: {self.model_path}")
        
        self.model_data = joblib.load(self.model_path)
        self.model = self.model_data['model']
        
        # Handle missing feature_names by getting them from processed data
        if self.model_data.get('feature_names') is None:
            print("⚠️  Feature names not found in model, extracting from processed data...")
            processed_data_path = "data/processed/processed_carbon_data.csv"
            if os.path.exists(processed_data_path):
                df = pd.read_csv(processed_data_path)
                self.feature_names = [col for col in df.columns if col != 'total_carbon_footprint']
                print(f"✅ Extracted {len(self.feature_names)} feature names from processed data")
            else:
                raise FileNotFoundError("Processed data not found to extract feature names")
        else:
            self.feature_names = self.model_data['feature_names']
        
        print(f"✅ Enhanced model loaded successfully!")
        print(f"Model Type: {self.model_data['model_name']}")
        print(f"Best R² Score: {self.model_data['best_score']:.4f}")
        print(f"Number of Features: {len(self.feature_names)}")
        print(f"Training Date: {self.model_data.get('training_date', 'Unknown')}")
        print(f"Dataset Info: {self.model_data.get('dataset_shape', 'Unknown')}")
        
        return self.model
    
    def test_on_processed_data(self, test_data_path: str = "data/processed/processed_carbon_data.csv"):
        """Test the enhanced model on the processed dataset"""
        print("\n🧪 Testing enhanced model on processed dataset...")
        
        # Debug: Try to find the processed data file with better path resolution
        if not os.path.exists(test_data_path):
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
                    test_data_path = path
                    break
            
            if not os.path.exists(test_data_path):
                raise FileNotFoundError(f"Processed data not found: {test_data_path}")
        
        # Load test data
        df = pd.read_csv(test_data_path)
        X_test = df.drop(columns=['total_carbon_footprint'])
        y_true = df['total_carbon_footprint']
        
        # Make predictions
        y_pred = self.model.predict(X_test)
        
        # Calculate metrics
        r2 = r2_score(y_true, y_pred)
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        
        print(f"📊 Enhanced Test Results:")
        print(f"  R² Score: {r2:.4f}")
        print(f"  MAE: {mae:.2f} kg CO2/year")
        print(f"  RMSE: {rmse:.2f} kg CO2/year")
        print(f"  Sample Size: {len(y_true)}")
        print(f"  Features Used: {len(self.feature_names)}")
        
        # Create comparison DataFrame
        results_df = pd.DataFrame({
            'Actual': y_true,
            'Predicted': y_pred,
            'Difference': y_true - y_pred,
            'Error_Percentage': ((y_true - y_pred) / y_true) * 100
        })
        
        print(f"\n📈 Enhanced Prediction Accuracy:")
        print(f"  Mean Error: {results_df['Difference'].mean():.2f} kg CO2/year")
        print(f"  Mean Error %: {results_df['Error_Percentage'].mean():.2f}%")
        print(f"  Std Error: {results_df['Difference'].std():.2f} kg CO2/year")
        
        return results_df, y_true, y_pred
    
    def test_single_prediction(self, input_data: dict):
        """Test the enhanced model with a single household's data"""
        print(f"\n🏠 Testing Enhanced Single Prediction...")
        
        # Create input DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Ensure all required features are present
        missing_features = set(self.feature_names) - set(input_df.columns)
        if missing_features:
            print(f"❌ Missing features: {missing_features}")
            print(f" Required features: {self.feature_names}")
            return None
        
        # Reorder columns to match training data
        input_df = input_df[self.feature_names]
        
        # Make prediction
        prediction = self.model.predict(input_df)[0]
        
        print(f"✅ Prediction successful!")
        print(f"📊 Predicted Carbon Footprint: {prediction:.2f} kg CO2/year")
        
        return prediction
    
    def analyze_feature_importance(self):
        """Analyze feature importance from the trained model"""
        if self.model_data.get('feature_importance') is not None:
            feature_importance = self.model_data['feature_importance']
            
            print(f"\n Feature Importance Analysis:")
            print(f"Top 20 Most Important Features:")
            print(feature_importance.head(20))
            
            try:
                # Create feature importance plot
                plt.figure(figsize=(12, 8))
                top_features = feature_importance.head(15)
                plt.barh(range(len(top_features)), top_features['importance'], color='skyblue', alpha=0.8)
                plt.yticks(range(len(top_features)), top_features['feature'])
                plt.xlabel('Feature Importance')
                plt.title('Top 15 Most Important Features for Carbon Footprint Prediction')
                plt.gca().invert_yaxis()
                plt.tight_layout()
                
                # Save plot to reports folder
                os.makedirs('../../reports', exist_ok=True)
                plot_path = '../../reports/feature_importance.png'
                plt.savefig(plot_path, dpi=300, bbox_inches='tight')
                print(f"✅ Feature importance plot saved to: {os.path.abspath(plot_path)}")
                
                # Don't show the plot to avoid overlapping
                plt.close()
                
                return feature_importance
                
            except Exception as e:
                print(f"⚠️  Error creating feature importance plot: {e}")
                return feature_importance
        else:
            print("⚠️  Feature importance data not available")
            return None
    
    def create_prediction_report(self, results_df, y_true, y_pred):
        """Create comprehensive prediction report without overlapping text"""
        print(f"\n📊 Creating Enhanced Prediction Report...")
        
        try:
            # Create comprehensive visualization
            fig, axes = plt.subplots(2, 3, figsize=(18, 12))
            
            # 1. Actual vs Predicted scatter plot
            axes[0, 0].scatter(y_true, y_pred, alpha=0.6, color='blue', s=20)
            axes[0, 0].plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--', lw=2)
            axes[0, 0].set_xlabel('Actual Carbon Footprint (kg CO2/year)')
            axes[0, 0].set_ylabel('Predicted Carbon Footprint (kg CO2/year)')
            axes[0, 0].set_title('Actual vs Predicted Values')
            axes[0, 0].grid(True, alpha=0.3)
            
            # 2. Residuals plot
            residuals = y_true - y_pred
            axes[0, 1].scatter(y_pred, residuals, alpha=0.6, color='green', s=20)
            axes[0, 1].axhline(y=0, color='r', linestyle='--')
            axes[0, 1].set_xlabel('Predicted Values')
            axes[0, 1].set_ylabel('Residuals')
            axes[0, 1].set_title('Residuals Plot')
            axes[0, 1].grid(True, alpha=0.3)
            
            # 3. Error distribution
            axes[0, 2].hist(residuals, bins=50, alpha=0.7, color='purple', edgecolor='black')
            axes[0, 2].set_xlabel('Prediction Error')
            axes[0, 2].set_ylabel('Frequency')
            axes[0, 2].set_title('Error Distribution')
            axes[0, 2].grid(True, alpha=0.3)
            
            # 4. Error percentage distribution
            error_percentage = (residuals / y_true) * 100
            axes[1, 0].hist(error_percentage, bins=50, alpha=0.7, color='red', edgecolor='black')
            axes[1, 0].set_xlabel('Error Percentage (%)')
            axes[1, 0].set_ylabel('Frequency')
            axes[1, 0].set_title('Error Percentage Distribution')
            axes[1, 0].grid(True, alpha=0.3)
            
            # 5. Feature importance bar chart
            if hasattr(self.model, 'feature_importances_'):
                top_features = self.feature_importance.head(10)
                axes[1, 1].barh(range(len(top_features)), top_features['importance'], color='orange', alpha=0.7)
                axes[1, 1].set_yticks(range(len(top_features)))
                axes[1, 1].set_yticklabels(top_features['feature'])
                axes[1, 1].set_xlabel('Feature Importance')
                axes[1, 1].set_title('Top 10 Most Important Features')
                axes[1, 1].grid(True, alpha=0.3)
            
            # 6. Metrics summary table
            axes[1, 2].axis('off')
            metrics_text = f"""Model Performance Summary:
            
Model: {self.model_data['model_name']}
R² Score: {self.model_data['best_score']:.4f}
Features: {len(self.feature_names)}
Training Date: {self.model_data.get('training_date', 'Unknown')}

Test Results:
R² Score: {r2_score(y_true, y_pred):.4f}
MAE: {mean_absolute_error(y_true, y_pred):.2f}
RMSE: {np.sqrt(mean_squared_error(y_true, y_pred)):.2f}
Mean Error: {results_df['Difference'].mean():.2f}
Error %: {results_df['Error_Percentage'].mean():.2f}%"""
            
            axes[1, 2].text(0.1, 0.5, metrics_text, 
                            transform=axes[1, 2].transAxes, fontsize=10, 
                            verticalalignment='center', fontfamily='monospace',
                            bbox=dict(boxstyle="round,pad=0.3", facecolor="lightgray", alpha=0.8))
            
            plt.tight_layout()
            
            # Save comprehensive report to reports folder
            os.makedirs('../../reports', exist_ok=True)
            report_path = '../../reports/enhanced_prediction_analysis.png'
            plt.savefig(report_path, dpi=300, bbox_inches='tight')
            print(f"✅ Enhanced prediction report saved to: {os.path.abspath(report_path)}")
            
            # Don't show the plot to avoid overlapping with text
            plt.close(fig)
            
            return fig
            
        except Exception as e:
            print(f"❌ Error creating prediction report: {e}")
            return None
    
    def run_comprehensive_test(self):
        """Run comprehensive testing suite"""
        print("🚀 Running Enhanced Comprehensive Testing Suite...")
        
        try:
            # Load model
            self.load_trained_model()
            
            # Test on processed data
            results_df, y_true, y_pred = self.test_on_processed_data()
            
            # Analyze feature importance
            self.analyze_feature_importance()
            
            # Create prediction report
            self.create_prediction_report(results_df, y_true, y_pred)
            
            # Test single prediction with sample data
            sample_input = {
                'household_size': 3,
                'income_level': 1,  # Encoded value
                'home_type': 1,     # Encoded value
                'home_size_sqft': 1200,
                'electricity_usage_kwh': 800,
                'vehicle_monthly_distance_km': 500,
                'fuel_efficiency': 30,
                'renewable_energy_percentage': 20,
                'meat_consumption': 2.5,
                'waste_per_person': 4.0,
                'recycling_rate': 0.7
            }
            
            # Add missing features with default values
            for feature in self.feature_names:
                if feature not in sample_input:
                    sample_input[feature] = 0  # Default value
            
            prediction = self.test_single_prediction(sample_input)
            
            print(f"\n🎉 Enhanced comprehensive testing completed successfully!")
            return results_df, y_true, y_pred
            
        except Exception as e:
            print(f"❌ Error in comprehensive testing: {e}")
            raise

if __name__ == "__main__":
    # Debug: Print script location and current working directory
    print(f"🔍 DEBUG: Script location: {__file__}")
    print(f"🔍 DEBUG: Script directory: {os.path.dirname(__file__)}")
    print(f"🔍 DEBUG: Current working directory: {os.getcwd()}")
    
    # Test the enhanced tester
    tester = CarbonEmissionTester()
    
    try:
        results_df, y_true, y_pred = tester.run_comprehensive_test()
        print("✅ Enhanced testing completed successfully!")
        print(f"\n📁 Reports saved to: {os.path.abspath('../../reports')}")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
