/**
 * Carbon Calculation Service
 * Real emission formulas based on EPA, IPCC, and industry standards
 * Works completely offline - matches mobile app implementation
 */

class CarbonCalculationService {
  // Emission factors (kg CO2 per unit)
  static ELECTRICITY_FACTOR = 0.4; // kg CO2 per kWh (India grid average)
  static PETROL_FACTOR = 2.31; // kg CO2 per liter
  static DIESEL_FACTOR = 2.68; // kg CO2 per liter
  static CNG_FACTOR = 2.0; // kg CO2 per liter
  static DISTANCE_FACTOR = 0.2; // kg CO2 per km (average car)
  static HEATING_FACTOR = 0.1; // kg CO2 per sq ft per year
  static WASTE_FACTOR = 200; // kg CO2 per person per year
  static LIFESTYLE_FACTOR = 100; // kg CO2 per person per year
  static FOOD_MEAT_FACTOR = 27; // kg CO2 per kg meat
  static FOOD_PLANT_FACTOR = 2; // kg CO2 per kg plant food
  static AIR_TRAVEL_FACTOR = 0.255; // kg CO2 per km
  static AIR_TRAVEL_SPEED = 900; // km per hour

  /**
   * Calculate carbon footprint from user inputs
   * @param {Object} inputs - User input data
   * @returns {Object} Calculation results with breakdown
   */
  calculate(inputs) {
    // Extract inputs with defaults
    const electricityKwh = parseFloat(inputs.electricity_usage_kwh || inputs.electricityKwh || 0);
    const homeSizeSqft = parseFloat(inputs.home_size_sqft || 0);
    const householdSize = parseInt(inputs.household_size || 1);
    const transportDistanceKm = parseFloat(inputs.vehicle_monthly_distance_km || inputs.transportDistanceKm || 0);
    const transportType = (inputs.vehicle_type || inputs.transportType || 'petrol').toLowerCase();
    const fuelLiters = parseFloat(inputs.fuel_usage_liters || inputs.fuelLiters || 0);
    const fuelEfficiency = parseFloat(inputs.fuel_efficiency || 15);
    const dietType = (inputs.diet_type || inputs.meat_consumption || 'moderate').toLowerCase();
    const monthlyGroceryBill = parseFloat(inputs.monthly_grocery_bill || 0);
    const recyclingPractice = (inputs.recycling_practice || 'no').toLowerCase();
    const airTravelHours = parseFloat(inputs.air_travel_hours || 0);
    const heatingUsage = parseFloat(inputs.heating_usage || homeSizeSqft * 0.1);

    // Convert monthly to annual
    const electricityAnnual = electricityKwh * 12;
    const transportDistanceAnnual = transportDistanceKm * 12;
    const fuelLitersAnnual = fuelLiters * 12;

    // 1. Electricity emissions (kg CO2/year)
    const electricityEmissions = electricityAnnual * CarbonCalculationService.ELECTRICITY_FACTOR;

    // 2. Transportation emissions (kg CO2/year)
    let transportEmissions = 0;
    switch (transportType) {
      case 'electric':
        transportEmissions = transportDistanceAnnual * 0.05; // Grid electricity
        break;
      case 'petrol':
      case 'gasoline':
        if (fuelLitersAnnual > 0) {
          transportEmissions = fuelLitersAnnual * CarbonCalculationService.PETROL_FACTOR;
        } else {
          transportEmissions = transportDistanceAnnual * 0.15; // Average efficiency
        }
        break;
      case 'diesel':
        if (fuelLitersAnnual > 0) {
          transportEmissions = fuelLitersAnnual * CarbonCalculationService.DIESEL_FACTOR;
        } else {
          transportEmissions = transportDistanceAnnual * 0.17;
        }
        break;
      case 'cng':
      case 'gas':
        if (fuelLitersAnnual > 0) {
          transportEmissions = fuelLitersAnnual * CarbonCalculationService.CNG_FACTOR;
        } else {
          transportEmissions = transportDistanceAnnual * 0.12;
        }
        break;
      case 'bicycle':
      case 'walking':
      case 'public_transport':
        transportEmissions = transportDistanceAnnual * 0.05; // Much lower
        break;
      default:
        transportEmissions = transportDistanceAnnual * CarbonCalculationService.DISTANCE_FACTOR;
    }

    // 3. Heating emissions (kg CO2/year)
    const heatingEmissions = heatingUsage * CarbonCalculationService.HEATING_FACTOR;

    // 4. Food emissions (kg CO2/year)
    let foodEmissions = 0;
    const annualGroceryBill = monthlyGroceryBill * 12;
    
    switch (dietType) {
      case 'vegetarian':
      case 'vegan':
        foodEmissions = annualGroceryBill * 0.1 * CarbonCalculationService.FOOD_PLANT_FACTOR / 1000;
        break;
      case 'moderate':
        foodEmissions = (annualGroceryBill * 0.2 * CarbonCalculationService.FOOD_MEAT_FACTOR / 1000) +
            (annualGroceryBill * 0.8 * CarbonCalculationService.FOOD_PLANT_FACTOR / 1000);
        break;
      case 'high':
      default:
        foodEmissions = (annualGroceryBill * 0.4 * CarbonCalculationService.FOOD_MEAT_FACTOR / 1000) +
            (annualGroceryBill * 0.6 * CarbonCalculationService.FOOD_PLANT_FACTOR / 1000);
        break;
    }

    // 5. Waste emissions (kg CO2/year)
    let wasteEmissions = householdSize * CarbonCalculationService.WASTE_FACTOR;
    switch (recyclingPractice) {
      case 'yes':
        wasteEmissions *= 0.5; // 50% reduction
        break;
      case 'sometimes':
        wasteEmissions *= 0.75; // 25% reduction
        break;
      case 'no':
      default:
        // No reduction
        break;
    }

    // 6. Lifestyle emissions (kg CO2/year)
    const lifestyleEmissions = householdSize * CarbonCalculationService.LIFESTYLE_FACTOR;

    // 7. Air travel emissions (kg CO2/year)
    const airTravelEmissions = airTravelHours * CarbonCalculationService.AIR_TRAVEL_SPEED * CarbonCalculationService.AIR_TRAVEL_FACTOR;

    // Calculate totals
    const totalKg = electricityEmissions +
        transportEmissions +
        heatingEmissions +
        foodEmissions +
        wasteEmissions +
        lifestyleEmissions +
        airTravelEmissions;

    const totalTons = totalKg / 1000;

    // Breakdown by category (in tons)
    const breakdown = {
      electricity: electricityEmissions / 1000,
      transportation: transportEmissions / 1000,
      heating: heatingEmissions / 1000,
      food: foodEmissions / 1000,
      waste: wasteEmissions / 1000,
      lifestyle: lifestyleEmissions / 1000,
      air_travel: airTravelEmissions / 1000,
    };

    return {
      total_emissions_tons: totalTons,
      total_emissions_kg: totalKg,
      breakdown: breakdown,
      calculated_at: new Date().toISOString(),
    };
  }

