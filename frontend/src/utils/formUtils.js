export const calculateProgress = (formData) => {
  const requiredFields = [
    'household_size', 'home_size_sqft', 'home_type', 'home_age',
    'electricity_usage_kwh', 'heating_energy_source', 'cooling_energy_source',
    'walking_cycling_distance_km', 'public_transport_usage',
    'climate_zone', 'meat_consumption', 'air_travel_hours', 'cooking_method',
    'monthly_grocery_bill', 'waste_per_person', 'recycling_practice',
    'income_level', 'location_type'
  ];

  const filledFields = requiredFields.filter(field => {
    const value = formData[field];
    return value !== undefined && value !== null && value !== '';
  });

  // Check if vehicles array has at least one vehicle with required fields
  // Allow vehicles with default values to pass validation for progress calculation
  const hasValidVehicles = formData.vehicles && formData.vehicles.length > 0 && 
    formData.vehicles.some(vehicle => 
      vehicle.type && vehicle.fuel_type && vehicle.monthly_distance_km !== undefined &&
      vehicle.monthly_distance_km > 0
    );

  const vehicleFieldsCount = hasValidVehicles ? 1 : 0;
  const totalFields = requiredFields.length + 1; // +1 for vehicles

  return ((filledFields.length + vehicleFieldsCount) / totalFields) * 100;
};

export const validateForm = (formData) => {
  const requiredFields = [
    'household_size', 'home_size_sqft', 'home_type', 'home_age',
    'electricity_usage_kwh', 'heating_energy_source', 'cooling_energy_source',
    'walking_cycling_distance_km', 'public_transport_usage',
    'climate_zone', 'meat_consumption', 'air_travel_hours', 'cooking_method',
    'monthly_grocery_bill', 'waste_per_person', 'recycling_practice',
    'income_level', 'location_type'
  ];

  const basicFieldsValid = requiredFields.every(field => {
    const value = formData[field];
    // Accept any non-empty string, number > 0, or boolean true
    return value !== undefined && value !== null && value !== '' && 
           (typeof value === 'string' ? value.trim() !== '' : true) &&
           (typeof value === 'number' ? value > 0 : true);
  });

  // Check if vehicles array has at least one vehicle with required fields
  // For form validation, require at least one properly filled vehicle
  const hasValidVehicles = formData.vehicles && formData.vehicles.length > 0 && 
    formData.vehicles.some(vehicle => 
      vehicle.type && vehicle.fuel_type && vehicle.monthly_distance_km !== undefined &&
      vehicle.monthly_distance_km > 0
    );

  return basicFieldsValid && hasValidVehicles;
};

