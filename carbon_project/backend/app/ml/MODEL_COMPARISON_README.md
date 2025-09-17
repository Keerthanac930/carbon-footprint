# Carbon Emission Model Comparison System

This system automatically trains multiple machine learning models and selects the best performing one for carbon emission prediction.

## 🚀 Quick Start

### Option 1: Run Model Comparison Directly
```bash
cd backend/app/ml
python run_model_comparison.py
```

### Option 2: Use Updated Training Script
```bash
cd backend/app/ml
python train_v3_minimal_updated.py
# Choose option 2 for full model comparison
```

### Option 3: Use the Comparison Class Directly
```python
from train_with_comparison import CarbonEmissionModelComparator

# Initialize and run comparison
comparator = CarbonEmissionModelComparator()
results = comparator.run_complete_comparison()
```

## 📊 Models Tested

The system compares **12 different machine learning algorithms**:

1. **Random Forest** - Ensemble method with multiple decision trees
2. **Extra Trees** - Extremely randomized trees ensemble
3. **Gradient Boosting** - Sequential ensemble learning
4. **XGBoost** - Extreme gradient boosting
5. **LightGBM** - Light gradient boosting machine
6. **Linear Regression** - Basic linear model
7. **Ridge Regression** - Linear with L2 regularization
8. **Lasso Regression** - Linear with L1 regularization
9. **Elastic Net** - Linear with L1 + L2 regularization
10. **SVR** - Support Vector Regression
11. **K-Neighbors** - K-nearest neighbors regression
12. **Decision Tree** - Single decision tree

## 🎯 Evaluation Metrics

Each model is evaluated using comprehensive metrics:

- **R² Score** (Primary) - Coefficient of determination
- **Cross-Validation R²** - 5-fold cross-validation score
- **RMSE** - Root Mean Square Error
- **MAE** - Mean Absolute Error
- **MAPE** - Mean Absolute Percentage Error
- **Overfitting Score** - Difference between train and test R²

## 🏆 Model Selection Criteria

Models are ranked by:
1. **Test R² Score** (higher is better)
2. **Cross-Validation R² Score** (higher is better)
3. **Low overfitting score** (< 0.05 is good)
4. **Low RMSE** (lower is better)

## 📈 Outputs Generated

### 1. Best Model
- **File**: `models/best_carbon_emission_model.pkl`
- Contains the best performing model with metadata

### 2. Comparison Results
- **File**: `models/model_comparison_results.pkl`
- Contains detailed results for all models

### 3. Visualization
- **File**: `reports/model_comparison_analysis.png`
- Comprehensive 6-panel visualization showing:
  - R² Score comparison
  - RMSE comparison
  - Overfitting analysis
  - Cross-validation scores with error bars
  - MAE vs RMSE scatter plot
  - Performance summary table

### 4. Detailed Report
- **File**: `reports/model_comparison_report.md`
- Markdown report with:
  - Executive summary
  - Model performance ranking
  - Detailed analysis
  - Recommendations

## 🔧 Configuration

### Data Path
Default: `../../../data/processed/v3_processed_carbon_data.csv`

### Model Parameters
All models use optimized hyperparameters for the carbon emission dataset:
- **Ensemble models**: 200 estimators, optimized depth
- **Linear models**: Standard regularization
- **Tree models**: Optimized depth and split criteria
- **SVR**: RBF kernel with optimized C and gamma

### Cross-Validation
- **Folds**: 5-fold cross-validation
- **Strategy**: KFold with shuffling
- **Random State**: 42 (for reproducibility)

## 📊 Performance Expectations

Based on the dataset characteristics:
- **Expected R² Score**: 0.85 - 0.98
- **Expected RMSE**: 200 - 800 kg CO2/year
- **Training Time**: 2-5 minutes (depending on hardware)
- **Best Model**: Usually XGBoost, LightGBM, or Random Forest

## 🚨 Troubleshooting

### Common Issues

1. **Memory Error**
   - Reduce dataset size in `load_and_prepare_data()`
   - Use fewer estimators in model configurations

2. **Import Error**
   - Install missing dependencies: `pip install lightgbm`
   - Check Python version compatibility

3. **Data Not Found**
   - Verify data path in `CarbonEmissionModelComparator()`
   - Ensure processed data exists

4. **Slow Performance**
   - Use fewer models in `get_model_configurations()`
   - Reduce cross-validation folds

### Performance Optimization

1. **For Speed**:
   - Use `train_v3_minimal_updated.py` with option 1
   - Reduces training time to under 10 seconds

2. **For Accuracy**:
   - Use full model comparison
   - Ensures best possible model selection

## 🔄 Integration with Existing Code

The comparison system integrates seamlessly with existing code:

```python
# Load the best model
import joblib
model_data = joblib.load('models/best_carbon_emission_model.pkl')
best_model = model_data['model']

# Use for predictions
predictions = best_model.predict(X_test)
```

## 📝 Example Usage

```python
from train_with_comparison import CarbonEmissionModelComparator

# Initialize comparator
comparator = CarbonEmissionModelComparator(
    data_path="path/to/your/data.csv"
)

# Run complete comparison
results = comparator.run_complete_comparison()

# Access results
print(f"Best model: {results['best_model_name']}")
print(f"Best score: {results['best_score']:.4f}")

# Use best model
best_model = results['best_model']
predictions = best_model.predict(X_new)
```

## 🎉 Benefits

1. **Automatic Selection**: No manual model tuning required
2. **Comprehensive Evaluation**: Multiple metrics ensure robust selection
3. **Visualization**: Clear understanding of model performance
4. **Reproducibility**: Consistent results with fixed random seeds
5. **Documentation**: Detailed reports for analysis and presentation
6. **Production Ready**: Best model ready for deployment

## 🔮 Future Enhancements

- **Hyperparameter Tuning**: Automated optimization for best models
- **Ensemble Methods**: Combine top-performing models
- **Feature Selection**: Automatic feature importance analysis
- **Model Monitoring**: Track performance over time
- **A/B Testing**: Compare model versions in production

---

**Note**: This system is designed for carbon emission prediction but can be adapted for other regression tasks by modifying the model configurations and evaluation metrics.
