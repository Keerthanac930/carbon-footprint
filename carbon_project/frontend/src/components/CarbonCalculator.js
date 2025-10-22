import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import FormSection from './FormSection';
import ProgressBar from './ProgressBar';
import { calculateProgress, getValidationErrors, getFieldValidation } from '../utils/formUtils';
import CarbonFootprintAPI from '../services/api';

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px;
  background: transparent;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    margin: 10px;
    padding: 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.2));
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(15px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(76, 175, 80, 0.03) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Title = styled.h1`
  font-size: 3em;
  margin-bottom: 20px;
  color: white;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
  font-weight: 700;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 2.2em;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3em;
  color: white;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 400;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  
  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

const InfoSection = styled.div`
  background: linear-gradient(135deg, #E8F5E8, #F0F8F0);
  border-left: 5px solid #2E8B57;
  margin-bottom: 25px;
  padding: 25px;
  border-radius: 18px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.08);
`;

const InfoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const InfoIcon = styled.div`
  font-size: 2em;
`;

const InfoText = styled.div`
  h3 {
    margin: 0 0 8px 0;
    color: #2E8B57;
    font-size: 1.3em;
  }
  p {
    margin: 0;
    color: #555;
    line-height: 1.5;
  }
`;

const InfoLink = styled.div`
  text-align: center;
  
  a {
    color: #2E8B57;
    text-decoration: none;
    font-weight: 600;
    padding: 10px 20px;
    background: rgba(46, 139, 87, 0.1);
    border-radius: 20px;
    display: inline-block;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(46, 139, 87, 0.2);
      transform: translateY(-2px);
    }
  }
`;

const FormGrid = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 0 15px;
  height: 500px;
  overflow: hidden;
  
  @media (max-width: 1000px) {
    padding: 0 8px;
    height: 450px;
  }
  
  @media (max-width: 768px) {
    margin: 15px 0;
    height: 400px;
  }
`;

const StepNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    margin: 20px 0;
    padding: 0 10px;
  }
`;

const StepButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
  min-width: 120px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    background: linear-gradient(135deg, #45a049, #4CAF50);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    background: #ccc;
  }
  
  &.prev-button {
    background: linear-gradient(135deg, #6c757d, #5a6268);
    box-shadow: 0 3px 10px rgba(108, 117, 125, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a6268, #6c757d);
      box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
    }
  }
  
  &.reset-button {
    background: linear-gradient(135deg, #f44336, #d32f2f);
    box-shadow: 0 3px 10px rgba(244, 67, 54, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #d32f2f, #f44336);
      box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
    }
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StepDots = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StepDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#4CAF50' : '#e9ecef'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#45a049' : '#dee2e6'};
    transform: scale(1.2);
  }
`;

const ErrorDisplay = styled.div`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  border: 2px solid #f44336;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  color: #c62828;
  
  h3 {
    margin: 0 0 15px 0;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      font-weight: 500;
    }
  }
`;

