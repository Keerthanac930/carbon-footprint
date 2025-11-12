
# Carbon Emission Model Comparison Report
Generated on: 2025-11-05 13:10:19

## Executive Summary
- **Total Models Tested**: 12
- **Best Model**: Gradient Boosting
- **Best Test R² Score**: 0.9998
- **Best CV R² Score**: 0.9994 (±0.0005)
- **Best Test RMSE**: 857.82
- **LightGBM Available**: True

## Model Performance Ranking

| Rank | Model | Test R² | CV R² | Test RMSE | Overfitting |
|------|-------|---------|-------|-----------|-------------|
| 1 | Gradient Boosting | 0.9998 | 0.9994 | 857.82 | 0.0002 |
| 2 | Extra Trees | 0.9996 | 0.9993 | 1177.24 | 0.0004 |
| 3 | Random Forest | 0.9995 | 0.9986 | 1299.60 | 0.0003 |
| 4 | Decision Tree | 0.9994 | 0.9987 | 1437.16 | 0.0006 |
| 5 | LightGBM | 0.9979 | 0.9976 | 2601.87 | 0.0019 |
| 6 | XGBoost | 0.9975 | 0.9974 | 2799.64 | 0.0025 |
| 7 | Linear Regression | 0.9929 | 0.9929 | 4752.21 | 0.0001 |
| 8 | Ridge Regression | 0.9929 | 0.9929 | 4756.46 | 0.0001 |
| 9 | Lasso Regression | 0.9929 | 0.9929 | 4756.56 | 0.0001 |
| 10 | Elastic Net | 0.9920 | 0.9921 | 5049.96 | 0.0002 |
| 11 | K-Neighbors | 0.8939 | 0.8905 | 18372.39 | 0.0371 |
| 12 | SVR | 0.4555 | 0.3874 | 41628.83 | -0.0025 |

## Detailed Analysis

### Best Model: Gradient Boosting
- **Test R²**: 0.9998
- **Cross-Validation R²**: 0.9994 (±0.0005)
- **Test RMSE**: 857.82
- **Test MAE**: 86.71
- **Overfitting Score**: 0.0002

### Model Selection Criteria
1. **Primary**: Test R² Score (higher is better)
2. **Secondary**: Cross-Validation R² Score (higher is better)
3. **Tertiary**: Low overfitting score (< 0.05 is good)
4. **Quaternary**: Low RMSE (lower is better)

### Recommendations
- The selected model (Gradient Boosting) shows the best balance of performance and generalization
- All models were trained on the same dataset with identical preprocessing
- Cross-validation scores provide confidence in model stability
- Overfitting analysis helps ensure model generalizes well to new data

## Next Steps
1. Deploy the best model for production use
2. Monitor model performance on new data
3. Retrain periodically with updated data
4. Consider ensemble methods if performance needs improvement
