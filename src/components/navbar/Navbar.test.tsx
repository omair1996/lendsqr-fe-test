import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Navbar from './Navbar';
import styles from './Navbar.module.scss';
import { useSearch } from '@/contexts/SearchContext';

// Mock the SearchContext
vi.mock('@/contexts/SearchContext', () => ({
  useSearch: vi.fn(() => ({
    search: '',
    setSearch: vi.fn(),
  })),
}));

describe('Navbar Component', () => {
  const mockSetSearch = vi.fn();

  beforeEach(() => {
    vi.mocked(useSearch).mockReturnValue({
      search: '',
      setSearch: mockSetSearch,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders all main elements', () => {
    render(<Navbar />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.getByTestId('docs-link')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-icon')).toBeInTheDocument();
    expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu-icon')).toBeInTheDocument();
  });

  test('displays default username and profile picture', () => {
    render(<Navbar />);

    expect(screen.getByTestId('username')).toHaveTextContent('Adedeji');
    expect(screen.getByTestId('profile-picture')).toHaveAttribute(
      'src',
      'https://avatar.iran.liara.run/public'
    );
  });

  test('allows custom username and profile picture', () => {
    render(<Navbar username="TestUser" profilePicture="https://example.com/profile.jpg" />);

    expect(screen.getByTestId('username')).toHaveTextContent('TestUser');
    expect(screen.getByTestId('profile-picture')).toHaveAttribute(
      'src',
      'https://example.com/profile.jpg'
    );
  });

  test('handles search input changes', () => {
    render(<Navbar />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockSetSearch).toHaveBeenCalledWith('test search');
  });

  test('applies correct CSS classes', () => {
    render(<Navbar />);

    expect(screen.getByTestId('navbar')).toHaveClass(styles.navbar);
    expect(screen.getByTestId('search-input')).toHaveClass(styles.searchInput);
    expect(screen.getByTestId('search-button')).toHaveClass(styles.searchBtn);
    expect(screen.getByTestId('docs-link')).toHaveClass(styles.docsLink);
  });

  test('has proper accessibility attributes', () => {
    render(<Navbar />);

    expect(screen.getByLabelText('Search input')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });
});
