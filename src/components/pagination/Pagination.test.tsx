import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import Pagination from './Pagination';
import styles from './Pagination.module.scss';

describe('Pagination Component', () => {
  const mockPageChange = vi.fn();
  const mockItemsPerPageChange = vi.fn();

  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: mockPageChange,
    itemsPerPage: 10,
    onItemsPerPageChange: mockItemsPerPageChange,
    totalItems: 100,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('does not render when totalPages <= 1', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders all main elements', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('items-per-page-selector')).toBeInTheDocument();
    expect(screen.getByTestId('page-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('prev-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });

  test('renders correct page buttons', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

    // Should show first, last, and surrounding pages
    expect(screen.getByTestId('page-button-1')).toBeInTheDocument();

    // Expect two sets of dots (left and right of current page)
    const dots = screen.getAllByTestId('pagination-dots');
    expect(dots.length).toBe(2);

    expect(screen.getByTestId('page-button-4')).toBeInTheDocument();
    expect(screen.getByTestId('page-button-5')).toBeInTheDocument();
    expect(screen.getByTestId('page-button-6')).toBeInTheDocument();
    expect(screen.getByTestId('page-button-10')).toBeInTheDocument();
  });

  test('marks current page as active', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const activeButton = screen.getByTestId('page-button-3');
    expect(activeButton).toHaveClass(styles.active);
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  test('handles page navigation clicks', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    fireEvent.click(screen.getByTestId('page-button-2'));
    expect(mockPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByTestId('prev-button'));
    expect(mockPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByTestId('next-button'));
    expect(mockPageChange).toHaveBeenCalledWith(4);
  });

  test('disables prev/next buttons when appropriate', () => {
    const { rerender } = render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByTestId('prev-button')).toBeDisabled();
    expect(screen.getByTestId('next-button')).not.toBeDisabled();

    rerender(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);
    expect(screen.getByTestId('prev-button')).not.toBeDisabled();
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  test('handles items per page change', () => {
    render(<Pagination {...defaultProps} />);

    const select = screen.getByTestId('items-per-page-select');
    fireEvent.change(select, { target: { value: '50' } });

    expect(mockItemsPerPageChange).toHaveBeenCalledWith(50);
  });

  test('shows correct items per page options', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByTestId('option-10')).toBeInTheDocument();
    expect(screen.getByTestId('option-50')).toBeInTheDocument();
    expect(screen.getByTestId('option-100')).toBeInTheDocument();
  });

  test('displays correct total items count', () => {
    render(<Pagination {...defaultProps} totalItems={250} />);

    expect(screen.getByText('out of 250')).toBeInTheDocument();
  });

  test('renders all pages when totalPages <= 7', () => {
    render(<Pagination {...defaultProps} totalPages={5} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`page-button-${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByTestId('pagination-dots')).not.toBeInTheDocument();
  });
});
