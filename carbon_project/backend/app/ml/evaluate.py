import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.model_selection import cross_val_score, KFold
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

# Set matplotlib to use a faster backend if available
try:
    plt.switch_backend('Agg')  # Non-interactive backend - much faster
    print("🚀 Using fast matplotlib backend")
except:
    pass

class CarbonEmissionEvaluator:
    """
    Enhanced evaluation pipeline for carbon emission models
    Comprehensive analysis with new factors and features
    """
    
    def __init__(self, model_path: str = "models/v3_carbon_emission_model_minimal.pkl", create_plots: bool = True):
        self.model_path = model_path
        self.model_data = None
        self.model = None
        self.feature_names = None
        self.create_plots = create_plots
        
    def load_model(self):
        """Load the trained model for evaluation"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found: {self.model_path}")
        
        self.model_data = joblib.load(self.model_path)
        self.model = self.model_data['model']
        self.feature_names = self.model_data.get('feature_names', [])
        
        print(f"✅ Model loaded for evaluation: {self.model_data.get('model_name', 'Unknown Model')}")
        return self.model
    
    def cross_validation_evaluation(self, X, y, cv_folds: int = 5):
        """Perform cross-validation evaluation"""
        print(f"🔄 Performing {cv_folds}-fold cross-validation...")
        
        # Define cross-validation strategy
        cv = KFold(n_splits=cv_folds, shuffle=True, random_state=42)
        
        # Perform cross-validation
        cv_scores = cross_val_score(self.model, X, y, cv=cv, scoring='r2')
        
        print(f"📊 Cross-Validation Results:")
        print(f"  R² Scores: {cv_scores}")
        print(f"  Mean R²: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        print(f"  Min R²: {cv_scores.min():.4f}")
        print(f"  Max R²: {cv_scores.max():.4f}")
        
        return cv_scores
    
    def detailed_metrics_analysis(self, y_true, y_pred):
        """Perform detailed metrics analysis"""
        print(f"📈 Calculating detailed metrics...")
        
        # Basic metrics
        r2 = r2_score(y_true, y_pred)
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
        
        # Additional metrics
        mse = mean_squared_error(y_true, y_pred)
        adjusted_r2 = 1 - (1 - r2) * (len(y_true) - 1) / (len(y_true) - len(self.feature_names) - 1)
        
        metrics = {
            'R² Score': r2,
            'Adjusted R²': adjusted_r2,
            'MAE': mae,
            'RMSE': rmse,
            'MSE': mse,
            'MAPE (%)': mape
        }
        
        print(f"📊 Metrics Summary:")
        for metric, value in metrics.items():
            if 'Score' in metric or 'R²' in metric:
                print(f"  {metric}: {value:.4f}")
            elif 'MAPE' in metric:
                print(f"  {metric}: {value:.2f}%")
            else:
                print(f"  {metric}: {value:.2f}")
        
        return metrics
    
    def error_analysis(self, y_true, y_pred):
        """Perform comprehensive error analysis"""
        print(f"🔍 Performing error analysis...")
        
        errors = y_true - y_pred
        error_percentage = (errors / y_true) * 100
        
        error_stats = {
            'Mean Error': np.mean(errors),
            'Std Error': np.std(errors),
            'Min Error': np.min(errors),
            'Max Error': np.max(errors),
            'Mean Error %': np.mean(error_percentage),
            'Std Error %': np.std(error_percentage),
            'Min Error %': np.min(error_percentage),
            'Max Error %': np.max(error_percentage)
        }
        
        print(f"📊 Error Statistics:")
        for stat, value in error_stats.items():
            if '%' in stat:
                print(f"  {stat}: {value:.2f}%")
            else:
                print(f"  {stat}: {value:.2f}")
        
        return error_stats
    
    def create_evaluation_report(self, X, y, y_pred, cv_scores, metrics, error_stats):
        """Create comprehensive evaluation report"""
        if not self.create_plots:
            print("⏭️ Skipping plot generation for faster evaluation")
            return None
            
        print(f"📋 Creating evaluation report (this may take a moment)...")
        
        # Use faster plotting with reduced quality for speed
        plt.style.use('fast')  # Use fast style if available
        
        # Create comprehensive visualization with smaller figure size
        fig, axes = plt.subplots(2, 3, figsize=(15, 10), dpi=100)  # Reduced DPI for speed
        
        # 1. Actual vs Predicted (use fewer points for large datasets)
        if len(y) > 10000:
            # Sample data for faster plotting
            sample_idx = np.random.choice(len(y), 10000, replace=False)
            y_sample = y.iloc[sample_idx] if hasattr(y, 'iloc') else y[sample_idx]
            y_pred_sample = y_pred[sample_idx]
        else:
            y_sample, y_pred_sample = y, y_pred
            
        axes[0, 0].scatter(y_sample, y_pred_sample, alpha=0.5, color='blue', s=20)
        axes[0, 0].plot([y.min(), y.max()], [y.min(), y.max()], 'r--', lw=2)
        axes[0, 0].set_xlabel('Actual Values')
        axes[0, 0].set_ylabel('Predicted Values')
        axes[0, 0].set_title('Actual vs Predicted')
        axes[0, 0].grid(True, alpha=0.3)
        
        # 2. Residuals
        residuals = y - y_pred
        if len(y) > 10000:
            residuals_sample = residuals.iloc[sample_idx] if hasattr(residuals, 'iloc') else residuals[sample_idx]
            y_pred_sample_for_resid = y_pred[sample_idx]
        else:
            residuals_sample = residuals
            y_pred_sample_for_resid = y_pred
            
        axes[0, 1].scatter(y_pred_sample_for_resid, residuals_sample, alpha=0.5, color='green', s=20)
        axes[0, 1].axhline(y=0, color='r', linestyle='--')
        axes[0, 1].set_xlabel('Predicted Values')
        axes[0, 1].set_ylabel('Residuals')
        axes[0, 1].set_title('Residuals Plot')
        axes[0, 1].grid(True, alpha=0.3)
        
        # 3. Cross-validation scores
        axes[0, 2].bar(range(len(cv_scores)), cv_scores, color='orange', alpha=0.7)
        axes[0, 2].set_xlabel('Fold')
        axes[0, 2].set_ylabel('R² Score')
        axes[0, 2].set_title('Cross-Validation Scores')
        axes[0, 2].grid(True, alpha=0.3)
        
        # 4. Error distribution (use fewer bins for speed)
        axes[1, 0].hist(residuals, bins=30, alpha=0.7, color='purple', edgecolor='black')
        axes[1, 0].set_xlabel('Prediction Error')
        axes[1, 0].set_ylabel('Frequency')
        axes[1, 0].set_title('Error Distribution')
        axes[1, 0].grid(True, alpha=0.3)
        
        # 5. Error percentage distribution
        error_percentage = (residuals / y) * 100
        axes[1, 1].hist(error_percentage, bins=30, alpha=0.7, color='red', edgecolor='black')
        axes[1, 1].set_xlabel('Error Percentage (%)')
        axes[1, 1].set_ylabel('Frequency')
        axes[1, 1].set_title('Error Percentage Distribution')
        axes[1, 1].grid(True, alpha=0.3)
        
        # 6. Metrics summary
        axes[1, 2].axis('off')
        metrics_text = '\n'.join([f'{k}: {v:.4f}' for k, v in metrics.items()])
        axes[1, 2].text(0.1, 0.5, f'Metrics Summary:\n\n{metrics_text}', 
                        transform=axes[1, 2].transAxes, fontsize=10, 
                        verticalalignment='center', fontfamily='monospace')
        
        plt.tight_layout()
        
        # Save comprehensive report with lower DPI for speed
        os.makedirs('../../../reports', exist_ok=True)
        plt.savefig('../../../reports/enhanced_evaluation_report.png', dpi=150, bbox_inches='tight')
        plt.close()  # Close figure to free memory
        
        print(f"✅ Evaluation report created and saved!")
        return fig
    
    def run_comprehensive_evaluation(self, data_path: str = "../../../data/processed/v3_processed_carbon_data.csv"):
        """Run comprehensive evaluation pipeline"""
        print("🚀 Starting Enhanced Comprehensive Evaluation...")
        
        try:
            # Load model
            self.load_model()
            
            # Load data
            print("📊 Loading data...")
            df = pd.read_csv(data_path)
            X = df.drop(columns=['total_carbon_footprint'])
            y = df['total_carbon_footprint']
            
            print(f"📊 Data loaded: {X.shape}")
            
            # Make predictions
            print("🔮 Making predictions...")
            y_pred = self.model.predict(X)
            
            # Perform evaluations
            cv_scores = self.cross_validation_evaluation(X, y)
            metrics = self.detailed_metrics_analysis(y, y_pred)
            error_stats = self.error_analysis(y, y_pred)
            
            # Create report (optional)
            if self.create_plots:
                self.create_evaluation_report(X, y, y_pred, cv_scores, metrics, error_stats)
            
            # Save evaluation results
            print("💾 Saving results...")
            evaluation_results = {
                'cv_scores': cv_scores,
                'metrics': metrics,
                'error_stats': error_stats,
                'model_info': {
                    'model_name': self.model_data.get('model_name', 'Unknown Model'),
                    'best_score': self.model_data.get('best_score', 'N/A'),
                    'feature_count': len(self.feature_names),
                    'training_date': self.model_data.get('training_date', 'Unknown')
                }
            }
            
            # Save results
            os.makedirs('../../../reports', exist_ok=True)
            results_path = '../../../reports/evaluation_results.pkl'
            joblib.dump(evaluation_results, results_path)
            
            print(f"\n🎉 Enhanced evaluation completed successfully!")
            print(f"📁 Results saved to: {results_path}")
            
            return evaluation_results
            
        except Exception as e:
            print(f"❌ Error in evaluation: {e}")
            raise

if __name__ == "__main__":
    # Test the enhanced evaluator with option to skip plots for speed
    print("⚡ For faster evaluation without plots, set create_plots=False")
    
    # Uncomment the line below for faster evaluation without plots
    # evaluator = CarbonEmissionEvaluator(create_plots=False)
    
    # Use this for full evaluation with plots
    evaluator = CarbonEmissionEvaluator()
    
    try:
        results = evaluator.run_comprehensive_evaluation()
        print("✅ Enhanced evaluation test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during evaluation: {e}")
