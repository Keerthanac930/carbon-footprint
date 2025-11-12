/**
 * Tests for SignIn component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../SignIn';
import * as api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('SignIn Component', () => {
  const renderSignIn = () => {
    return render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sign in form', () => {
    renderSignIn();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    api.loginUser.mockResolvedValue({
      session_token: 'test_token_12345',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      }
    });

    renderSignIn();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'TestPassword123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        password: 'TestPassword123!'
      });
    });
  });

  test('shows error message on login failure', async () => {
    api.loginUser.mockRejectedValue({
      response: {
        data: { detail: 'Invalid email or password' }
      }
    });

    renderSignIn();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'WrongPassword123!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  test('validates required fields', async () => {
    renderSignIn();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.loginUser).not.toHaveBeenCalled();
    });
  });
});

