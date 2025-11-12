/**
 * Tests for CarbonCalculator component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CarbonCalculator from '../CarbonCalculator';
import * as api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('CarbonCalculator Component', () => {
  const renderCalculator = () => {
    return render(
      <BrowserRouter>
        <CarbonCalculator />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders calculator form', () => {
    renderCalculator();
    
    expect(screen.getByText(/carbon footprint calculator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/household size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/electricity usage/i)).toBeInTheDocument();
  });

  test('calculates carbon footprint', async () => {
    api.calculateCarbonFootprint.mockResolvedValue({
      predicted_emissions: 5000,
      confidence_score: 0.95,
      recommendations: [],
      breakdown: {
        electricity: 1500,
        transportation: 2000,
        heating: 1000,
        waste: 300,
        lifestyle: 200
      }
    });

    renderCalculator();
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/household size/i), {
      target: { value: '4' }
    });
    fireEvent.change(screen.getByLabelText(/electricity usage/i), {
      target: { value: '500' }
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.calculateCarbonFootprint).toHaveBeenCalled();
    });
  });

  test('displays calculation results', async () => {
    const mockResult = {
      predicted_emissions: 5000,
      confidence_score: 0.95,
      recommendations: [
        {
          category: 'Transportation',
          action: 'Use public transport',
          potential_savings: '500 kg CO2/year'
        }
      ],
      breakdown: {
        electricity: 1500,
        transportation: 2000,
        heating: 1000,
        waste: 300,
        lifestyle: 200
      }
    };

    api.calculateCarbonFootprint.mockResolvedValue(mockResult);

    renderCalculator();
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/household size/i), {
      target: { value: '4' }
    });
    fireEvent.change(screen.getByLabelText(/electricity usage/i), {
      target: { value: '500' }
    });
    
    const submitButton = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/5000/i)).toBeInTheDocument();
      expect(screen.getByText(/recommendations/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs', async () => {
    renderCalculator();
    
    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.calculateCarbonFootprint).not.toHaveBeenCalled();
    });
  });

  test('handles calculation errors', async () => {
    api.calculateCarbonFootprint.mockRejectedValue({
      response: {
        data: { detail: 'Calculation failed' }
      }
    });

    renderCalculator();
    
    fireEvent.change(screen.getByLabelText(/household size/i), {
      target: { value: '4' }
    });
    fireEvent.change(screen.getByLabelText(/electricity usage/i), {
      target: { value: '500' }
    });
    
    const submitButton = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

