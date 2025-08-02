import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import FilterModal, { createHandleChange } from './FilterModal';

describe('FilterModal Component', () => {
  const mockValues = {
    organization: '',
    username: '',
    email: '',
    date: '',
    phone: '',
    status: '',
  };

  const mockOnClose = vi.fn();
  const mockOnApply = vi.fn();
  const mockOnReset = vi.fn();
  const mockSetValues = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders all form fields correctly', () => {
      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={mockOnApply}
          onReset={mockOnReset}
          values={mockValues}
          setValues={mockSetValues}
        />
      );

      expect(screen.getByLabelText('ORGANIZATION')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('user')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
      expect(screen.getByLabelText('DATE')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('phone number')).toBeInTheDocument();
      expect(screen.getByLabelText('STATUS')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    test('displays current values in inputs', () => {
      const values = {
        organization: 'Lendstar',
        username: 'testuser',
        email: 'test@example.com',
        date: '2023-01-01',
        phone: '1234567890',
        status: 'active',
      };

      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={mockOnApply}
          onReset={mockOnReset}
          values={values}
          setValues={mockSetValues}
        />
      );

      expect(screen.getByDisplayValue('Lendstar')).toBeInTheDocument();
      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'STATUS' })).toHaveTextContent('Active');
    });
  });

  describe('Functionality', () => {
    test('calls onClose when close button is clicked', () => {
      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={mockOnApply}
          onReset={mockOnReset}
          values={mockValues}
          setValues={mockSetValues}
        />
      );

      fireEvent.click(screen.getByLabelText('Close'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('updates values when inputs change', () => {
      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={mockOnApply}
          onReset={mockOnReset}
          values={mockValues}
          setValues={mockSetValues}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('user'), {
        target: { value: 'newuser' },
      });

      expect(mockSetValues).toHaveBeenCalled();
      const updaterFunction = mockSetValues.mock.calls[0][0];
      const result = updaterFunction(mockValues);
      expect(result).toEqual({ ...mockValues, username: 'newuser' });
    });

    test('calls onReset when reset button is clicked', () => {
      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={mockOnApply}
          onReset={mockOnReset}
          values={mockValues}
          setValues={mockSetValues}
        />
      );

      fireEvent.click(screen.getByText('Reset'));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    test('calls onApply with current values when filter button is clicked', () => {
      const values = {
        organization: 'Lendsqr',
        username: 'testuser',
        email: 'test@example.com',
        date: '2023-01-01',
        phone: '1234567890',
        status: 'active',
      };

      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={mockOnApply}
          onReset={mockOnReset}
          values={values}
          setValues={mockSetValues}
        />
      );

      fireEvent.click(screen.getByText('Filter'));
      expect(mockOnApply).toHaveBeenCalledWith(values);
    });
  });

  describe('Error Handling', () => {
    test('handles onApply errors gracefully', () => {
      const errorOnApply = vi.fn().mockImplementation(() => {
        throw new Error('Apply failed');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={errorOnApply}
          onReset={mockOnReset}
          values={mockValues}
          setValues={mockSetValues}
        />
      );

      fireEvent.click(screen.getByText('Filter'));
      expect(errorOnApply).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Filter apply error:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });

    test('handles onReset errors gracefully', () => {
      const errorOnReset = vi.fn().mockImplementation(() => {
        throw new Error('Reset failed');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <FilterModal
          onClose={mockOnClose}
          onApply={mockOnApply}
          onReset={errorOnReset}
          values={mockValues}
          setValues={mockSetValues}
        />
      );

      fireEvent.click(screen.getByText('Reset'));
      expect(errorOnReset).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Filter reset error:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});

describe('createHandleChange', () => {
  test('updates the correct field in state', () => {
    const setValues = vi.fn();
    const handleChange = createHandleChange(setValues);

    handleChange('username', 'newuser');

    expect(setValues).toHaveBeenCalled();
    const updaterFunction = setValues.mock.calls[0][0];
    const result = updaterFunction({
      organization: '',
      username: '',
      email: '',
      date: '',
      phone: '',
      status: '',
    });
    expect(result).toEqual({
      organization: '',
      username: 'newuser',
      email: '',
      date: '',
      phone: '',
      status: '',
    });
  });
});