  /**
   * Generate recommendations based on calculation
   * @param {Object} calculationResult - Result from calculate method
   * @returns {Array} Array of recommendation objects
   */
  generateRecommendations(calculationResult) {
    const recommendations = [];
    const breakdown = calculationResult.breakdown;

    // Electricity recommendations
    if (breakdown.electricity > 1.0) {
      recommendations.push({
        category: 'electricity',
        title: 'Reduce Electricity Usage',
        description: 'Switch to LED bulbs, use energy-efficient appliances, and unplug devices when not in use.',
        impact: 'Can reduce emissions by up to 30%',
        priority: 'high',
      });
    }

    // Transportation recommendations
    if (breakdown.transportation > 1.5) {
      recommendations.push({
        category: 'transportation',
        title: 'Use Public Transport or Carpool',
        description: 'Consider using public transportation, carpooling, or cycling for daily commutes.',
        impact: 'Can reduce emissions by up to 50%',
        priority: 'high',
      });
    }

    // Food recommendations
    if (breakdown.food > 0.5) {
      recommendations.push({
        category: 'food',
        title: 'Reduce Meat Consumption',
        description: 'Try incorporating more plant-based meals into your diet.',
        impact: 'Can reduce emissions by up to 40%',
        priority: 'medium',
      });
    }

    // Waste recommendations
    if (breakdown.waste > 0.3) {
      recommendations.push({
        category: 'waste',
        title: 'Improve Recycling',
        description: 'Start or improve your recycling practices to reduce waste emissions.',
        impact: 'Can reduce emissions by up to 25%',
        priority: 'medium',
      });
    }

    return recommendations;
  }
}

export default new CarbonCalculationService();

