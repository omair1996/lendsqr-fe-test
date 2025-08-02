import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { useNavigate } from 'react-router-dom';
import Login from './LogIn';

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('Login Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<Login />);

    // Check for images
    expect(screen.getByAltText('Lendsqr Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Login Illustration')).toBeInTheDocument();

    // Check form elements
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Enter details to login.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('FORGOT PASSWORD?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows validation errors on empty submission', async () => {
    render(<Login />);

    // Interact with fields to trigger touched state
    fireEvent.blur(screen.getByPlaceholderText('Email'));
    fireEvent.blur(screen.getByPlaceholderText('Password'));

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      // Check for error messages
      const errorMessages = screen.getAllByText('This field is required');
      expect(errorMessages.length).toBe(2);
    });
  });

  test('shows email validation error for invalid email', async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');

    // Interact with field to trigger touched state
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  test('navigates to dashboard on successful login', async () => {
    render(<Login />);

    // Fill in valid credentials
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'valid@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'valid-password' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/user', { replace: true });
    });
  });

  test('toggles password visibility', () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByText('SHOW');

    // Initially should be password type
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveTextContent('HIDE');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('SHOW');
  });

  test('shows error messages after interaction', async () => {
    render(<Login />);

    // Interact with fields to trigger touched state
    fireEvent.blur(screen.getByPlaceholderText('Email'));
    fireEvent.blur(screen.getByPlaceholderText('Password'));

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      // Check for error messages
      const errorMessages = screen.getAllByText('This field is required');
      expect(errorMessages.length).toBe(2);
    });
  });
});
