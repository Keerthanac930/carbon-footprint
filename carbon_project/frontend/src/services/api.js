// API service for individual carbon footprint predictions
const API_BASE_URL = 'http://localhost:8000';

class CarbonFootprintAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 5000; // 5 seconds timeout
  }

  // Helper method to create fetch with timeout
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
  }

  // Authentication Methods
  async login(credentials) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('session_token');
      const response = await this.fetchWithTimeout(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('session_token');
      const response = await this.fetchWithTimeout(`${this.baseURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get current user');
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async getUserSessions() {
    try {
      const token = localStorage.getItem('session_token');
      const response = await this.fetchWithTimeout(`${this.baseURL}/auth/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user sessions');
      }

      const data = await response.json();
      return data.active_sessions || [];
    } catch (error) {
      console.error('Get user sessions error:', error);
      throw error;
    }
  }

  async getCarbonFootprintHistory() {
    try {
      const token = localStorage.getItem('session_token');
      const response = await this.fetchWithTimeout(`${this.baseURL}/carbon-footprint/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get carbon footprint history');
      }

      return await response.json();
    } catch (error) {
      console.error('Get carbon footprint history error:', error);
      throw error;
    }
  }

  async predictIndividual(data) {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/carbon-footprint/calculate-anonymous`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/create`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/update`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/calc?user_id=${userId}&type=${type}`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/simulate`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/recommendations?user_id=${userId}&type=${type}`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/timeline?user_id=${userId}&type=${type}`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/apply-recommendation`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/visual/avatar-state?user_id=${userId}&type=${type}`, {
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

      const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/twin/upload-csv`, {
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
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/health`, {
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
    household_size: formData.household_size || 4,
    electricity_usage_kwh: formData.electricity_usage_kwh || 500,
    home_size_sqft: formData.home_size_sqft || 1200,
    home_type: formData.home_type || 'apartment',
    heating_energy_source: formData.heating_energy_source || 'electric',
    cooling_energy_source: formData.cooling_energy_source || 'electric',
    vehicle_type: formData.vehicles?.[0]?.type || 'gasoline',
    fuel_type: formData.vehicles?.[0]?.fuel_type || 'gasoline',
    climate_zone: formData.climate_zone || 'moderate',
    meat_consumption: formData.meat_consumption || 'medium',
    cooking_method: formData.cooking_method || 'gas',
    recycling_practice: formData.recycling_practice || 'regular',
    income_level: formData.income_level || 'medium',
    location_type: formData.location_type || 'urban',
    vehicle_monthly_distance_km: formData.vehicles?.[0]?.monthly_distance_km || 500,
    vehicles_per_household: formData.vehicles?.length || 1,
    monthly_grocery_bill: formData.monthly_grocery_bill || 15000,
    waste_per_person: formData.waste_per_person || 2,
    air_travel_hours: formData.air_travel_hours || 10,
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
    home_age: formData.home_age || 10
  };

  return await api.predictIndividual(individualData);
};

export default CarbonFootprintAPI;