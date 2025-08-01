import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import styles from './Input.module.scss';
import InputField from './Input';

describe('InputField Component', () => {
  const mockOnChange = vi.fn();

  const defaultProps = {
    type: 'text' as const,
    placeholder: 'Enter text',
    value: '',
    onChange: mockOnChange,
    error: false,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders text input correctly', () => {
      render(<InputField {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('renders password input correctly', () => {
      render(<InputField {...defaultProps} type="password" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toHaveAttribute('type', 'password');
    });

    test('renders toggle button when showToggle is true', () => {
      render(<InputField {...defaultProps} type="password" showToggle={true} />);
      expect(screen.getByText('SHOW')).toBeInTheDocument();
    });

    test('does not render toggle button when showToggle is false', () => {
      render(<InputField {...defaultProps} type="password" showToggle={false} />);
      expect(screen.queryByText('SHOW')).not.toBeInTheDocument();
    });

    test('renders error message when error is true and touched', () => {
      render(<InputField {...defaultProps} error={true} value="test" />);
      fireEvent.blur(screen.getByPlaceholderText('Enter text'));
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    test('calls onChange when input value changes', () => {
      render(<InputField {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter text');
      fireEvent.change(input, { target: { value: 'new value' } });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test('toggles password visibility when showToggle is true', () => {
      render(<InputField {...defaultProps} type="password" showToggle={true} />);
      const toggle = screen.getByText('SHOW');

      // First click - show password
      fireEvent.click(toggle);
      expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'text');
      expect(toggle).toHaveTextContent('HIDE');

      // Second click - hide password
      fireEvent.click(toggle);
      expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'password');
      expect(toggle).toHaveTextContent('SHOW');
    });

    test('marks as touched on blur', () => {
      render(<InputField {...defaultProps} error={true} />);
      const input = screen.getByPlaceholderText('Enter text');

      // Should not show error before blur
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument();

      fireEvent.blur(input);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    test('marks as touched on change', () => {
      render(<InputField {...defaultProps} error={true} />);
      const input = screen.getByPlaceholderText('Enter text');

      fireEvent.change(input, { target: { value: 'test' } });
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('applies error class when error is true and touched', () => {
      render(<InputField {...defaultProps} error={true} />);
      const input = screen.getByPlaceholderText('Enter text');

      fireEvent.blur(input);
      expect(input).toHaveClass(styles.error);
    });

    test('does not show error until touched', () => {
      render(<InputField {...defaultProps} error={true} />);
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    });

    test('handles onChange errors gracefully', () => {
      const errorOnChange = vi.fn().mockImplementation(() => {
        throw new Error('Change error');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<InputField {...defaultProps} onChange={errorOnChange} />);
      const input = screen.getByPlaceholderText('Enter text');

      fireEvent.change(input, { target: { value: 'test' } });

      expect(errorOnChange).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in input change:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
