import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiTrendingUp, FiDollarSign, FiWind, FiZap, FiTrash } from 'react-icons/fi';
import CarbonFootprintAPI from '../../services/api';
import carbonCalculationService from '../../services/carbonCalculationService';
import localStorageService from '../../services/localStorageService';

const CalculatorPage = () => {
  const navigate = useNavigate();
  
  // Empty form data (Phase 1 requirement)
  const defaultFormData = useMemo(() => ({
    household_size: '',
    home_size_sqft: '',
    home_type: '',
    electricity_usage_kwh: '',
    heating_energy_source: '',
    cooling_energy_source: '',
    vehicle_type: '',
    vehicles_per_household: '',
    vehicle_monthly_distance_km: '',
    fuel_efficiency: '',
    fuel_usage_liters: '',
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
  }), []);

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Reset form on new login session
  useEffect(() => {
    const loginTime = localStorage.getItem('login_time');
    const lastResetTime = localStorage.getItem('calculator_last_reset');
    
    if (loginTime && loginTime !== lastResetTime) {
      setFormData(defaultFormData);
      localStorage.setItem('calculator_last_reset', loginTime);
    }
    
    // Check for OCR extracted units
    const ocrUnits = localStorage.getItem('ocr_extracted_units');
    if (ocrUnits) {
      setFormData(prev => ({
        ...prev,
        electricity_usage_kwh: ocrUnits,
      }));
      localStorage.removeItem('ocr_extracted_units'); // Clear after use
    }
  }, [defaultFormData]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(0);
  }, [defaultFormData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.electricity_usage_kwh || !formData.household_size) {
      alert('Please fill in required fields: Electricity usage and Household size');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for calculation
      const vehicleType = formData.vehicle_type || 'petrol';
      const vehicleDistance = Number(formData.vehicle_monthly_distance_km) || 0;
      const fuelEfficiency = Number(formData.fuel_efficiency) || 15;
      const fuelUsageLiters = Number(formData.fuel_usage_liters) || (vehicleDistance / fuelEfficiency);
      
      // Map vehicle types to calculation service format
      const vehicleTypeMap = {
        'petrol_sedan': 'petrol',
        'petrol_suv': 'petrol',
        'diesel': 'diesel',
        'hybrid': 'petrol',
        'electric': 'electric',
        'bicycle': 'bicycle'
      };
      
      const mappedVehicleType = vehicleTypeMap[vehicleType] || 'petrol';
      
      // Map diet types
      const dietTypeMap = {
        'vegetarian': 'vegetarian',
        'occasional': 'moderate',
        'regular': 'high'
      };
      const mappedDietType = dietTypeMap[formData.meat_consumption] || 'moderate';

      // Calculate using local service (works offline)
      const calculationInput = {
        electricity_usage_kwh: Number(formData.electricity_usage_kwh),
        vehicle_monthly_distance_km: vehicleDistance,
        vehicle_type: mappedVehicleType,
        fuel_usage_liters: fuelUsageLiters,
        fuel_efficiency: fuelEfficiency,
        household_size: Number(formData.household_size),
        home_size_sqft: Number(formData.home_size_sqft) || 0,
        diet_type: mappedDietType,
        monthly_grocery_bill: Number(formData.monthly_grocery_bill) || 0,
        recycling_practice: formData.recycling_practice || 'no',
        air_travel_hours: Number(formData.air_travel_hours) || 0,
      };

      // Calculate locally (primary method - works offline)
      const calculationResult = carbonCalculationService.calculate(calculationInput);
      const recommendations = carbonCalculationService.generateRecommendations(calculationResult);

      // Create calculation object
      const calculation = {
        id: Date.now().toString(),
        predictedEmissions: calculationResult.total_emissions_tons,
        confidenceScore: 0.95, // High confidence for local calculations
        breakdown: calculationResult.breakdown,
        recommendations: recommendations,
        createdAt: new Date().toISOString(),
        inputData: calculationInput,
      };

      // Save to local storage
      localStorageService.saveCalculation(calculation);
      
      // Award gamification points
      localStorageService.awardCalculationPoints();

      // Try to sync with backend (optional, doesn't block)
      try {
        const api = new CarbonFootprintAPI();
        await api.predictIndividual({
          ...calculationInput,
          household_size: calculationInput.household_size,
          electricity_usage_kwh: calculationInput.electricity_usage_kwh,
        });
      } catch (apiError) {
        console.log('Backend sync failed, using local calculation:', apiError);
        // Continue with local calculation
      }

      // Store result for results page
      localStorage.setItem('carbonFootprintResults', JSON.stringify(calculation));
      
      resetForm();
      navigate('/dashboard/results');
    } catch (error) {
      console.error('Error:', error);
      alert('Calculation failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSections = [
    {
      title: 'Household Info',
      icon: FiHome,
      fields: [
        { name: 'household_size', label: 'Household Size', type: 'number', min: 1, max: 15 },
        { name: 'home_size_sqft', label: 'Home Size (sq ft)', type: 'number', min: 200, max: 5000 },
        { name: 'home_type', label: 'Home Type', type: 'select', options: [
          { value: '', label: 'Select...' },
          { value: 'apartment', label: 'Apartment' },
          { value: 'independent_house', label: 'House' },
          { value: 'villa', label: 'Villa' }
        ]},
      ]
    },
    {
      title: 'Energy Usage',
      icon: FiZap,
      fields: [
        { name: 'electricity_usage_kwh', label: 'Monthly Electricity (kWh)', type: 'number', min: 50, max: 2000 },
        { name: 'heating_energy_source', label: 'Heating Source', type: 'select', options: [
          { value: '', label: 'Select...' },
          { value: 'electric', label: 'Electric' },
          { value: 'gas', label: 'Gas' },
          { value: 'solar', label: 'Solar' },
          { value: 'none', label: 'None' }
        ]},
        { name: 'cooling_energy_source', label: 'Cooling Source', type: 'select', options: [
          { value: '', label: 'Select...' },
          { value: 'ac', label: 'AC' },
          { value: 'fan', label: 'Fan' },
          { value: 'none', label: 'None' }
        ]},
      ]
    },
    {
      title: 'Transportation',
      icon: FiWind,
      fields: [
        { name: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: [
          { value: '', label: 'Select...' },
          { value: 'petrol_sedan', label: 'Petrol Sedan' },
          { value: 'petrol_suv', label: 'Petrol SUV' },
          { value: 'diesel', label: 'Diesel Vehicle' },
          { value: 'hybrid', label: 'Hybrid' },
          { value: 'electric', label: 'Electric' },
          { value: 'bicycle', label: 'Bicycle' }
        ]},
        { name: 'vehicles_per_household', label: 'Number of Vehicles', type: 'number', min: 0, max: 10 },
        { name: 'vehicle_monthly_distance_km', label: 'Monthly Distance (km)', type: 'number', min: 0, max: 5000 },
        { name: 'fuel_efficiency', label: 'Fuel Efficiency (km/liter)', type: 'number', min: 0, max: 50, step: 0.1 },
        { name: 'fuel_usage_liters', label: 'Fuel Usage (liters/month)', type: 'number', min: 0, max: 500, step: 0.1 },
      ]
    },
    {
      title: 'Lifestyle',
      icon: FiTrendingUp,
      fields: [
        { name: 'climate_zone', label: 'Climate Zone', type: 'select', options: [
          { value: '', label: 'Select...' },
          { value: 'tropical', label: 'Tropical' },
          { value: 'temperate', label: 'Temperate' },
          { value: 'arid', label: 'Arid' }
        ]},
        { name: 'meat_consumption', label: 'Meat Consumption', type: 'select', options: [
          { value: '', label: 'Select...' },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'occasional', label: 'Occasional' },
          { value: 'regular', label: 'Regular' }
        ]},
        { name: 'air_travel_hours', label: 'Air Travel Hours/Year', type: 'number', min: 0, max: 100 },
      ]
    },
    {
      title: 'Waste & Shopping',
      icon: FiTrash,
      fields: [
        { name: 'monthly_grocery_bill', label: 'Monthly Grocery (₹)', type: 'number', min: 1000, max: 100000 },
        { name: 'waste_per_person', label: 'Waste per Person (kg/week)', type: 'number', min: 0.5, max: 10, step: 0.1 },
        { name: 'recycling_practice', label: 'Recycling', type: 'select', options: [
          { value: '', label: 'Select...' },
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'sometimes', label: 'Sometimes' }
        ]},
      ]
    }
  ];

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

  const currentSection = formSections[currentStep];
  const Icon = currentSection.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <FiZap size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Carbon Footprint Calculator</h1>
            <p className="text-green-50 text-sm sm:text-base">Calculate your annual CO₂ emissions</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <div className="white-card white-card-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {formSections.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(((currentStep + 1) / formSections.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="white-card white-card-lg"
        >
          {/* Section Header */}
          <div className="white-card-icon-header">
            <div className="white-card-icon">
              <Icon size={24} />
            </div>
            <div>
              <h2 className="white-card-title text-2xl">
                {currentSection.title}
              </h2>
              <p className="white-card-subtitle">Step {currentStep + 1} of {formSections.length}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="white-card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSection.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="white-card-actions">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="white-card-button white-card-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {formSections.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentStep ? 'bg-green-500 w-8' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>

            {currentStep === formSections.length - 1 ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="white-card-button white-card-button-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Calculating...' : 'Calculate'}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="white-card-button white-card-button-primary"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </form>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={resetForm}
          className="px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
        >
          Reset Form
        </button>
      </div>
    </div>
  );
};

export default CalculatorPage;

