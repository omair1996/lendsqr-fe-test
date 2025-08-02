import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import UserDashboard from './UserDashboard';
import { setWithExpiry, getWithExpiry } from '@/lib/utils';
import type { User } from '@/types/User';

// Mock dependencies
vi.mock('@/lib/utils', () => ({
  getWithExpiry: vi.fn(),
  setWithExpiry: vi.fn(),
  cleanupExpiredLocalStorage: vi.fn(),
}));

vi.mock('@/contexts/SearchContext', () => ({
  useSearch: () => ({ search: '' }),
}));

// Mock user data
// Update mock user creation to include all required fields
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  organization: 'Test Org',
  username: 'testuser',
  email: 'test@example.com',
  phone: '1234567890',
  date_joined: '2023-01-01T00:00:00Z',
  status: 'Active',
  profile: {
    avatar: 'avatar.jpg',
    full_name: 'Test User', // Added required field
    bvn: '12345678901',
    gender: 'Male',
    marital_status: 'Single',
    children: '0',
    residence: 'Lagos',
    tier: 1,
    account_balance: '100000',
    account_number: 1234567890,
    bank_name: 'Test Bank',
  },
  education: {
    level: 'Bachelor', // Added required field
    status: 'Graduate',
    sector: 'Technology',
    duration: '4 years',
    office_email: 'test.work@example.com',
    monthly_income: [50000, 100000],
    loan_repayment: 0,
  },
  socials: {
    twitter: '@testuser',
    facebook: 'test.user',
    instagram: '@testuser',
  },
  guarantor: [
    // Added required field
    {
      name: 'Jane Doe',
      phone: '0987654321',
      email: 'jane@example.com',
      relationship: 'Sibling',
    },
  ],
  hasLoan: false,
  hasSavings: false,
  ...overrides,
});

const mockUsers = [
  createMockUser(),
  createMockUser({ id: '2', status: 'Inactive', username: 'janedoe' }),
];

describe('UserDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getWithExpiry).mockReturnValue(mockUsers);
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockUsers),
    });
  });

  test('renders title and summary cards', async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    // Check for title
    expect(screen.getByText('Users')).toBeInTheDocument();

    // Wait for cards to appear
    await waitFor(() => {
      // Check for specific card labels
      expect(screen.getByText('USERS')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
      expect(screen.getByText('USERS WITH LOANS')).toBeInTheDocument();
      expect(screen.getByText('USERS WITH SAVINGS')).toBeInTheDocument();
    });
  });

  test('loads users from localStorage when available', async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getWithExpiry).toHaveBeenCalledWith('users');
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  test('fetches users when not in localStorage', async () => {
    vi.mocked(getWithExpiry).mockReturnValue(null);

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/mock/users.json');
    });
  });

  test('displays desktop table on large screens', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  test('displays mobile cards on small screens', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mobile-table')).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    vi.mocked(getWithExpiry).mockReturnValue(null);
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('total-users-count')).toHaveTextContent('0');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  test('handles invalid user data in localStorage', async () => {
    vi.mocked(getWithExpiry).mockReturnValue('invalid-data');
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      const total = screen.getByTestId('total-users-count');
      console.log('Count:', total.textContent);
      expect(total).toHaveTextContent('2');
      expect(setWithExpiry).toHaveBeenCalledWith('users', mockUsers, 3600000);
    });
  });
});
