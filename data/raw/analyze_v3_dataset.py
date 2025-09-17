import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_v3_dataset():
    """Analyze the new v3 dataset"""
    print("🔍 Analyzing residential_carbon_data_v3.csv...")
    
    # Load the dataset
    df = pd.read_csv("residential_carbon_data_v3.csv")
    
    print(f"�� Dataset Shape: {df.shape}")
    print(f"🎯 Features: {len(df.columns)}")
    print(f"�� Records: {len(df)}")
    
    # Display feature list
    print(f"\n📋 All Features:")
    for i, col in enumerate(df.columns, 1):
        print(f"  {i:2d}. {col}")
    
    # Check data types
    print(f"\n🔤 Data Types:")
    print(df.dtypes.value_counts())
    
    # Check for missing values
    print(f"\n⚠️  Missing Values:")
    missing_counts = df.isnull().sum()
    if missing_counts.sum() > 0:
        print(missing_counts[missing_counts > 0])
    else:
        print("✅ No missing values found!")
    
    # Separate numerical and categorical features
    numerical_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(include=['object']).columns
    
    print(f"\n Numerical Features: {len(numerical_cols)}")
    print(f"🔤 Categorical Features: {len(categorical_cols)}")
    
    # Target variable analysis
    print(f"\n🎯 Target Variable Analysis:")
    print(f"  Target: total_carbon_footprint")
    print(f"  Range: {df['total_carbon_footprint'].min():.2f} - {df['total_carbon_footprint'].max():.2f}")
    print(f"  Mean: {df['total_carbon_footprint'].mean():.2f}")
    print(f"  Std: {df['total_carbon_footprint'].std():.2f}")
    
    # Feature correlation with target (numerical features only)
    if len(numerical_cols) > 1:  # Need at least 2 numerical columns for correlation
        print(f"\n🔗 Top 15 Numerical Features by Correlation with Carbon Footprint:")
        numerical_df = df[numerical_cols]
        correlations = numerical_df.corr()['total_carbon_footprint'].abs().sort_values(ascending=False)
        print(correlations.head(16))  # Top 15 + target itself
    
    # Categorical features analysis
    if len(categorical_cols) > 0:
        print(f"\n🔤 Categorical Features Analysis:")
        for col in categorical_cols:
            print(f"  {col}: {df[col].nunique()} unique values")
            print(f"    Values: {df[col].unique()}")
            print(f"    Sample distribution:")
            value_counts = df[col].value_counts().head(5)
            for value, count in value_counts.items():
                print(f"      {value}: {count} ({count/len(df)*100:.1f}%)")
            print()
    
    # Numerical features analysis
    if len(numerical_cols) > 0:
        print(f"\n Numerical Features Analysis:")
        print(f"  Total numerical features: {len(numerical_cols)}")
        
        # Basic statistics for numerical features
        print(f"\n Numerical Features Statistics:")
        print(df[numerical_cols].describe())
    
    # Check for potential issues
    print(f"\n Data Quality Check:")
    
    # Check for infinite values in numerical features
    if len(numerical_cols) > 0:
        inf_counts = np.isinf(df[numerical_cols]).sum().sum()
        print(f"  Infinite values: {inf_counts}")
    
    # Check for negative values in positive-only features
    positive_features = ['household_size', 'home_size_sqft', 'heating_days', 'cooling_days']
    for feature in positive_features:
        if feature in df.columns:
            negative_count = (df[feature] < 0).sum()
            if negative_count > 0:
                print(f"  ⚠️  {feature}: {negative_count} negative values")
    
    # Check unique values in categorical features
    print(f"\n🔤 Categorical Features Unique Values:")
    for col in categorical_cols:
        unique_count = df[col].nunique()
        print(f"  {col}: {unique_count} unique values")
        if unique_count < 10:  # Show all values if few unique values
            print(f"    Values: {list(df[col].unique())}")
    
    # Sample data preview
    print(f"\n📋 Sample Data Preview:")
    print(df.head())
    
    # Save analysis report
    print(f"\n✅ Analysis complete! Dataset is ready for preprocessing.")
    print(f"🎯 Key findings:")
    print(f"  - Dataset has {len(df.columns)} features")
    print(f"  - {len(numerical_cols)} numerical features")
    print(f"  - {len(categorical_cols)} categorical features")
    print(f"  - {len(df)} total records")
    
    return df

if __name__ == "__main__":
    df = analyze_v3_dataset()
