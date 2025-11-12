/**
 * Tests for SignUp component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../SignUp';
import * as api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('SignUp Component', () => {
  const renderSignUp = () => {
    return render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sign up form', () => {
    renderSignUp();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderSignUp();
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.registerUser).not.toHaveBeenCalled();
    });
  });

  test('submits form with valid data', async () => {
    api.registerUser.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      name: 'Test User'
    });

    renderSignUp();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'TestPassword123!' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'TestPassword123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(api.registerUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        password: 'TestPassword123!'
      });
    });
  });

  test('shows error message on registration failure', async () => {
    api.registerUser.mockRejectedValue({
      response: {
        data: { detail: 'Email already registered' }
      }
    });

    renderSignUp();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'TestPassword123!' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'TestPassword123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });

  test('validates password match', async () => {
    renderSignUp();
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'TestPassword123!' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'DifferentPassword123!' }
    });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});