export const getValidationErrors = (formData) => {
  const fieldLabels = {
    'household_size': 'Household Size',
    'home_size_sqft': 'Home Size (sq ft)',
    'home_type': 'Home Type',
    'home_age': 'Home Age (years)',
    'electricity_usage_kwh': 'Monthly Electricity Usage (kWh)',
    'heating_energy_source': 'Heating Energy Source',
    'cooling_energy_source': 'Cooling Energy Source',
    'walking_cycling_distance_km': 'Monthly Walking/Cycling Distance (km)',
    'public_transport_usage': 'Public Transport Usage',
    'climate_zone': 'Climate Zone',
    'meat_consumption': 'Meat Consumption',
    'air_travel_hours': 'Air Travel Hours per Year',
    'cooking_method': 'Cooking Method',
    'monthly_grocery_bill': 'Monthly Grocery Bill (₹)',
    'waste_per_person': 'Waste per Person (kg/week)',
    'recycling_practice': 'Recycling Practice',
    'income_level': 'Income Level',
    'location_type': 'Location Type'
  };

  const requiredFields = [
    'household_size', 'home_size_sqft', 'home_type', 'home_age',
    'electricity_usage_kwh', 'heating_energy_source', 'cooling_energy_source',
    'walking_cycling_distance_km', 'public_transport_usage',
    'climate_zone', 'meat_consumption', 'air_travel_hours', 'cooking_method',
    'monthly_grocery_bill', 'waste_per_person', 'recycling_practice',
    'income_level', 'location_type'
  ];

  const errors = [];
  
  requiredFields.forEach(field => {
    const value = formData[field];
    
    // Check if value is valid (not empty, not null, not undefined, and for numbers > 0)
    const isValid = value !== undefined && value !== null && value !== '' && 
                   (typeof value === 'string' ? value.trim() !== '' : true) &&
                   (typeof value === 'number' ? value > 0 : true);
    
    if (!isValid) {
      errors.push({
        field: field,
        label: fieldLabels[field] || field,
        message: `${fieldLabels[field] || field} is required`
      });
    }
  });

  // Check vehicles validation - only validate vehicles that have been modified from defaults
  if (!formData.vehicles || formData.vehicles.length === 0) {
    errors.push({
      field: 'vehicles',
      label: 'Vehicle Information',
      message: 'At least one vehicle is required'
    });
  } else {
    // Check if at least one vehicle is properly filled
    const hasValidVehicle = formData.vehicles.some(vehicle => 
      vehicle.type && vehicle.fuel_type && vehicle.monthly_distance_km !== undefined &&
      vehicle.monthly_distance_km > 0
    );
    
    if (!hasValidVehicle) {
      errors.push({
        field: 'vehicles',
        label: 'Vehicle Information',
        message: 'At least one vehicle must be properly filled with type, fuel, and distance'
      });
    }
    
    // Only validate individual vehicles if they have been partially filled
    formData.vehicles.forEach((vehicle, index) => {
      const hasAnyData = vehicle.type || vehicle.fuel_type || (vehicle.monthly_distance_km !== undefined && vehicle.monthly_distance_km !== 100);
      
      if (hasAnyData) {
        if (!vehicle.type) {
          errors.push({
            field: `vehicles[${index}].type`,
            label: `Vehicle ${index + 1} Type`,
            message: `Vehicle ${index + 1} type is required`
          });
        }
        if (!vehicle.fuel_type) {
          errors.push({
            field: `vehicles[${index}].fuel_type`,
            label: `Vehicle ${index + 1} Fuel Type`,
            message: `Vehicle ${index + 1} fuel type is required`
          });
        }
        if (vehicle.monthly_distance_km === undefined || vehicle.monthly_distance_km === null || vehicle.monthly_distance_km === '' || vehicle.monthly_distance_km <= 0) {
          errors.push({
            field: `vehicles[${index}].monthly_distance_km`,
            label: `Vehicle ${index + 1} Monthly Distance (km)`,
            message: `Vehicle ${index + 1} monthly distance must be greater than 0`
          });
        }
      }
    });
  }

  return errors;
};

export const getFieldValidation = (field, value) => {
  const validations = {
    'household_size': (val) => val >= 1 && val <= 15,
    'home_size_sqft': (val) => val >= 200 && val <= 5000,
    'home_age': (val) => val >= 0 && val <= 50,
    'electricity_usage_kwh': (val) => val >= 50 && val <= 2000,
    'walking_cycling_distance_km': (val) => val >= 0 && val <= 500,
    'air_travel_hours': (val) => val >= 0 && val <= 100,
    'monthly_grocery_bill': (val) => val >= 1000 && val <= 100000, // More reasonable range
    'waste_per_person': (val) => val >= 0.5 && val <= 10 // More reasonable range
  };

  if (validations[field]) {
    return validations[field](value);
  }
  
  return value !== undefined && value !== null && value !== '';
};

export const calculateBreakdown = (inputs, totalFootprint) => {
  const breakdown = {
    electricity: 0,
    transportation: 0,
    heating: 0,
    waste: 0,
    lifestyle: 0
  };

  // Electricity (35-40% of total)
  breakdown.electricity = Math.round((inputs.electricity_usage_kwh / 1000) * 35);

  // Transportation (25-30% of total) - calculate from vehicles array
  let totalVehicleDistance = 0;
  if (inputs.vehicles && inputs.vehicles.length > 0) {
    totalVehicleDistance = inputs.vehicles.reduce((sum, vehicle) => 
      sum + (vehicle.monthly_distance_km || 0), 0
    );
  }
  breakdown.transportation = Math.round((totalVehicleDistance / 1000) * 25);

  // Heating (20-25% of total)
  const heatingEfficiency = inputs.heating_efficiency || 0.8;
  breakdown.heating = Math.round((1 - heatingEfficiency) * 25);

  // Waste (10-15% of total)
  const recyclingRate = inputs.recycling_practice === 'yes' ? 0.8 : 
                       inputs.recycling_practice === 'sometimes' ? 0.4 : 0.1;
  breakdown.waste = Math.round((1 - recyclingRate) * 15);

  // Lifestyle (5-10% of total)
  breakdown.lifestyle = Math.round(10 - (inputs.renewable_energy_percentage || 0) * 10);

  // Normalize to total 100%
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  if (total > 0) {
    Object.keys(breakdown).forEach(key => {
      breakdown[key] = Math.round((breakdown[key] / total) * 100);
    });
  }

  return breakdown;
};
