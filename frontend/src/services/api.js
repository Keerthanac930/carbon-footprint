// API service for individual carbon footprint predictions
const API_BASE_URL = 'http://localhost:9005';

class CarbonFootprintAPI {
  async predictIndividual(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/individual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting individual carbon footprint:', error);
      throw error;
    }
  }

  async createDigitalTwin(userId, type, baselineData, currentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/twin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          type: type,
          baseline_data: baselineData,
          current_data: currentData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating digital twin:', error);
      throw error;
    }
  }

  async updateDigitalTwin(userId, type, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/twin/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          type: type,
          data: data
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating digital twin:', error);
      throw error;
    }
  }

  async calculateTwinFootprint(userId, type) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/twin/calc?user_id=${userId}&type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating twin footprint:', error);
      throw error;
    }
  }

  async simulateScenario(userId, scenarioId, type, currentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/twin/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          scenario_id: scenarioId,
          type: type,
          current_data: currentData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error simulating scenario:', error);
      throw error;
    }
  }

  async getTwinRecommendations(userId, type) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/twin/recommendations?user_id=${userId}&type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting twin recommendations:', error);
      throw error;
    }
  }

  async getTwinTimeline(userId, type) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/twin/timeline?user_id=${userId}&type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting twin timeline:', error);
      throw error;
    }
  }

  async applyRecommendation(userId, recommendationId, type) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/twin/apply-recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          recommendation_id: recommendationId,
          type: type
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error applying recommendation:', error);
      throw error;
    }
  }

  async getAvatarState(userId, type) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visual/avatar-state?user_id=${userId}&type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting avatar state:', error);
      throw error;
    }
  }

  async uploadCSV(file, userId, type) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      formData.append('type', type);

      const response = await fetch(`${API_BASE_URL}/api/twin/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      throw error;
    }
  }

  async getHealthStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error;
    }
  }
}

// Legacy function for backward compatibility
export const submitCarbonData = async (formData) => {
  const api = new CarbonFootprintAPI();
  
  // Transform form data to match API format
  const individualData = {
    monthly_electricity: formData.electricity_usage_kwh || 0,
    monthly_transport: (formData.vehicles?.reduce((total, vehicle) => {
      return total + (vehicle.monthly_distance_km * 0.2); // 0.2 kg CO2e per km
    }, 0) || 0) + (formData.walking_cycling_distance_km * 0.05),
    monthly_waste: (formData.waste_per_person * 4 * formData.household_size) || 0,
    monthly_shopping: formData.monthly_grocery_bill * 0.0005 || 0,
    diet_type: formData.meat_consumption || 'vegetarian',
    heating_type: formData.heating_energy_source || 'electric',
    monthly_heating: (formData.electricity_usage_kwh * 0.3) || 0,
    monthly_water: (formData.household_size * 100 * 0.0003) || 0
  };

  return await api.predictIndividual(individualData);
};

export default CarbonFootprintAPI;