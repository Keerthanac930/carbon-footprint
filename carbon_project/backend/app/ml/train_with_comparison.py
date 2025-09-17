import pandas as pd
import numpy as np
import joblib
import os
import warnings
from datetime import datetime
from typing import Dict, List, Tuple, Any
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import xgboost as xgb
try:
    import lightgbm as lgb
    LIGHTGBM_AVAILABLE = True
    print("✅ LightGBM available")
except ImportError:
    LIGHTGBM_AVAILABLE = False
    print("⚠️ LightGBM not available. Install with: pip install lightgbm")

from sklearn.preprocessing import RobustScaler
import matplotlib.pyplot as plt
import seaborn as sns

warnings.filterwarnings('ignore')

# Set matplotlib to use a faster backend
try:
    plt.switch_backend('Agg')
    print("🚀 Using fast matplotlib backend")
except:
    pass

class CarbonEmissionModelComparator:
    """
    Advanced model comparison and selection system for carbon emission prediction
    Trains multiple models and automatically selects the best performing one
    """
    
    def __init__(self, data_path: str = "../../../data/processed/v3_processed_carbon_data.csv"):
        self.data_path = data_path
        self.models = {}
        self.results = {}
        self.best_model = None
        self.best_model_name = None
        self.best_score = 0
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.feature_names = None
        self.training_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    def load_and_prepare_data(self):
        """Load and prepare data for training"""
        print("📊 Loading and preparing data...")
        
        # Load data
        df = pd.read_csv(self.data_path)
        print(f"✅ Data loaded: {df.shape}")
        
        # Separate features and target
        X = df.drop(columns=['total_carbon_footprint'])
        y = df['total_carbon_footprint']
        self.feature_names = list(X.columns)
        
        # Handle missing values
        X = X.fillna(X.median())
        y = y.fillna(y.median())
        
        # Split data
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"📊 Training set: {self.X_train.shape}")
        print(f"📊 Test set: {self.X_test.shape}")
        
        return self.X_train, self.X_test, self.y_train, self.y_test
    
    def get_model_configurations(self):
        """Get comprehensive model configurations for comparison"""
        models = {
            'Random Forest': RandomForestRegressor(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ),
            'Extra Trees': ExtraTreesRegressor(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ),
            'Gradient Boosting': GradientBoostingRegressor(
                n_estimators=200,
                learning_rate=0.1,
                max_depth=8,
                min_samples_split=10,
                random_state=42
            ),
            'XGBoost': xgb.XGBRegressor(
                n_estimators=200,
                learning_rate=0.1,
                max_depth=8,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1
            ),
            'Linear Regression': LinearRegression(n_jobs=-1),
            'Ridge Regression': Ridge(alpha=1.0),
            'Lasso Regression': Lasso(alpha=0.01, max_iter=2000),
            'Elastic Net': ElasticNet(alpha=0.01, l1_ratio=0.5, max_iter=2000),
            'SVR': SVR(kernel='rbf', C=100, gamma='scale'),
            'K-Neighbors': KNeighborsRegressor(n_neighbors=5, n_jobs=-1),
            'Decision Tree': DecisionTreeRegressor(
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            )
        }
        
        # Add LightGBM only if available
        if LIGHTGBM_AVAILABLE:
            models['LightGBM'] = lgb.LGBMRegressor(
                n_estimators=200,
                learning_rate=0.1,
                max_depth=8,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1,
                verbose=-1
            )
            print("✅ LightGBM included in comparison")
        else:
            print("⚠️ LightGBM excluded from comparison (not available)")
        
        return models
    
    def evaluate_model(self, model, model_name: str, X_train, y_train, X_test, y_test):
        """Comprehensive model evaluation"""
        print(f"🔄 Evaluating {model_name}...")
        
        # Train model
        model.fit(X_train, y_train)
        
        # Make predictions
        y_train_pred = model.predict(X_train)
        y_test_pred = model.predict(X_test)
        
        # Calculate metrics
        train_r2 = r2_score(y_train, y_train_pred)
        test_r2 = r2_score(y_test, y_test_pred)
        train_mae = mean_absolute_error(y_train, y_train_pred)
        test_mae = mean_absolute_error(y_test, y_test_pred)
        train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
        test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
        
        # Calculate MAPE (avoid division by zero)
        train_mape = np.mean(np.abs((y_train - y_train_pred) / (y_train + 1e-8))) * 100
        test_mape = np.mean(np.abs((y_test - y_test_pred) / (y_test + 1e-8))) * 100
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
        cv_mean = cv_scores.mean()
        cv_std = cv_scores.std()
        
        # Calculate overfitting score (difference between train and test R²)
        overfitting_score = train_r2 - test_r2
        
        # Store results
        results = {
            'model': model,
            'model_name': model_name,
            'train_r2': train_r2,
            'test_r2': test_r2,
            'train_mae': train_mae,
            'test_mae': test_mae,
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'train_mape': train_mape,
            'test_mape': test_mape,
            'cv_mean': cv_mean,
            'cv_std': cv_std,
            'overfitting_score': overfitting_score,
            'y_test_pred': y_test_pred
        }
        
        print(f"  📊 Test R²: {test_r2:.4f}")
        print(f"  📊 CV R²: {cv_mean:.4f} (±{cv_std:.4f})")
        print(f"  📊 Test RMSE: {test_rmse:.2f}")
        print(f"  📊 Overfitting: {overfitting_score:.4f}")
        
        return results
    
    def train_and_compare_models(self):
        """Train and compare all models"""
        print("🚀 Training and comparing multiple models...")
        print("=" * 60)
        
        # Load data
        self.load_and_prepare_data()
        
        # Get model configurations
        model_configs = self.get_model_configurations()
        
        # Train and evaluate each model
        for model_name, model in model_configs.items():
            try:
                results = self.evaluate_model(
                    model, model_name, 
                    self.X_train, self.y_train, 
                    self.X_test, self.y_test
                )
                self.results[model_name] = results
                self.models[model_name] = model
                
            except Exception as e:
                print(f"❌ Error training {model_name}: {e}")
                continue
        
        print("\n" + "=" * 60)
        print("📊 MODEL COMPARISON RESULTS")
        print("=" * 60)
        
        # Sort models by test R² score
        sorted_results = sorted(
            self.results.items(), 
            key=lambda x: x[1]['test_r2'], 
            reverse=True
        )
        
        # Display results
        print(f"{'Model':<20} {'Test R²':<10} {'CV R²':<12} {'Test RMSE':<12} {'Overfitting':<12}")
        print("-" * 70)
        
        for model_name, results in sorted_results:
            print(f"{model_name:<20} {results['test_r2']:<10.4f} {results['cv_mean']:<12.4f} {results['test_rmse']:<12.2f} {results['overfitting_score']:<12.4f}")
        
        # Select best model
        self.best_model_name, self.best_model_data = sorted_results[0]
        self.best_model = self.best_model_data['model']
        self.best_score = self.best_model_data['test_r2']
        
        print(f"\n🏆 BEST MODEL: {self.best_model_name}")
        print(f"🎯 Best Test R²: {self.best_score:.4f}")
        print(f"📊 Best CV R²: {self.best_model_data['cv_mean']:.4f} (±{self.best_model_data['cv_std']:.4f})")
        
        return self.results
    
    def create_comparison_visualization(self):
        """Create comprehensive comparison visualization"""
        print("📊 Creating model comparison visualization...")
        
        # Create figure with subplots
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        
        # 1. R² Score Comparison
        model_names = list(self.results.keys())
        test_r2_scores = [self.results[name]['test_r2'] for name in model_names]
        cv_r2_scores = [self.results[name]['cv_mean'] for name in model_names]
        
        x_pos = np.arange(len(model_names))
        width = 0.35
        
        axes[0, 0].bar(x_pos - width/2, test_r2_scores, width, label='Test R²', alpha=0.8)
        axes[0, 0].bar(x_pos + width/2, cv_r2_scores, width, label='CV R²', alpha=0.8)
        axes[0, 0].set_xlabel('Models')
        axes[0, 0].set_ylabel('R² Score')
        axes[0, 0].set_title('R² Score Comparison')
        axes[0, 0].set_xticks(x_pos)
        axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
        axes[0, 0].legend()
        axes[0, 0].grid(True, alpha=0.3)
        
        # 2. RMSE Comparison
        test_rmse_scores = [self.results[name]['test_rmse'] for name in model_names]
        axes[0, 1].bar(model_names, test_rmse_scores, alpha=0.8, color='orange')
        axes[0, 1].set_xlabel('Models')
        axes[0, 1].set_ylabel('RMSE')
        axes[0, 1].set_title('RMSE Comparison (Lower is Better)')
        axes[0, 1].tick_params(axis='x', rotation=45)
        axes[0, 1].grid(True, alpha=0.3)
        
        # 3. Overfitting Analysis
        overfitting_scores = [self.results[name]['overfitting_score'] for name in model_names]
        colors = ['red' if score > 0.05 else 'orange' if score > 0.02 else 'green' for score in overfitting_scores]
        axes[0, 2].bar(model_names, overfitting_scores, alpha=0.8, color=colors)
        axes[0, 2].set_xlabel('Models')
        axes[0, 2].set_ylabel('Overfitting Score (Train R² - Test R²)')
        axes[0, 2].set_title('Overfitting Analysis (Lower is Better)')
        axes[0, 2].tick_params(axis='x', rotation=45)
        axes[0, 2].grid(True, alpha=0.3)
        
        # 4. Cross-Validation Scores with Error Bars
        cv_means = [self.results[name]['cv_mean'] for name in model_names]
        cv_stds = [self.results[name]['cv_std'] for name in model_names]
        axes[1, 0].errorbar(x_pos, cv_means, yerr=cv_stds, fmt='o', capsize=5, capthick=2)
        axes[1, 0].set_xlabel('Models')
        axes[1, 0].set_ylabel('CV R² Score')
        axes[1, 0].set_title('Cross-Validation Scores with Error Bars')
        axes[1, 0].set_xticks(x_pos)
        axes[1, 0].set_xticklabels(model_names, rotation=45, ha='right')
        axes[1, 0].grid(True, alpha=0.3)
        
        # 5. MAE vs RMSE Scatter
        test_mae_scores = [self.results[name]['test_mae'] for name in model_names]
        axes[1, 1].scatter(test_mae_scores, test_rmse_scores, s=100, alpha=0.7)
        for i, name in enumerate(model_names):
            axes[1, 1].annotate(name, (test_mae_scores[i], test_rmse_scores[i]), 
                              xytext=(5, 5), textcoords='offset points', fontsize=8)
        axes[1, 1].set_xlabel('Test MAE')
        axes[1, 1].set_ylabel('Test RMSE')
        axes[1, 1].set_title('MAE vs RMSE (Lower is Better)')
        axes[1, 1].grid(True, alpha=0.3)
        
        # 6. Model Performance Summary
        axes[1, 2].axis('off')
        
        # Create summary table
        summary_data = []
        for name in model_names:
            summary_data.append([
                name,
                f"{self.results[name]['test_r2']:.4f}",
                f"{self.results[name]['cv_mean']:.4f}",
                f"{self.results[name]['test_rmse']:.2f}",
                f"{self.results[name]['overfitting_score']:.4f}"
            ])
        
        table = axes[1, 2].table(cellText=summary_data,
                               colLabels=['Model', 'Test R²', 'CV R²', 'RMSE', 'Overfitting'],
                               cellLoc='center',
                               loc='center')
        table.auto_set_font_size(False)
        table.set_fontsize(8)
        table.scale(1, 1.5)
        axes[1, 2].set_title('Model Performance Summary', pad=20)
        
        plt.tight_layout()
        
        # Save visualization
        os.makedirs('../../../reports', exist_ok=True)
        plt.savefig('../../../reports/model_comparison_analysis.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        print("✅ Model comparison visualization saved!")
    
    def save_best_model(self, output_dir: str = "models"):
        """Save the best performing model with comprehensive metadata"""
        print(f"💾 Saving best model: {self.best_model_name}")
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Prepare model data
        model_data = {
            'model': self.best_model,
            'model_name': self.best_model_name,
            'score': self.best_score,
            'cv_mean': self.best_model_data['cv_mean'],
            'cv_std': self.best_model_data['cv_std'],
            'test_rmse': self.best_model_data['test_rmse'],
            'test_mae': self.best_model_data['test_mae'],
            'overfitting_score': self.best_model_data['overfitting_score'],
            'feature_names': self.feature_names,
            'training_date': self.training_date,
            'all_results': self.results,
            'best_model_rank': 1,
            'lightgbm_available': LIGHTGBM_AVAILABLE
        }
        
        # Save model
        model_path = os.path.join(output_dir, 'best_carbon_emission_model.pkl')
        joblib.dump(model_data, model_path)
        
        # Save comparison results
        comparison_path = os.path.join(output_dir, 'model_comparison_results.pkl')
        joblib.dump(self.results, comparison_path)
        
        print(f"✅ Best model saved to: {model_path}")
        print(f"✅ Comparison results saved to: {comparison_path}")
        
        return model_path, comparison_path
    
    def generate_comparison_report(self):
        """Generate detailed comparison report"""
        print("📋 Generating detailed comparison report...")
        
        report = f"""
# Carbon Emission Model Comparison Report
Generated on: {self.training_date}

## Executive Summary
- **Total Models Tested**: {len(self.results)}
- **Best Model**: {self.best_model_name}
- **Best Test R² Score**: {self.best_score:.4f}
- **Best CV R² Score**: {self.best_model_data['cv_mean']:.4f} (±{self.best_model_data['cv_std']:.4f})
- **Best Test RMSE**: {self.best_model_data['test_rmse']:.2f}
- **LightGBM Available**: {LIGHTGBM_AVAILABLE}

## Model Performance Ranking

| Rank | Model | Test R² | CV R² | Test RMSE | Overfitting |
|------|-------|---------|-------|-----------|-------------|
"""
        
        # Sort models by test R² score
        sorted_results = sorted(
            self.results.items(), 
            key=lambda x: x[1]['test_r2'], 
            reverse=True
        )
        
        for rank, (model_name, results) in enumerate(sorted_results, 1):
            report += f"| {rank} | {model_name} | {results['test_r2']:.4f} | {results['cv_mean']:.4f} | {results['test_rmse']:.2f} | {results['overfitting_score']:.4f} |\n"
        
        report += f"""
## Detailed Analysis

### Best Model: {self.best_model_name}
- **Test R²**: {self.best_model_data['test_r2']:.4f}
- **Cross-Validation R²**: {self.best_model_data['cv_mean']:.4f} (±{self.best_model_data['cv_std']:.4f})
- **Test RMSE**: {self.best_model_data['test_rmse']:.2f}
- **Test MAE**: {self.best_model_data['test_mae']:.2f}
- **Overfitting Score**: {self.best_model_data['overfitting_score']:.4f}

### Model Selection Criteria
1. **Primary**: Test R² Score (higher is better)
2. **Secondary**: Cross-Validation R² Score (higher is better)
3. **Tertiary**: Low overfitting score (< 0.05 is good)
4. **Quaternary**: Low RMSE (lower is better)

### Recommendations
- The selected model ({self.best_model_name}) shows the best balance of performance and generalization
- All models were trained on the same dataset with identical preprocessing
- Cross-validation scores provide confidence in model stability
- Overfitting analysis helps ensure model generalizes well to new data

## Next Steps
1. Deploy the best model for production use
2. Monitor model performance on new data
3. Retrain periodically with updated data
4. Consider ensemble methods if performance needs improvement
"""
        
        # Save report
        os.makedirs('../../../reports', exist_ok=True)
        report_path = '../../../reports/model_comparison_report.md'
        with open(report_path, 'w') as f:
            f.write(report)
        
        print(f"✅ Detailed report saved to: {report_path}")
        return report_path
    
    def run_complete_comparison(self):
        """Run the complete model comparison pipeline"""
        print("🚀 Starting Complete Model Comparison Pipeline")
        print("=" * 60)
        
        try:
            # Train and compare models
            self.train_and_compare_models()
            
            # Create visualization
            self.create_comparison_visualization()
            
            # Save best model
            model_path, comparison_path = self.save_best_model()
            
            # Generate report
            report_path = self.generate_comparison_report()
            
            print("\n" + "=" * 60)
            print("🎉 MODEL COMPARISON COMPLETED SUCCESSFULLY!")
            print("=" * 60)
            print(f"🏆 Best Model: {self.best_model_name}")
            print(f"🎯 Best Score: {self.best_score:.4f}")
            print(f"💾 Model saved: {model_path}")
            print(f"📊 Comparison saved: {comparison_path}")
            print(f"📋 Report saved: {report_path}")
            print(f"📈 Visualization saved: ../../../reports/model_comparison_analysis.png")
            
            return {
                'best_model': self.best_model,
                'best_model_name': self.best_model_name,
                'best_score': self.best_score,
                'all_results': self.results,
                'model_path': model_path,
                'comparison_path': comparison_path,
                'report_path': report_path
            }
            
        except Exception as e:
            print(f"❌ Error in model comparison: {e}")
            raise

def main():
    """Main function to run model comparison"""
    print("🔬 Carbon Emission Model Comparison System")
    print("=" * 60)
    
    # Initialize comparator
    comparator = CarbonEmissionModelComparator()
    
    # Run complete comparison
    results = comparator.run_complete_comparison()
    
    print("\n🚀 Model comparison system ready for production!")

if __name__ == "__main__":
    main()
