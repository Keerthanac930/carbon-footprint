/**
 * Tests for API service
 */
import axios from 'axios';
import * as api from '../api';

jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('registerUser', () => {
    test('registers a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      };

      axios.post.mockResolvedValue({ data: mockUser });

      const result = await api.registerUser({
        email: 'test@example.com',
        name: 'Test User',
        password: 'TestPassword123!'
      });

      expect(axios.post).toHaveBeenCalledWith(
        '/auth/register',
        {
          email: 'test@example.com',
          name: 'Test User',
          password: 'TestPassword123!'
        }
      );
      expect(result).toEqual(mockUser);
    });

    test('handles registration errors', async () => {
      axios.post.mockRejectedValue({
        response: {
          data: { detail: 'Email already registered' }
        }
      });

      await expect(api.registerUser({
        email: 'existing@example.com',
        name: 'User',
        password: 'Password123!'
      })).rejects.toThrow();
    });
  });

  describe('loginUser', () => {
    test('logs in user successfully', async () => {
      const mockResponse = {
        session_token: 'test_token_12345',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await api.loginUser({
        email: 'test@example.com',
        name: 'Test User',
        password: 'TestPassword123!'
      });

      expect(axios.post).toHaveBeenCalledWith(
        '/auth/login',
        {
          email: 'test@example.com',
          name: 'Test User',
          password: 'TestPassword123!'
        }
      );
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('session_token')).toBe('test_token_12345');
    });

    test('handles login errors', async () => {
      axios.post.mockRejectedValue({
        response: {
          data: { detail: 'Invalid email or password' }
        }
      });

      await expect(api.loginUser({
        email: 'wrong@example.com',
        name: 'User',
        password: 'WrongPassword123!'
      })).rejects.toThrow();
    });
  });

  describe('calculateCarbonFootprint', () => {
    test('calculates carbon footprint successfully', async () => {
      const mockResult = {
        predicted_emissions: 5000,
        confidence_score: 0.95,
        recommendations: []
      };

      axios.post.mockResolvedValue({ data: mockResult });

      const result = await api.calculateCarbonFootprint({
        household_size: 4,
        electricity_usage_kwh: 500
      });

      expect(axios.post).toHaveBeenCalledWith(
        '/carbon-footprint/calculate',
        {
          household_size: 4,
          electricity_usage_kwh: 500
        },
        expect.any(Object)
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getCarbonFootprintHistory', () => {
    test('retrieves carbon footprint history', async () => {
      const mockHistory = [
        { id: 1, total_emissions: 5000 },
        { id: 2, total_emissions: 4500 }
      ];

      axios.get.mockResolvedValue({ data: mockHistory });

      const result = await api.getCarbonFootprintHistory();

      expect(axios.get).toHaveBeenCalledWith(
        '/carbon-footprint/history',
        expect.any(Object)
      );
      expect(result).toEqual(mockHistory);
    });
  });

  describe('getDashboardData', () => {
    test('retrieves dashboard data', async () => {
      const mockDashboard = {
        stats: { total_calculations: 5 },
        trends: [],
        recommendations: []
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      const result = await api.getDashboardData();

      expect(axios.get).toHaveBeenCalledWith(
        '/carbon-footprint/dashboard',
        expect.any(Object)
      );
      expect(result).toEqual(mockDashboard);
    });
  });
});

