import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, RobustScaler
from sklearn.feature_selection import SelectKBest

class CarbonEmissionPredictorFixed:
    """
    Carbon Emission Prediction with proper feature transformation using V3 preprocessor
    """
    
    def __init__(self, model_path: str = "models/v3_carbon_emission_model_minimal.pkl", 
                 preprocessor_path: str = "models/v3_preprocessor.pkl"):
        # Load the trained model
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        if not os.path.exists(preprocessor_path):
            raise FileNotFoundError(f"Preprocessor not found: {preprocessor_path}")
        
        # Load model and preprocessor
        model_data = joblib.load(model_path)
        self.model = model_data['model']
        self.model_name = model_data['model_name']
        self.score = model_data['score']
        
        preprocessor_data = joblib.load(preprocessor_path)
        self.label_encoders = preprocessor_data['label_encoders']
        self.scalers = preprocessor_data['scalers']
        self.feature_selector = preprocessor_data['feature_selector']
        self.selected_features = preprocessor_data['selected_features']
        self.feature_importance = preprocessor_data['feature_importance']
        
        print(f"✅ Model loaded: {self.model_name}")
        print(f"🎯 Model R² Score: {self.score:.4f}")
        print(f"🔧 Preprocessor loaded with {len(self.selected_features)} features")
        
        # Print available categorical values for debugging
        print("\n📋 Available categorical values from training:")
        for col, encoder in self.label_encoders.items():
            print(f"  {col}: {list(encoder.classes_)}")
    
    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values using the same strategy as training"""
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
    
    def handle_outliers(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle outliers using IQR method (same as training)"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
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
        """Encode categorical features using saved label encoders"""
        categorical_cols = df.select_dtypes(include=['object']).columns
        
        for col in categorical_cols:
            if col in self.label_encoders:
                # Use the fitted label encoder from training
                try:
                    # Get unique values from training data
                    training_values = set(self.label_encoders[col].classes_)
                    current_values = set(df[col].unique())
                    
                    # Check if we have unseen values
                    unseen_values = current_values - training_values
                    if unseen_values:
                        print(f"⚠️  Unseen values in {col}: {unseen_values}")
                        # Replace unseen values with the most common value from training
                        most_common = self.label_encoders[col].classes_[0]
                        df[col] = df[col].replace(list(unseen_values), most_common)
                        print(f"   → Replaced with: {most_common}")
                    
                    # Now encode
                    df[col] = self.label_encoders[col].transform(df[col])
                    print(f"🔤 Encoded: {col}")
                    
                except Exception as e:
                    print(f"❌ Error encoding {col}: {e}")
                    # If encoding fails, drop the column
                    print(f"   → Dropping column: {col}")
                    df = df.drop(columns=[col])
            else:
                # If column wasn't in training data, drop it
                print(f"⚠️  Dropping unknown categorical column: {col}")
                df = df.drop(columns=[col])
        
        return df
    
    def create_v3_interaction_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create interaction features (same as training)"""
        print("🔗 Creating V3 interaction features...")
        
        # Energy-related interactions
        if 'electricity_usage_kwh' in df.columns and 'heating_efficiency' in df.columns:
            df['electricity_heating_interaction'] = df['electricity_usage_kwh'] * df['heating_efficiency']
        
        if 'cooling_efficiency' in df.columns and 'heating_efficiency' in df.columns:
            df['cooling_heating_interaction'] = df['cooling_efficiency'] * df['heating_efficiency']
        
        # Transportation interactions
        if 'vehicle_monthly_distance_km' in df.columns and 'fuel_efficiency' in df.columns:
            df['vehicle_distance_efficiency'] = df['vehicle_monthly_distance_km'] * df['fuel_efficiency']
        
        if 'vehicles_per_household' in df.columns and 'vehicle_monthly_distance_km' in df.columns:
            df['transport_household_interaction'] = df['vehicles_per_household'] * df['vehicle_monthly_distance_km']
        
        # Waste interactions
        if 'recycling_rate' in df.columns and 'composting_rate' in df.columns:
            df['waste_recycling_synergy'] = df['recycling_rate'] * df['composting_rate']
        
        if 'waste_per_person' in df.columns and 'household_size' in df.columns:
            df['waste_household_interaction'] = df['waste_per_person'] * df['household_size']
        
        # Lifestyle interactions
        if 'meat_consumption' in df.columns and 'air_travel_hours' in df.columns:
            df['meat_travel_interaction'] = df['meat_consumption'] * df['air_travel_hours']
        
        if 'shopping_frequency' in df.columns and 'lifestyle_impact_score' in df.columns:
            df['shopping_lifestyle_impact'] = df['shopping_frequency'] * df['lifestyle_impact_score']
        
        # Home efficiency interactions
        if 'home_size_sqft' in df.columns and 'home_efficiency' in df.columns:
            df['home_size_efficiency'] = df['home_size_sqft'] * df['home_efficiency']
        
        if 'climate_impact_factor' in df.columns and 'heating_efficiency' in df.columns:
            df['climate_efficiency_synergy'] = df['climate_impact_factor'] * df['heating_efficiency']
        
        print(f"✅ {len([col for col in df.columns if 'interaction' in col or 'synergy' in col])} interaction features created")
        return df
    
    def create_v3_polynomial_features(self, df: pd.DataFrame, degree: int = 2) -> pd.DataFrame:
        """Create polynomial features (same as training)"""
        key_features = ['household_size', 'home_size_sqft', 'heating_days', 'cooling_days', 'electricity_usage_kwh']
        
        for feature in key_features:
            if feature in df.columns:
                for d in range(2, degree + 1):
                    df[f'{feature}_power_{d}'] = df[feature] ** d
        
        print(f"✅ Polynomial features created (degree {degree})")
        return df
    
    def create_v3_ratio_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create ratio features (same as training)"""
        print("📊 Creating V3 ratio features...")
        
        # Efficiency ratios
        if 'electricity_usage_kwh' in df.columns and 'household_size' in df.columns:
            df['electricity_per_person_ratio'] = df['electricity_usage_kwh'] / (df['household_size'] + 1)
        
        df['carbon_to_efficiency_ratio'] = 0  # Will be calculated later
        
        # Transportation ratios
        if 'fuel_usage_liters' in df.columns and 'vehicle_monthly_distance_km' in df.columns:
            df['fuel_to_distance_ratio'] = df['fuel_usage_liters'] / (df['vehicle_monthly_distance_km'] + 1)
        
        if 'vehicles_per_household' in df.columns and 'household_size' in df.columns:
            df['vehicles_to_household_ratio'] = df['vehicles_per_household'] / (df['household_size'] + 1)
        
        # Waste ratios
        if 'waste_per_person' in df.columns and 'recycling_rate' in df.columns:
            df['waste_to_recycling_ratio'] = df['waste_per_person'] / (df['recycling_rate'] + 0.1)
        
        # Energy ratios
        if 'heating_days' in df.columns and 'cooling_days' in df.columns:
            df['heating_to_cooling_ratio'] = df['heating_days'] / (df['cooling_days'] + 1)
        
        print(f"✅ {len([col for col in df.columns if 'ratio' in col])} ratio features created")
        return df
    
    def create_additional_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create additional features that the scaler expects"""
        print("🔧 Creating additional features...")
        
        # Basic calculated features
        if 'household_size' in df.columns and 'electricity_usage_kwh' in df.columns:
            df['electricity_per_person'] = df['electricity_usage_kwh'] / df['household_size']
        
        if 'vehicle_monthly_distance_km' in df.columns and 'electricity_usage_kwh' in df.columns:
            df['electricity_transport_ratio'] = df['electricity_usage_kwh'] / (df['vehicle_monthly_distance_km'] + 1)
        
        if 'heating_efficiency' in df.columns and 'home_size_sqft' in df.columns:
            df['heating_efficiency_impact'] = df['heating_efficiency'] * df['home_size_sqft'] / 1000
        
        if 'electricity_usage_kwh' in df.columns and 'vehicle_monthly_distance_km' in df.columns and 'household_size' in df.columns:
            df['carbon_per_person'] = (df['electricity_usage_kwh'] + df['vehicle_monthly_distance_km']) / df['household_size']
        
        # Add the missing features that the scaler expects
        if 'home_size_sqft' in df.columns and 'household_size' in df.columns:
            df['home_size_per_person'] = df['home_size_sqft'] / df['household_size']
        
        if 'fuel_efficiency' in df.columns and 'vehicle_monthly_distance_km' in df.columns:
            df['transport_efficiency'] = df['fuel_efficiency'] / (df['vehicle_monthly_distance_km'] + 1)
        
        # Add missing features with default values if they don't exist
        missing_features = [
            'meat_consumption', 'shopping_frequency', 'lifestyle_impact_score',
            'waste_bag_size', 'waste_recycling_efficiency'
        ]
        
        for feature in missing_features:
            if feature not in df.columns:
                df[feature] = 0.0  # Default value
                print(f"   → Added missing feature: {feature} = 0.0")
        
        print(f"✅ Additional features created")
        return df
    
    def scale_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Scale features using saved scaler"""
        if 'features' in self.scalers:
            scaler = self.scalers['features']
            
            # Get the feature names that the scaler was trained on
            scaler_feature_names = scaler.feature_names_in_
            print(f"🔧 Scaler expects {len(scaler_feature_names)} features")
            
            # Ensure we have all the features the scaler expects
            missing_features = set(scaler_feature_names) - set(df.columns)
            if missing_features:
                print(f"⚠️ Missing features for scaler: {missing_features}")
                for feature in missing_features:
                    df[feature] = 0.0
                    print(f"   → Added missing feature: {feature} = 0.0")
            
            # Create a DataFrame with features in the exact order the scaler expects
            df_for_scaling = df[scaler_feature_names].copy()
            
            # Scale the features
            scaled_values = scaler.transform(df_for_scaling)
            
            # Create a new DataFrame with scaled values
            df_scaled = pd.DataFrame(scaled_values, columns=scaler_feature_names, index=df.index)
            
            # Add back any columns that weren't scaled
            unscaled_cols = set(df.columns) - set(scaler_feature_names)
            for col in unscaled_cols:
                df_scaled[col] = df[col]
            
            print(f"✅ Features scaled using saved scaler")
            return df_scaled
        else:
            print("⚠️  No scaler found, returning unscaled features")
            return df
    
    def transform_raw_features_to_processed(self, raw_inputs: dict):
        """
        Transform raw user inputs to processed features that the model expects
        Uses the exact same preprocessing pipeline as training
        """
        # Create a DataFrame with the raw inputs
        df = pd.DataFrame([raw_inputs])
        
        print(f"🔄 Starting feature transformation...")
        print(f"📊 Input shape: {df.shape}")
        
        # Apply the exact same preprocessing steps as training
        # 1. Handle missing values
        df = self.handle_missing_values(df)
        
        # 2. Handle outliers
        df = self.handle_outliers(df)
        
        # 3. Encode categorical features
        df = self.encode_categorical_features(df)
        
        # 4. Create interaction features
        df = self.create_v3_interaction_features(df)
        
        # 5. Create polynomial features
        df = self.create_v3_polynomial_features(df)
        
        # 6. Create ratio features
        df = self.create_v3_ratio_features(df)
        
        # 7. Create additional features that the scaler expects
        df = self.create_additional_features(df)
        
        # 8. Scale features
        df = self.scale_features(df)
        
        # 9. Select the same features used during training
        if self.selected_features:
            # Ensure all required features are present
            missing_features = set(self.selected_features) - set(df.columns)
            if missing_features:
                print(f"⚠️ Missing features: {missing_features}")
                # Add missing features with default values
                for feature in missing_features:
                    df[feature] = 0.0
                    print(f"   → Added missing feature: {feature} = 0.0")
            
            # Select only the features the model was trained on
            df = df[self.selected_features]
            print(f"✅ Selected {len(df.columns)} features for prediction")
        
        return df
    
    def predict_from_raw_inputs(self, raw_inputs: dict):
        """
        Predict carbon emission from raw user inputs
        """
        try:
            # Transform raw inputs to processed features
            processed_df = self.transform_raw_features_to_processed(raw_inputs)
            
            print(f" Processed features shape: {processed_df.shape}")
            print(f"🔧 Feature names: {list(processed_df.columns)}")
            
            # Make prediction
            prediction = self.model.predict(processed_df)[0]
            
            return {
                'predicted_carbon_footprint': round(prediction, 2),
                'prediction_units': 'kg CO2/year',
                'model_confidence': f"{self.score:.1%}",
                'model_name': self.model_name
            }
            
        except Exception as e:
            print(f"❌ Error during prediction: {e}")
            print(f" Processed features shape: {processed_df.shape if 'processed_df' in locals() else 'N/A'}")
            if 'processed_df' in locals():
                print(f"🔧 Feature names: {list(processed_df.columns)}")
            raise
    
    def get_recommendations(self, raw_inputs: dict, prediction: float):
        """
        Generate personalized recommendations to reduce carbon footprint
        """
        recommendations = []
        
        # Electricity recommendations
        try:
            electricity_usage = float(raw_inputs.get('electricity_usage_kwh', 0))
        except (ValueError, TypeError):
            electricity_usage = 0
            
        if electricity_usage > 800:
            recommendations.append({
                'category': '⚡ Electricity',
                'action': 'Switch to LED bulbs and energy-efficient appliances',
                'potential_savings': '15-25% reduction in electricity usage',
                'priority': 'High'
            })
        elif electricity_usage > 600:
            recommendations.append({
                'category': '⚡ Electricity',
                'action': 'Consider smart thermostats and energy monitoring',
                'potential_savings': '10-15% reduction in electricity usage',
                'priority': 'Medium'
            })
        
        # Transportation recommendations
        try:
            vehicle_distance = float(raw_inputs.get('vehicle_monthly_distance_km', 0))
        except (ValueError, TypeError):
            vehicle_distance = 0
            
        if vehicle_distance > 1500:
            recommendations.append({
                'category': '🚗 Transportation',
                'action': 'Use public transport or carpool 3-4 times per week',
                'potential_savings': '25-35% reduction in vehicle emissions',
                'priority': 'High'
            })
        elif vehicle_distance > 1000:
            recommendations.append({
                'category': '🚗 Transportation',
                'action': 'Consider hybrid/electric vehicle or carpooling',
                'potential_savings': '15-25% reduction in vehicle emissions',
                'priority': 'Medium'
            })
        
        # Heating recommendations
        heating_efficiency = float(raw_inputs.get('heating_efficiency', 0))
        if heating_efficiency < 0.7:
            recommendations.append({
                'category': '🔥 Heating',
                'action': 'Improve home insulation and upgrade heating system',
                'potential_savings': '20-30% reduction in heating emissions',
                'priority': 'High'
            })
        elif heating_efficiency < 0.8:
            recommendations.append({
                'category': '🔥 Heating',
                'action': 'Seal air leaks and add weather stripping',
                'potential_savings': '10-15% reduction in heating emissions',
                'priority': 'Medium'
            })
        
        # Waste recommendations
        recycling_rate = float(raw_inputs.get('recycling_rate', 0))
        if recycling_rate < 0.5:
            recommendations.append({
                'category': '♻️ Waste Management',
                'action': 'Increase recycling and start composting program',
                'potential_savings': '10-20% reduction in waste emissions',
                'priority': 'Medium'
            })
        
        # Lifestyle recommendations
        meat_consumption = raw_inputs.get('meat_consumption', 'None')
        if meat_consumption in ['High', 'Medium']:
            recommendations.append({
                'category': '🥩 Diet',
                'action': 'Reduce meat consumption to 2-3 times per week',
                'potential_savings': '15-25% reduction in food emissions',
                'priority': 'Medium'
            })
        
        # Home efficiency recommendations
        home_size = float(raw_inputs.get('home_size_sqft', 0))
        household_size = float(raw_inputs.get('household_size', 1))
        if home_size > 0 and household_size > 0:
            home_per_person = home_size / household_size
            if home_per_person > 800:
                recommendations.append({
                    'category': '🏠 Home Efficiency',
                    'action': 'Consider downsizing or improving space utilization',
                    'potential_savings': '10-20% reduction in home emissions',
                    'priority': 'Low'
                })
        
        # Renewable energy recommendations
        renewable_percentage = float(raw_inputs.get('renewable_energy_percentage', 0))
        if renewable_percentage < 0.2:
            recommendations.append({
                'category': '☀️ Renewable Energy',
                'action': 'Consider installing solar panels or switching to green energy',
                'potential_savings': '20-40% reduction in energy emissions',
                'priority': 'High'
            })
        
        # If no specific recommendations, provide general ones
        if not recommendations:
            recommendations = [
                {
                    'category': '🌱 General',
                    'action': 'Start with small changes: turn off lights, unplug devices',
                    'potential_savings': '5-10% reduction in overall emissions',
                    'priority': 'Low'
                },
                {
                    'category': '📱 Monitoring',
                    'action': 'Track your carbon footprint monthly to see improvements',
                    'potential_savings': 'Better awareness leads to better choices',
                    'priority': 'Low'
                }
            ]
        
        # Sort by priority (High, Medium, Low)
        priority_order = {'High': 0, 'Medium': 1, 'Low': 2}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 3))
        
        return recommendations

def main():
    """Test the fixed prediction system"""
    print("🧪 Testing Fixed Carbon Emission Prediction System")
    print("=" * 60)
    
    # Initialize predictor
    predictor = CarbonEmissionPredictorFixed()
    
    # Test with sample raw inputs using ONLY values that exist in the training data
    test_raw_inputs = {
        'household_size': 4,
        'electricity_usage_kwh': 500,
        'vehicle_monthly_distance_km': 800,
        'heating_energy_source': 'electric',  # From training data
        'heating_efficiency': 0.85,
        'cooling_efficiency': 0.8,
        'vehicle_type': 'petrol_sedan',  # From training data
        'air_travel_hours': 20,
        'recycling_rate': 0.7,
        'monthly_grocery_bill': 400,
        'fuel_usage_liters': 60,
        'fuel_efficiency': 8.5,
        'vehicles_per_household': 2,
        'climate_zone': 'temperate',  # From training data
        'heating_days': 120,
        'cooling_days': 90,
        'home_size_sqft': 2000,
        'home_age': 15,
        'renewable_energy_percentage': 0.1,
        'cooking_method': 'electric_stove',  # From training data
        'public_transport_availability': 'excellent',  # From training data
        'waste_per_person': 2.5,
        'waste_bag_weekly_count': 3,
        'composting_rate': 0.3,
        'tv_pc_daily_hours': 4,
        'internet_daily_hours': 6,
        'new_clothes_monthly': 2,
        'social_activity': 'homebody',  # From training data
        'income_level': 'medium',  # From training data
        'home_type': 'single_family',  # From training data
        'body_type': 'average',  # From training data
        'sex': 'male',  # From training data
        'home_efficiency': 0.8,
        'climate_impact_factor': 1.0,
        # Add missing features that the scaler expects
        'meat_consumption': 0,  # Default value since it wasn't in training
        'shopping_frequency': 0,  # Default value since it wasn't in training
        'lifestyle_impact_score': 0.5,
        'waste_bag_size': 0  # Default value since it wasn't in training
    }
    
    # Make prediction using raw inputs
    result = predictor.predict_from_raw_inputs(test_raw_inputs)
    
    print(f"\n Prediction Results:")
    print(f"Carbon Footprint: {result['predicted_carbon_footprint']} {result['prediction_units']}")
    print(f"Model Confidence: {result['model_confidence']}")
    
    # Get recommendations
    recommendations = predictor.get_recommendations(test_raw_inputs, result['predicted_carbon_footprint'])
    
    print(f"\n💡 Personalized Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec['category']}: {rec['action']}")
        print(f"   Potential Savings: {rec['potential_savings']}")
    
    print(f"\n🚀 Fixed prediction system ready for use!")

if __name__ == "__main__":
    main()
