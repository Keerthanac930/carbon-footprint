"""
Generate comprehensive graphs for Results and Discussion section
Creates professional visualizations for model performance, predictions, and analysis
"""

import pandas as pd
import numpy as np
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.model_selection import cross_val_score, KFold
import warnings
warnings.filterwarnings('ignore')

# Set matplotlib backend for non-interactive use
try:
    plt.switch_backend('Agg')
    print("Using fast matplotlib backend")
except:
    pass

# Set style for professional-looking plots
try:
    plt.style.use('seaborn-v0_8-darkgrid')
except:
    try:
        plt.style.use('seaborn-darkgrid')
    except:
        plt.style.use('ggplot')
sns.set_palette("husl")

class ResultsDiscussionGraphGenerator:
    """Generate comprehensive graphs for Results and Discussion section"""
    
    def __init__(self, 
                 model_path: str = None,
                 data_path: str = None,
                 output_dir: str = None):
        # Set default paths relative to this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        if model_path is None:
            # Try multiple possible model paths
            possible_paths = [
                os.path.join(script_dir, "models", "v3_carbon_emission_model_minimal.pkl"),
                os.path.join(script_dir, "models", "best_carbon_emission_model.pkl"),
                os.path.join(script_dir, "..", "..", "models", "v3_carbon_emission_model_minimal.pkl"),
                os.path.join(script_dir, "..", "..", "..", "models", "v3_carbon_emission_model_minimal.pkl"),
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    model_path = path
                    break
            if model_path is None:
                model_path = possible_paths[0]  # Default to first path
        
        if data_path is None:
            # Try multiple possible data paths
            possible_paths = [
                os.path.join(script_dir, "..", "..", "..", "..", "data", "processed", "v3_processed_carbon_data.csv"),
                os.path.join(script_dir, "..", "..", "..", "data", "processed", "v3_processed_carbon_data.csv"),
                os.path.join(script_dir, "..", "..", "data", "processed", "v3_processed_carbon_data.csv"),
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    data_path = path
                    break
            if data_path is None:
                data_path = possible_paths[0]  # Default to first path
        
        if output_dir is None:
            output_dir = os.path.join(script_dir, "..", "..", "..", "..", "reports", "results_discussion")
        
        self.model_path = model_path
        self.data_path = data_path
        self.output_dir = output_dir
        self.model_data = None
        self.model = None
        self.feature_names = None
        self.X = None
        self.y = None
        self.y_pred = None
        
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
        
    def load_model_and_data(self):
        """Load the trained model and dataset"""
        print("Loading model and data...")
        
        # Load model
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found: {self.model_path}")
        
        self.model_data = joblib.load(self.model_path)
        self.model = self.model_data['model']
        self.feature_names = self.model_data.get('feature_names', [])
        
        print(f"Model loaded: {self.model_data.get('model_name', 'Unknown Model')}")
        
        # Load data
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data not found: {self.data_path}")
        
        df = pd.read_csv(self.data_path)
        self.X = df.drop(columns=['total_carbon_footprint'])
        self.y = df['total_carbon_footprint']
        
        print(f"Data loaded: {self.X.shape}")
        
        # Align features with model expectations
        print("Aligning features with model...")
        expected_features = self.feature_names if self.feature_names else list(self.X.columns)
        available_features = list(self.X.columns)
        
        # Create aligned dataframe
        X_aligned = pd.DataFrame(index=self.X.index)
        
        # Add features that exist in both
        for feature in expected_features:
            if feature in available_features:
                X_aligned[feature] = self.X[feature]
            else:
                # Add missing feature with default value (median or 0)
                X_aligned[feature] = 0
                print(f"  Warning: Missing feature '{feature}', using default value 0")
        
        # Remove features that model doesn't expect but data has
        missing_in_data = set(expected_features) - set(available_features)
        if missing_in_data:
            print(f"  Missing features in data: {missing_in_data}")
        
        self.X = X_aligned[expected_features]  # Ensure correct order
        
        print(f"Features aligned: {self.X.shape}")
        
        # Make predictions
        print("Making predictions...")
        try:
            # Try with feature validation disabled for XGBoost
            if hasattr(self.model, 'set_params'):
                self.y_pred = self.model.predict(self.X, validate_features=False)
            else:
                self.y_pred = self.model.predict(self.X)
        except TypeError:
            # If validate_features not supported, try without it
            self.y_pred = self.model.predict(self.X)
        
        return self.X, self.y, self.y_pred
    
    def create_model_performance_comparison(self):
        """Create model performance comparison chart"""
        print("Creating Model Performance Comparison Chart...")
        
        # Load model comparison results if available
        script_dir = os.path.dirname(os.path.abspath(__file__))
        comparison_paths = [
            os.path.join(script_dir, "models", "model_comparison_results.pkl"),
            os.path.join(script_dir, "..", "..", "models", "model_comparison_results.pkl"),
        ]
        
        comparison_path = None
        for path in comparison_paths:
            if os.path.exists(path):
                comparison_path = path
                break
        
        if comparison_path and os.path.exists(comparison_path):
            results = joblib.load(comparison_path)
            
            # Extract model names and metrics
            models = []
            r2_scores = []
            rmse_scores = []
            mae_scores = []
            
            for model_name, metrics in results.items():
                models.append(model_name)
                r2_scores.append(metrics.get('test_r2', 0))
                rmse_scores.append(metrics.get('test_rmse', 0))
                mae_scores.append(metrics.get('test_mae', 0))
            
            # Sort by R² score
            sorted_data = sorted(zip(models, r2_scores, rmse_scores, mae_scores), 
                                key=lambda x: x[1], reverse=True)
            models, r2_scores, rmse_scores, mae_scores = zip(*sorted_data)
            
            # Create figure with subplots
            fig, axes = plt.subplots(1, 3, figsize=(18, 6))
            
            # 1. R² Score Comparison
            colors = ['#2ecc71' if i == 0 else '#3498db' for i in range(len(models))]
            bars1 = axes[0].barh(range(len(models)), r2_scores, color=colors)
            axes[0].set_yticks(range(len(models)))
            axes[0].set_yticklabels(models, fontsize=9)
            axes[0].set_xlabel('R² Score', fontsize=11, fontweight='bold')
            axes[0].set_title('Model Performance: R² Score Comparison', 
                           fontsize=12, fontweight='bold')
            axes[0].grid(True, alpha=0.3, axis='x')
            axes[0].set_xlim([0, 1.1])
            
            # Add value labels on bars
            for i, (bar, score) in enumerate(zip(bars1, r2_scores)):
                axes[0].text(score + 0.01, i, f'{score:.4f}', 
                           va='center', fontsize=8)
            
            # 2. RMSE Comparison
            bars2 = axes[1].barh(range(len(models)), rmse_scores, color=colors)
            axes[1].set_yticks(range(len(models)))
            axes[1].set_yticklabels(models, fontsize=9)
            axes[1].set_xlabel('RMSE (kg CO₂/year)', fontsize=11, fontweight='bold')
            axes[1].set_title('Model Performance: RMSE Comparison', 
                            fontsize=12, fontweight='bold')
            axes[1].grid(True, alpha=0.3, axis='x')
            
            # Add value labels on bars
            for i, (bar, score) in enumerate(zip(bars2, rmse_scores)):
                axes[1].text(score + max(rmse_scores) * 0.02, i, f'{score:.2f}', 
                           va='center', fontsize=8)
            
            # 3. MAE Comparison
            bars3 = axes[2].barh(range(len(models)), mae_scores, color=colors)
            axes[2].set_yticks(range(len(models)))
            axes[2].set_yticklabels(models, fontsize=9)
            axes[2].set_xlabel('MAE (kg CO₂/year)', fontsize=11, fontweight='bold')
            axes[2].set_title('Model Performance: MAE Comparison', 
                            fontsize=12, fontweight='bold')
            axes[2].grid(True, alpha=0.3, axis='x')
            
            # Add value labels on bars
            for i, (bar, score) in enumerate(zip(bars3, mae_scores)):
                axes[2].text(score + max(mae_scores) * 0.02, i, f'{score:.2f}', 
                           va='center', fontsize=8)
            
            plt.tight_layout()
            output_path = os.path.join(self.output_dir, '1_model_performance_comparison.png')
            plt.savefig(output_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            print(f"Saved: {output_path}")
        else:
            print("Model comparison results not found. Skipping this graph.")
    
    def create_actual_vs_predicted(self):
        """Create actual vs predicted scatter plot"""
        print("Creating Actual vs Predicted Plot...")
        
        fig, ax = plt.subplots(figsize=(10, 8))
        
        # Sample data if too large for faster plotting
        if len(self.y) > 10000:
            sample_idx = np.random.choice(len(self.y), 10000, replace=False)
            y_sample = self.y.iloc[sample_idx] if hasattr(self.y, 'iloc') else self.y[sample_idx]
            y_pred_sample = self.y_pred[sample_idx]
        else:
            y_sample = self.y
            y_pred_sample = self.y_pred
        
        # Scatter plot
        ax.scatter(y_sample, y_pred_sample, alpha=0.5, s=20, color='#3498db', edgecolors='none')
        
        # Perfect prediction line
        min_val = min(y_sample.min(), y_pred_sample.min())
        max_val = max(y_sample.max(), y_pred_sample.max())
        ax.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2, label='Perfect Prediction')
        
        # Calculate R²
        r2 = r2_score(y_sample, y_pred_sample)
        
        # Add R² text
        ax.text(0.05, 0.95, f'R² = {r2:.4f}', transform=ax.transAxes,
               fontsize=14, fontweight='bold', verticalalignment='top',
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
        
        ax.set_xlabel('Actual Carbon Footprint (kg CO₂/year)', fontsize=12, fontweight='bold')
        ax.set_ylabel('Predicted Carbon Footprint (kg CO₂/year)', fontsize=12, fontweight='bold')
        ax.set_title('Actual vs Predicted Carbon Footprint', fontsize=14, fontweight='bold')
        ax.legend(fontsize=11)
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, '2_actual_vs_predicted.png')
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Saved: {output_path}")
    
    def create_residuals_analysis(self):
        """Create residuals analysis plots"""
        print("Creating Residuals Analysis Plots...")
        
        residuals = self.y - self.y_pred
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 12))
        
        # Sample if needed
        if len(residuals) > 10000:
            sample_idx = np.random.choice(len(residuals), 10000, replace=False)
            residuals_sample = residuals.iloc[sample_idx] if hasattr(residuals, 'iloc') else residuals[sample_idx]
            y_pred_sample = self.y_pred[sample_idx]
        else:
            residuals_sample = residuals
            y_pred_sample = self.y_pred
        
        # 1. Residuals vs Predicted
        axes[0, 0].scatter(y_pred_sample, residuals_sample, alpha=0.5, s=20, color='#e74c3c')
        axes[0, 0].axhline(y=0, color='black', linestyle='--', lw=2)
        axes[0, 0].set_xlabel('Predicted Values (kg CO₂/year)', fontsize=11, fontweight='bold')
        axes[0, 0].set_ylabel('Residuals (kg CO₂/year)', fontsize=11, fontweight='bold')
        axes[0, 0].set_title('Residuals vs Predicted Values', fontsize=12, fontweight='bold')
        axes[0, 0].grid(True, alpha=0.3)
        
        # 2. Residuals Distribution
        axes[0, 1].hist(residuals, bins=50, alpha=0.7, color='#9b59b6', edgecolor='black')
        axes[0, 1].axvline(x=0, color='red', linestyle='--', lw=2)
        axes[0, 1].set_xlabel('Residuals (kg CO₂/year)', fontsize=11, fontweight='bold')
        axes[0, 1].set_ylabel('Frequency', fontsize=11, fontweight='bold')
        axes[0, 1].set_title('Residuals Distribution', fontsize=12, fontweight='bold')
        axes[0, 1].grid(True, alpha=0.3)
        
        # Add statistics
        mean_res = residuals.mean()
        std_res = residuals.std()
        axes[0, 1].text(0.05, 0.95, f'Mean: {mean_res:.2f}\nStd: {std_res:.2f}', 
                       transform=axes[0, 1].transAxes, fontsize=10,
                       verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
        
        # 3. Q-Q Plot
        try:
            from scipy import stats
            stats.probplot(residuals, dist="norm", plot=axes[1, 0])
            axes[1, 0].set_title('Q-Q Plot (Normality Test)', fontsize=12, fontweight='bold')
        except ImportError:
            # If scipy not available, show residual distribution instead
            axes[1, 0].hist(residuals, bins=50, alpha=0.7, color='#3498db', edgecolor='black')
            axes[1, 0].axvline(x=0, color='red', linestyle='--', lw=2)
            axes[1, 0].set_xlabel('Residuals (kg CO₂/year)', fontsize=11, fontweight='bold')
            axes[1, 0].set_ylabel('Frequency', fontsize=11, fontweight='bold')
            axes[1, 0].set_title('Residuals Distribution (Alternative)', fontsize=12, fontweight='bold')
        axes[1, 0].grid(True, alpha=0.3)
        
        # 4. Error Percentage Distribution
        error_percentage = (residuals / self.y) * 100
        axes[1, 1].hist(error_percentage, bins=50, alpha=0.7, color='#f39c12', edgecolor='black')
        axes[1, 1].axvline(x=0, color='red', linestyle='--', lw=2)
        axes[1, 1].set_xlabel('Error Percentage (%)', fontsize=11, fontweight='bold')
        axes[1, 1].set_ylabel('Frequency', fontsize=11, fontweight='bold')
        axes[1, 1].set_title('Error Percentage Distribution', fontsize=12, fontweight='bold')
        axes[1, 1].grid(True, alpha=0.3)
        
        # Add statistics
        mean_err = error_percentage.mean()
        std_err = error_percentage.std()
        axes[1, 1].text(0.05, 0.95, f'Mean: {mean_err:.2f}%\nStd: {std_err:.2f}%', 
                       transform=axes[1, 1].transAxes, fontsize=10,
                       verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, '3_residuals_analysis.png')
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Saved: {output_path}")
    
    def create_feature_importance(self):
        """Create feature importance visualization"""
        print("Creating Feature Importance Chart...")
        
        # Get feature importance
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
            feature_imp_df = pd.DataFrame({
                'feature': self.feature_names,
                'importance': importances
            }).sort_values('importance', ascending=False)
            
            # Top 20 features
            top_features = feature_imp_df.head(20)
            
            fig, ax = plt.subplots(figsize=(12, 10))
            
            bars = ax.barh(range(len(top_features)), top_features['importance'], 
                          color='#16a085', alpha=0.8)
            ax.set_yticks(range(len(top_features)))
            ax.set_yticklabels(top_features['feature'], fontsize=10)
            ax.set_xlabel('Feature Importance', fontsize=12, fontweight='bold')
            ax.set_title('Top 20 Most Important Features', fontsize=14, fontweight='bold')
            ax.invert_yaxis()
            ax.grid(True, alpha=0.3, axis='x')
            
            # Add value labels
            for i, (bar, imp) in enumerate(zip(bars, top_features['importance'])):
                ax.text(imp + max(top_features['importance']) * 0.01, i, 
                       f'{imp:.4f}', va='center', fontsize=8)
            
            plt.tight_layout()
            output_path = os.path.join(self.output_dir, '4_feature_importance.png')
            plt.savefig(output_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            print(f"Saved: {output_path}")
        else:
            print("Feature importance not available for this model")
    
    def create_cross_validation_results(self):
        """Create cross-validation results visualization"""
        print("Creating Cross-Validation Results Chart...")
        
        # Perform cross-validation
        cv = KFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(self.model, self.X, self.y, cv=cv, scoring='r2')
        
        fig, axes = plt.subplots(1, 2, figsize=(14, 6))
        
        # 1. CV Scores Bar Chart
        fold_names = [f'Fold {i+1}' for i in range(len(cv_scores))]
        colors = ['#3498db' for _ in range(len(cv_scores))]
        bars = axes[0].bar(fold_names, cv_scores, color=colors, alpha=0.8, edgecolor='black')
        axes[0].axhline(y=cv_scores.mean(), color='red', linestyle='--', lw=2, 
                       label=f'Mean: {cv_scores.mean():.4f}')
        axes[0].set_ylabel('R² Score', fontsize=11, fontweight='bold')
        axes[0].set_title('Cross-Validation Scores (5-Fold)', fontsize=12, fontweight='bold')
        axes[0].set_ylim([0, 1.1])
        axes[0].legend(fontsize=10)
        axes[0].grid(True, alpha=0.3, axis='y')
        
        # Add value labels
        for bar, score in zip(bars, cv_scores):
            axes[0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
                        f'{score:.4f}', ha='center', fontsize=9, fontweight='bold')
        
        # 2. CV Scores with Error Bars
        mean_score = cv_scores.mean()
        std_score = cv_scores.std()
        
        axes[1].bar(['Mean CV Score'], [mean_score], color='#2ecc71', alpha=0.8, 
                   edgecolor='black', yerr=std_score, capsize=10)
        axes[1].set_ylabel('R² Score', fontsize=11, fontweight='bold')
        axes[1].set_title('Cross-Validation: Mean Score with Std Dev', 
                         fontsize=12, fontweight='bold')
        axes[1].set_ylim([0, 1.1])
        axes[1].grid(True, alpha=0.3, axis='y')
        
        # Add text
        axes[1].text(0, mean_score + 0.05, 
                    f'Mean: {mean_score:.4f}\nStd: {std_score:.4f}\nRange: [{cv_scores.min():.4f}, {cv_scores.max():.4f}]',
                    ha='center', fontsize=10, fontweight='bold',
                    bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, '5_cross_validation_results.png')
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Saved: {output_path}")
    
    def create_performance_metrics_summary(self):
        """Create comprehensive performance metrics summary"""
        print("Creating Performance Metrics Summary...")
        
        # Calculate all metrics
        r2 = r2_score(self.y, self.y_pred)
        mae = mean_absolute_error(self.y, self.y_pred)
        rmse = np.sqrt(mean_squared_error(self.y, self.y_pred))
        mape = np.mean(np.abs((self.y - self.y_pred) / self.y)) * 100
        
        # Cross-validation
        cv = KFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(self.model, self.X, self.y, cv=cv, scoring='r2')
        
        # Create figure
        fig, ax = plt.subplots(figsize=(10, 8))
        ax.axis('off')
        
        # Create metrics table
        metrics_data = [
            ['Metric', 'Value'],
            ['Model Name', self.model_data.get('model_name', 'Unknown Model')],
            ['R² Score', f'{r2:.4f}'],
            ['CV R² Score (Mean)', f'{cv_scores.mean():.4f}'],
            ['CV R² Score (Std)', f'{cv_scores.std():.4f}'],
            ['RMSE', f'{rmse:.2f} kg CO₂/year'],
            ['MAE', f'{mae:.2f} kg CO₂/year'],
            ['MAPE', f'{mape:.2f}%'],
            ['Number of Features', f'{len(self.feature_names)}'],
            ['Training Date', self.model_data.get('training_date', 'Unknown')],
            ['Dataset Size', f'{len(self.y):,} samples']
        ]
        
        table = ax.table(cellText=metrics_data[1:], colLabels=metrics_data[0],
                        cellLoc='center', loc='center',
                        colWidths=[0.5, 0.5])
        table.auto_set_font_size(False)
        table.set_fontsize(11)
        table.scale(1, 2)
        
        # Style the table
        for i in range(len(metrics_data[0])):
            table[(0, i)].set_facecolor('#34495e')
            table[(0, i)].set_text_props(weight='bold', color='white')
        
        # Alternate row colors
        for i in range(1, len(metrics_data)):
            for j in range(len(metrics_data[0])):
                if i % 2 == 0:
                    table[(i, j)].set_facecolor('#ecf0f1')
        
        ax.set_title('Model Performance Metrics Summary', 
                    fontsize=16, fontweight='bold', pad=20)
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, '6_performance_metrics_summary.png')
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Saved: {output_path}")
    
    def create_error_distribution_by_magnitude(self):
        """Create error distribution by magnitude of carbon footprint"""
        print("Creating Error Distribution by Magnitude...")
        
        residuals = self.y - self.y_pred
        error_percentage = (residuals / self.y) * 100
        
        # Categorize by carbon footprint magnitude
        bins = [0, 5000, 10000, 20000, 50000, float('inf')]
        labels = ['0-5k', '5k-10k', '10k-20k', '20k-50k', '50k+']
        y_df = pd.DataFrame({'y': self.y, 'error_percentage': error_percentage})
        y_df['category'] = pd.cut(y_df['y'], bins=bins, labels=labels)
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 12))
        
        # 1. Error by category (box plot)
        category_errors = [y_df[y_df['category'] == cat]['error_percentage'].values 
                          for cat in labels]
        bp = axes[0, 0].boxplot(category_errors, labels=labels, patch_artist=True)
        for patch in bp['boxes']:
            patch.set_facecolor('#3498db')
            patch.set_alpha(0.7)
        axes[0, 0].axhline(y=0, color='red', linestyle='--', lw=2)
        axes[0, 0].set_xlabel('Carbon Footprint Category (kg CO₂/year)', 
                            fontsize=11, fontweight='bold')
        axes[0, 0].set_ylabel('Error Percentage (%)', fontsize=11, fontweight='bold')
        axes[0, 0].set_title('Error Distribution by Carbon Footprint Magnitude', 
                           fontsize=12, fontweight='bold')
        axes[0, 0].grid(True, alpha=0.3, axis='y')
        
        # 2. Mean absolute error by category
        mean_errors = [np.abs(y_df[y_df['category'] == cat]['error_percentage']).mean() 
                      for cat in labels]
        bars = axes[0, 1].bar(labels, mean_errors, color='#e74c3c', alpha=0.8, edgecolor='black')
        axes[0, 1].set_xlabel('Carbon Footprint Category (kg CO₂/year)', 
                            fontsize=11, fontweight='bold')
        axes[0, 1].set_ylabel('Mean Absolute Error (%)', fontsize=11, fontweight='bold')
        axes[0, 1].set_title('Mean Absolute Error by Category', 
                           fontsize=12, fontweight='bold')
        axes[0, 1].grid(True, alpha=0.3, axis='y')
        
        # Add value labels
        for bar, err in zip(bars, mean_errors):
            axes[0, 1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(mean_errors) * 0.02,
                           f'{err:.2f}%', ha='center', fontsize=9, fontweight='bold')
        
        # 3. Sample count by category
        sample_counts = [len(y_df[y_df['category'] == cat]) for cat in labels]
        bars = axes[1, 0].bar(labels, sample_counts, color='#9b59b6', alpha=0.8, edgecolor='black')
        axes[1, 0].set_xlabel('Carbon Footprint Category (kg CO₂/year)', 
                            fontsize=11, fontweight='bold')
        axes[1, 0].set_ylabel('Number of Samples', fontsize=11, fontweight='bold')
        axes[1, 0].set_title('Sample Distribution by Category', 
                           fontsize=12, fontweight='bold')
        axes[1, 0].grid(True, alpha=0.3, axis='y')
        
        # Add value labels
        for bar, count in zip(bars, sample_counts):
            axes[1, 0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(sample_counts) * 0.02,
                           f'{count:,}', ha='center', fontsize=9, fontweight='bold')
        
        # 4. R² by category
        r2_by_category = []
        for cat in labels:
            mask = y_df['category'] == cat
            if mask.sum() > 0:
                r2_cat = r2_score(self.y[mask], self.y_pred[mask])
                r2_by_category.append(r2_cat)
            else:
                r2_by_category.append(0)
        
        bars = axes[1, 1].bar(labels, r2_by_category, color='#2ecc71', alpha=0.8, edgecolor='black')
        axes[1, 1].set_xlabel('Carbon Footprint Category (kg CO₂/year)', 
                            fontsize=11, fontweight='bold')
        axes[1, 1].set_ylabel('R² Score', fontsize=11, fontweight='bold')
        axes[1, 1].set_title('R² Score by Category', fontsize=12, fontweight='bold')
        axes[1, 1].set_ylim([0, 1.1])
        axes[1, 1].grid(True, alpha=0.3, axis='y')
        
        # Add value labels
        for bar, r2_val in zip(bars, r2_by_category):
            axes[1, 1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
                           f'{r2_val:.4f}', ha='center', fontsize=9, fontweight='bold')
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, '7_error_distribution_by_magnitude.png')
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Saved: {output_path}")
    
    def generate_all_graphs(self):
        """Generate all graphs for Results and Discussion section"""
        print("=" * 60)
        print("Generating Graphs for Results and Discussion Section")
        print("=" * 60)
        
        try:
            # Load model and data
            self.load_model_and_data()
            
            # Generate all graphs
            self.create_model_performance_comparison()
            self.create_actual_vs_predicted()
            self.create_residuals_analysis()
            self.create_feature_importance()
            self.create_cross_validation_results()
            self.create_performance_metrics_summary()
            self.create_error_distribution_by_magnitude()
            
            print("\n" + "=" * 60)
            print("All graphs generated successfully!")
            print("=" * 60)
            print(f"Output directory: {os.path.abspath(self.output_dir)}")
            print("\nGenerated files:")
            print("  1. model_performance_comparison.png")
            print("  2. actual_vs_predicted.png")
            print("  3. residuals_analysis.png")
            print("  4. feature_importance.png")
            print("  5. cross_validation_results.png")
            print("  6. performance_metrics_summary.png")
            print("  7. error_distribution_by_magnitude.png")
            print("=" * 60)
            
        except Exception as e:
            print(f"Error generating graphs: {e}")
            import traceback
            traceback.print_exc()
            raise

if __name__ == "__main__":
    # Create generator instance
    generator = ResultsDiscussionGraphGenerator()
    
    # Generate all graphs
    generator.generate_all_graphs()