const SubmitButton = styled.div`
  text-align: center;
  margin-top: 30px;
  
  button {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    position: relative;
    overflow: hidden;
    max-width: 400px;
    width: 100%;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
      background: linear-gradient(135deg, #45a049, #4CAF50);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const CarbonCalculator = () => {
  const navigate = useNavigate();
  
  // Define EMPTY form data for fresh sessions (as per Phase 1 requirements)
  const defaultFormData = useMemo(() => ({
    household_size: '',
    home_size_sqft: '',
    home_type: '',
    home_age: '',
    electricity_usage_kwh: '',
    heating_energy_source: '',
    cooling_energy_source: '',
    walking_cycling_distance_km: '',
    vehicles: [],
    public_transport_usage: '',
    climate_zone: '',
    meat_consumption: '',
    air_travel_hours: '',
    cooking_method: '',
    monthly_grocery_bill: '',
    waste_per_person: '',
    recycling_practice: '',
    income_level: '',
    location_type: '',
    // Hidden fields with sensible defaults for calculation
    heating_efficiency: 0.8,
    cooling_efficiency: 0.7,
    heating_days: 30,
    cooling_days: 120,
    fuel_efficiency: 15,
    fuel_usage_liters: 30,
    recycling_rate: 0.6,
    composting_rate: 0.2,
    waste_bag_weekly_count: 2,
    tv_pc_daily_hours: 3,
    internet_daily_hours: 4,
    new_clothes_monthly: 1,
    renewable_energy_percentage: 0.05,
    home_efficiency: 0.75,
    climate_impact_factor: 1.2,
    lifestyle_impact_score: 0.6,
    waste_bag_size: 40,
    shopping_frequency: 'weekly',
    social_activity: 'medium',
    public_transport_availability: 'good',
    body_type: 'average',
    sex: 'male'
  }), []);

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);


  useEffect(() => {
    setProgress(calculateProgress(formData));
  }, [formData]);

  // Function to reset form to EMPTY values (Phase 1 requirement)
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(0);
    setValidationErrors([]);
    setFieldErrors({});
  }, [defaultFormData]);

  // Initialize form with EMPTY values on each login session (Phase 1 requirement)
  useEffect(() => {
    const loginTime = localStorage.getItem('login_time');
    const lastResetTime = localStorage.getItem('calculator_last_reset');
    
    // Reset form if this is a new login session
    if (loginTime && loginTime !== lastResetTime) {
      resetForm();
      localStorage.setItem('calculator_last_reset', loginTime);
    }
  }, [resetForm]);

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < formSections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Real-time validation
    const isValid = getFieldValidation(field, value);
    console.log('Validation for', field, ':', isValid);
    if (!isValid && value !== undefined && value !== null && value !== '') {
      setFieldErrors(prev => ({
        ...prev,
        [field]: `Invalid value for ${field}`
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get detailed validation errors
    const errors = getValidationErrors(formData);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      
      // Show detailed error message
      const errorMessage = `Please fill in the following required fields:\n\n${errors.map(error => `• ${error.label}`).join('\n')}`;
      alert(errorMessage);
      
      // Highlight missing fields
      const newFieldErrors = {};
      errors.forEach(error => {
        newFieldErrors[error.field] = error.message;
      });
      setFieldErrors(newFieldErrors);
      
      return;
    }

    setIsSubmitting(true);
    
    try {
      const api = new CarbonFootprintAPI();
      
      // Transform form data to match API format (use sensible defaults for empty fields)
      const individualData = {
        household_size: Number(formData.household_size) || 4,
        electricity_usage_kwh: Number(formData.electricity_usage_kwh) || 500,
        home_size_sqft: Number(formData.home_size_sqft) || 1200,
        home_type: formData.home_type || 'apartment',
        heating_energy_source: formData.heating_energy_source || 'electric',
        cooling_energy_source: formData.cooling_energy_source || 'electric',
        vehicle_type: formData.vehicles?.[0]?.type || 'bicycle',
        fuel_type: formData.vehicles?.[0]?.fuel_type || 'human_power',
        climate_zone: formData.climate_zone || 'moderate',
        meat_consumption: formData.meat_consumption || 'vegetarian',
        cooking_method: formData.cooking_method || 'gas',
        recycling_practice: formData.recycling_practice || 'yes',
        income_level: formData.income_level || 'medium',
        location_type: formData.location_type || 'urban',
        vehicle_monthly_distance_km: Number(formData.vehicles?.[0]?.monthly_distance_km) || 100,
        vehicles_per_household: formData.vehicles?.length || 0,
        monthly_grocery_bill: Number(formData.monthly_grocery_bill) || 15000,
        waste_per_person: Number(formData.waste_per_person) || 2,
        air_travel_hours: Number(formData.air_travel_hours) || 0,
        heating_efficiency: formData.heating_efficiency || 0.8,
        cooling_efficiency: formData.cooling_efficiency || 0.7,
        heating_days: formData.heating_days || 30,
        cooling_days: formData.cooling_days || 120,
        waste_bag_weekly_count: formData.waste_bag_weekly_count || 2,
        new_clothes_monthly: formData.new_clothes_monthly || 1,
        recycling_rate: formData.recycling_rate || 0.6,
        composting_rate: formData.composting_rate || 0.2,
        fuel_efficiency: formData.fuel_efficiency || 15,
        fuel_usage_liters: formData.fuel_usage_liters || 30,
        home_age: Number(formData.home_age) || 10
      };

      const result = await api.predictIndividual(individualData);
      
      // Create digital twin with the data
      const userId = `user_${Date.now()}`;
      await api.createDigitalTwin(userId, 'individual', individualData, individualData);
      
      // Save results to localStorage
      localStorage.setItem('carbonFootprintResults', JSON.stringify(result));
      localStorage.setItem('userId', userId);
      localStorage.setItem('formData', JSON.stringify(formData));
      
      // Reset form after successful submission
      resetForm();
      
      // Navigate to new dashboard results page
      navigate('/dashboard/results');
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      alert('Error calculating carbon footprint: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSections = [
    {
      id: 'household',
      title: '🏠 Household Information',
      icon: '🏠',
      fields: [
        { name: 'household_size', label: 'Household Size', type: 'slider', min: 1, max: 15, value: formData.household_size, unit: 'people' },
        { name: 'home_size_sqft', label: 'Home Size (sq ft)', type: 'slider', min: 200, max: 5000, value: formData.home_size_sqft, unit: 'sq ft' },
        { name: 'home_type', label: 'Home Type', type: 'select', options: [
          { value: 'apartment', label: 'Apartment' },
          { value: 'independent_house', label: 'Independent House' },
          { value: 'villa', label: 'Villa' }
        ], value: formData.home_type },
        { name: 'home_age', label: 'Home Age (years)', type: 'number', min: 0, max: 50, value: formData.home_age }
      ]
    },
    {
      id: 'energy',
      title: '⚡ Energy Usage',
      icon: '⚡',
      fields: [
        { name: 'electricity_usage_kwh', label: 'Monthly Electricity Usage (kWh)', type: 'slider', min: 50, max: 2000, value: formData.electricity_usage_kwh, unit: 'kWh' },
        { name: 'heating_energy_source', label: 'Heating Energy Source', type: 'select', options: [
          { value: 'electric', label: 'Electric' },
          { value: 'gas', label: 'Gas' },
          { value: 'solar', label: 'Solar' },
          { value: 'none', label: 'None' }
        ], value: formData.heating_energy_source },
        { name: 'cooling_energy_source', label: 'Cooling Energy Source', type: 'select', options: [
          { value: 'ac', label: 'AC' },
          { value: 'fan', label: 'Fan' },
          { value: 'cooler', label: 'Cooler' },
          { value: 'none', label: 'None' }
        ], value: formData.cooling_energy_source }
      ]
    },
    {
      id: 'transportation',
      title: '🚗 Transportation',
      icon: '🚗',
      fields: [
        { name: 'walking_cycling_distance_km', label: 'Monthly Walking/Cycling Distance (km)', type: 'slider', min: 0, max: 500, value: formData.walking_cycling_distance_km, unit: 'km' },
        { name: 'public_transport_usage', label: 'Public Transport Usage', type: 'select', options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'rarely', label: 'Rarely' },
          { value: 'never', label: 'Never' }
        ], value: formData.public_transport_usage }
      ],
      customComponent: 'VehicleManager'
    },
    {
      id: 'climate',
      title: '🌍 Climate & Lifestyle',
      icon: '🌍',
      fields: [
        { name: 'climate_zone', label: 'Climate Zone', type: 'select', options: [
          { value: 'tropical', label: 'Tropical' },
          { value: 'temperate', label: 'Temperate' },
          { value: 'arid', label: 'Arid' },
          { value: 'coastal', label: 'Coastal' }
        ], value: formData.climate_zone },
        { name: 'meat_consumption', label: 'Meat Consumption', type: 'select', options: [
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'occasional', label: 'Occasional' },
          { value: 'regular', label: 'Regular' }
        ], value: formData.meat_consumption },
        { name: 'air_travel_hours', label: 'Air Travel Hours per Year', type: 'number', min: 0, max: 100, value: formData.air_travel_hours },
        { name: 'cooking_method', label: 'Cooking Method', type: 'select', options: [
          { value: 'gas', label: 'Gas' },
          { value: 'electric', label: 'Electric' },
          { value: 'induction', label: 'Induction' },
          { value: 'traditional', label: 'Traditional' }
        ], value: formData.cooking_method }
      ]
    },
    {
      id: 'waste',
      title: '♻️ Waste & Consumption',
      icon: '♻️',
      fields: [
        { name: 'monthly_grocery_bill', label: 'Monthly Grocery Bill (₹)', type: 'number', min: 1000, max: 100000, value: formData.monthly_grocery_bill },
        { name: 'waste_per_person', label: 'Waste per Person (kg/week)', type: 'number', min: 0.5, max: 10, step: 0.1, value: formData.waste_per_person },
        { name: 'recycling_practice', label: 'Recycling Practice', type: 'select', options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'sometimes', label: 'Sometimes' }
        ], value: formData.recycling_practice }
      ]
    },
    {
      id: 'personal',
      title: '👥 Personal Information',
      icon: '👥',
      fields: [
        { name: 'income_level', label: 'Income Level', type: 'select', options: [
          { value: 'low', label: 'Low' },
          { value: 'middle', label: 'Middle' },
          { value: 'high', label: 'High' }
        ], value: formData.income_level },
        { name: 'location_type', label: 'Location Type', type: 'select', options: [
          { value: 'urban', label: 'Urban' },
          { value: 'semi_urban', label: 'Semi-urban' },
          { value: 'rural', label: 'Rural' }
        ], value: formData.location_type }
      ]
    }
  ];

  return (
    <Container>
      <ProgressBar progress={progress} />
      
      <Header>
        <Title>🌱 Carbon Footprint Calculator</Title>
        <Subtitle>
          Discover your environmental impact with our interactive calculator and get personalized recommendations to reduce your carbon footprint.
        </Subtitle>
      </Header>

      <InfoSection>
        <InfoContent>
          <InfoIcon>📋</InfoIcon>
          <InfoText>
            <h3>Important Information</h3>
            <p>After submitting the form, you'll be redirected to a detailed results page with your carbon footprint analysis and personalized recommendations!</p>
          </InfoText>
        </InfoContent>
        <InfoLink>
          <a href="/results">🔗 View Previous Results</a>
        </InfoLink>
      </InfoSection>

      <form onSubmit={handleSubmit} className="reveal scroll-explosion">
        {/* Step Indicator */}
        <StepNavigation className="reveal scroll-crazy">
          <div></div>
          
          <StepIndicator>
            Step {currentStep + 1} of {formSections.length}
            <StepDots>
              {formSections.map((_, index) => (
                <StepDot
                  key={index}
                  active={index === currentStep}
                  onClick={() => goToStep(index)}
                />
              ))}
            </StepDots>
          </StepIndicator>
          
          <StepButton 
            type="button" 
            className="reset-button" 
            onClick={resetForm}
          >
            🔄 Reset
          </StepButton>
        </StepNavigation>

        {/* Current Step Form Section */}
        <FormGrid>
          <FormSection
            key={formSections[currentStep].id}
            title={formSections[currentStep].title}
            icon={formSections[currentStep].icon}
            fields={formSections[currentStep].fields}
            formData={formData}
            onInputChange={handleInputChange}
            animationDelay={0}
            customComponent={formSections[currentStep].customComponent}
            fieldErrors={fieldErrors}
          />
        </FormGrid>

        {validationErrors.length > 0 && (
          <ErrorDisplay>
            <h3>⚠️ Missing Required Fields</h3>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error.label}</li>
              ))}
            </ul>
          </ErrorDisplay>
        )}

        {/* Step Navigation Buttons */}
        <StepNavigation>
          <StepButton 
            type="button" 
            className="prev-button" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            ← Previous
          </StepButton>
          
          {currentStep === formSections.length - 1 ? (
            <SubmitButton>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Calculating...' : 'Calculate Carbon Footprint'}
              </button>
            </SubmitButton>
          ) : (
            <StepButton 
              type="button" 
              onClick={nextStep}
            >
              Next →
            </StepButton>
          )}
        </StepNavigation>
      </form>
    </Container>
  );
};

export default CarbonCalculator;
