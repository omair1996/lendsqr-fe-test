import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import Button from './Button';
import styles from './Button.module.scss';

describe('Button Component', () => {
  const mockOnClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders children correctly', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    test('applies primary variant by default', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles.primary);
      expect(button).not.toHaveClass(styles.secondary);
    });

    test('applies secondary variant when specified', () => {
      render(<Button variant="secondary">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles.secondary);
      expect(button).not.toHaveClass(styles.primary);
    });

    test('merges custom className correctly', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass(styles.button);
    });
  });

  describe('Functionality', () => {
    test('handles click events', () => {
      render(<Button onClick={mockOnClick}>Click Me</Button>);
      fireEvent.click(screen.getByText('Click Me'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('sets button type correctly', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
    });

    test('defaults to type="button"', () => {
      render(<Button>Default</Button>);
      expect(screen.getByText('Default')).toHaveAttribute('type', 'button');
    });
  });

  describe('Error Handling', () => {
    test('handles onClick errors gracefully', () => {
      const errorFn = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Button onClick={errorFn}>Error Button</Button>);
      fireEvent.click(screen.getByText('Error Button'));

      expect(errorFn).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Button click handler error:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
