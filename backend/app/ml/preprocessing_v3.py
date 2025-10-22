import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler, RobustScaler
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import SelectKBest, f_regression, mutual_info_regression
import pickle
import os
from typing import Tuple, Dict, Any
import warnings
warnings.filterwarnings('ignore')

class V3CarbonDataPreprocessor:
    """
    Preprocessing pipeline for residential_carbon_data_v3.csv
    Optimized for achieving R² > 0.98
    """
    
    def __init__(self, data_path: str = None):
        self.data_path = data_path
        self.label_encoders = {}
        self.scalers = {}
        self.feature_selector = None
        self.selected_features = None
        self.feature_importance = None
        
    def load_data(self, data_path: str = None) -> pd.DataFrame:
        """Load the v3 dataset"""
        if data_path:
            self.data_path = data_path
        
        if not self.data_path or not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file not found: {self.data_path}")
        
        df = pd.read_csv(self.data_path)
        print(f"✅ V3 dataset loaded: {df.shape}")
        print(f"�� Features: {list(df.columns)}")
        return df
    
    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle any missing values in the dataset"""
        missing_counts = df.isnull().sum()
        if missing_counts.sum() > 0:
            print(f"⚠️  Missing values found: {missing_counts[missing_counts > 0]}")
            
            # Fill missing values with appropriate strategies
            for col in df.columns:
                if df[col].dtype in ['int64', 'float64']:
                    df[col].fillna(df[col].median(), inplace=True)
                else:
                    df[col].fillna(df[col].mode()[0], inplace=True)
        else:
            print("✅ No missing values found")
        
        return df
    
    def handle_outliers(self, df: pd.DataFrame, method: str = 'iqr') -> pd.DataFrame:
        """Handle outliers using IQR method"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        numeric_cols = [col for col in numeric_cols if col != 'total_carbon_footprint']
        
        if method == 'iqr':
            for col in numeric_cols:
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                # Cap outliers instead of removing them
                df[col] = np.clip(df[col], lower_bound, upper_bound)
        
        print("✅ Outliers handled using IQR method")
        return df
    
    def encode_categorical_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical features using Label Encoding"""
        categorical_cols = df.select_dtypes(include=['object']).columns
        
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            self.label_encoders[col] = le
            print(f"🔤 Encoded: {col}")
        
        return df
    
    def create_v3_interaction_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create interaction features specific to v3 dataset"""
        print("🔗 Creating V3 interaction features...")
        
        # Energy-related interactions
        df['electricity_heating_interaction'] = df['electricity_usage_kwh'] * df['heating_efficiency']
        df['cooling_heating_interaction'] = df['cooling_efficiency'] * df['heating_efficiency']
        
        # Transportation interactions
        df['vehicle_distance_efficiency'] = df['vehicle_monthly_distance_km'] * df['fuel_efficiency']
        df['transport_household_interaction'] = df['vehicles_per_household'] * df['vehicle_monthly_distance_km']
        
        # Waste interactions
        df['waste_recycling_synergy'] = df['recycling_rate'] * df['composting_rate']
        df['waste_household_interaction'] = df['waste_per_person'] * df['household_size']
        
        # Lifestyle interactions
        df['meat_travel_interaction'] = df['meat_consumption'] * df['air_travel_hours']
        df['shopping_lifestyle_impact'] = df['shopping_frequency'] * df['lifestyle_impact_score']
        
        # Home efficiency interactions
        df['home_size_efficiency'] = df['home_size_sqft'] * df['home_efficiency']
        df['climate_efficiency_synergy'] = df['climate_impact_factor'] * df['heating_efficiency']
        
        print(f"✅ {len([col for col in df.columns if 'interaction' in col or 'synergy' in col])} interaction features created")
        return df
    
    def create_v3_polynomial_features(self, df: pd.DataFrame, degree: int = 2) -> pd.DataFrame:
        """Create polynomial features for key numerical variables"""
        key_features = ['household_size', 'home_size_sqft', 'heating_days', 'cooling_days', 'electricity_usage_kwh']
        
        for feature in key_features:
            if feature in df.columns:
                for d in range(2, degree + 1):
                    df[f'{feature}_power_{d}'] = df[feature] ** d
        
        print(f"✅ Polynomial features created (degree {degree})")
        return df
    
    def create_v3_ratio_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create ratio features for v3 dataset"""
        print("📊 Creating V3 ratio features...")
        
        # Efficiency ratios
        df['electricity_per_person_ratio'] = df['electricity_usage_kwh'] / (df['household_size'] + 1)
        df['carbon_to_efficiency_ratio'] = df['total_carbon_footprint'] / (df['home_efficiency'] + 0.1)
        
        # Transportation ratios
        df['fuel_to_distance_ratio'] = df['fuel_usage_liters'] / (df['vehicle_monthly_distance_km'] + 1)
        df['vehicles_to_household_ratio'] = df['vehicles_per_household'] / (df['household_size'] + 1)
        
        # Waste ratios
        df['waste_to_recycling_ratio'] = df['waste_per_person'] / (df['recycling_rate'] + 0.1)
        
        # Energy ratios
        df['heating_to_cooling_ratio'] = df['heating_days'] / (df['cooling_days'] + 1)
        
        print(f"✅ {len([col for col in df.columns if 'ratio' in col])} ratio features created")
        return df
    
    def scale_features(self, df: pd.DataFrame, method: str = 'robust') -> pd.DataFrame:
        """Scale numerical features"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        numeric_cols = [col for col in numeric_cols if col != 'total_carbon_footprint']
        
        if method == 'robust':
            scaler = RobustScaler()
        else:
            scaler = StandardScaler()
        
        df_scaled = df.copy()
        df_scaled[numeric_cols] = scaler.fit_transform(df[numeric_cols])
        self.scalers['features'] = scaler
        
        print(f"✅ Features scaled using {method} scaling")
        return df_scaled
    
    def select_best_features(self, df: pd.DataFrame, target_col: str = 'total_carbon_footprint', 
                           method: str = 'mutual_info', k: int = 45) -> pd.DataFrame:
        """Select the best features for modeling"""
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        if method == 'mutual_info':
            selector = SelectKBest(score_func=mutual_info_regression, k=k)
        else:
            selector = SelectKBest(score_func=f_regression, k=k)
        
        X_selected = selector.fit_transform(X, y)
        selected_features = X.columns[selector.get_support()].tolist()
        
        self.feature_selector = selector
        self.selected_features = selected_features
        
        # Calculate feature importance scores
        scores = selector.scores_[selector.get_support()]
        self.feature_importance = dict(zip(selected_features, scores))
        
        # Create DataFrame with selected features
        df_selected = df[selected_features + [target_col]]
        
        print(f"✅ Selected {len(selected_features)} best features")
        print("�� Top 20 features by importance:")
        sorted_features = sorted(self.feature_importance.items(), key=lambda x: x[1], reverse=True)
        for i, (feature, score) in enumerate(sorted_features[:20]):
            print(f"  {i+1:2d}. {feature}: {score:.4f}")
        
        return df_selected
    
    def prepare_final_dataset(self, df: pd.DataFrame, target_col: str = 'total_carbon_footprint') -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Prepare final dataset for training"""
        # Ensure target column is last
        feature_cols = [col for col in df.columns if col != target_col]
        df_final = df[feature_cols + [target_col]]
        
        # Split features and target
        X = df_final[feature_cols]
        y = df_final[target_col]
        
        return X, y
    
    def save_preprocessor(self, save_path: str = 'models/v3_preprocessor.pkl'):
        """Save the v3 preprocessor for later use"""
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        preprocessor_data = {
            'label_encoders': self.label_encoders,
            'scalers': self.scalers,
            'feature_selector': self.feature_selector,
            'selected_features': self.selected_features,
            'feature_importance': self.feature_importance
        }
        
        with open(save_path, 'wb') as f:
            pickle.dump(preprocessor_data, f)
        
        print(f"💾 V3 preprocessor saved to: {save_path}")
    
    def preprocess_pipeline(self, data_path: str = None, save_preprocessor: bool = True) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Complete v3 preprocessing pipeline"""
        print("�� Starting V3 Carbon Emission Preprocessing Pipeline")
        print("=" * 80)
        
        # Load data
        df = self.load_data(data_path)
        
        # Handle missing values
        df = self.handle_missing_values(df)
        
        # Handle outliers
        df = self.handle_outliers(df)
        
        # Encode categorical features
        df = self.encode_categorical_features(df)
        
        # Create v3 interaction features
        df = self.create_v3_interaction_features(df)
        
        # Create v3 polynomial features
        df = self.create_v3_polynomial_features(df, degree=2)
        
        # Create v3 ratio features
        df = self.create_v3_ratio_features(df)
        
        # Scale features
        df = self.scale_features(df, method='robust')
        
        # Select best features
        df_selected = self.select_best_features(df, k=45)
        
        # Prepare final dataset
        X, y = self.prepare_final_dataset(df_selected)
        
        if save_preprocessor:
            self.save_preprocessor()
        
        print(f"\n🎯 V3 Preprocessing Complete!")
        print(f"📊 Final shape: {X.shape}")
        print(f"🎯 Target variable range: {y.min():.2f} - {y.max():.2f}")
        print(f"�� Ready for V3 model training!")
        
        return X, y

def main():
    """Main function to run the v3 preprocessing pipeline"""
    # Initialize v3 preprocessor
    preprocessor = V3CarbonDataPreprocessor()
    
    # Run v3 preprocessing pipeline - fix the path
    X, y = preprocessor.preprocess_pipeline("../../../data/raw/residential_carbon_data_v3.csv")
    
    # Save processed data
    os.makedirs("../../../data/processed", exist_ok=True)
    
    processed_data = pd.concat([X, y], axis=1)
    processed_data.to_csv("../../../data/processed/v3_processed_carbon_data.csv", index=False)
    
    print(f"\n💾 V3 processed data saved to: ../../../data/processed/v3_processed_carbon_data.csv")
    print(f" Ready for V3 model training!")

if __name__ == "__main__":
    main()
