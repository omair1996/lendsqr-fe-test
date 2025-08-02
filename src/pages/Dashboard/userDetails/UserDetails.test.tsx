import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useParams } from 'react-router-dom';
import { getWithExpiry } from '@/lib/utils';
import type { User } from '@/types/User';
import UserDetailsPage from './UserDetails';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  getWithExpiry: vi.fn(),
}));

vi.mock('@/components/userDetails/UserDetails', () => ({
  default: ({ user }: { user: User }) => (
    <div data-testid="user-details">{user.profile.full_name}</div>
  ),
}));

// Create mock user data
const createMockUser = (id: string | number): User => ({
  id: id.toString(),
  organization: 'Test Org',
  username: 'testuser',
  email: 'test@example.com',
  phone: '1234567890',
  date_joined: '2023-01-01T00:00:00Z',
  status: 'Active',
  profile: {
    avatar: 'avatar.jpg',
    full_name: `User ${id}`,
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
    level: 'Bachelor',
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
    {
      name: 'Jane Doe',
      phone: '0987654321',
      email: 'jane@example.com',
      relationship: 'Sibling',
    },
  ],
  hasLoan: false,
  hasSavings: true,
});

describe('UserDetailsPage', () => {
  const mockUser1 = createMockUser(1);
  const mockUser2 = createMockUser(2);
  const mockUsers = [mockUser1, mockUser2];

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset fetch mock
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockUsers),
    });

    // Reset localStorage mock
    vi.mocked(getWithExpiry).mockReturnValue(null);
  });

  test('renders loading state initially', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    render(<UserDetailsPage />);
    expect(screen.getByText('User not found...')).toBeInTheDocument();
  });

  test('loads user from localStorage when available', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(getWithExpiry).mockReturnValue(mockUser1);

    render(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-details')).toHaveTextContent('User 1');
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  test('fetches user when not in localStorage', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '2' });

    render(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-details')).toHaveTextContent('User 2');
      expect(fetch).toHaveBeenCalledWith('/mock/users.json');
    });
  });

  test('shows not found message when user doesnt exist', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });

    render(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('User not found...')).toBeInTheDocument();
      expect(screen.queryByTestId('user-details')).not.toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '2' });
    global.fetch = vi.fn().mockRejectedValue(new Error('Fetch failed'));

    render(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('User not found...')).toBeInTheDocument();
    });
  });

  test('updates when id changes', async () => {
    // Set initial params before first render
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    const { rerender } = render(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-details')).toHaveTextContent('User 1');
    });

    // Update params for rerender
    vi.mocked(useParams).mockReturnValue({ id: '2' });
    rerender(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-details')).toHaveTextContent('User 2');
    });
  });

  test('matches user id correctly', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    render(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-details')).toHaveTextContent('User 1');
    });
  });

  test('does not use localStorage if user id doesnt match', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '2' });
    vi.mocked(getWithExpiry).mockReturnValue(mockUser1); // Wrong user in storage

    render(<UserDetailsPage />);

    await waitFor(() => {
      // Should fetch instead of using localStorage
      expect(fetch).toHaveBeenCalled();
      // Should show correct user (user2) from API
      expect(screen.getByTestId('user-details')).toHaveTextContent('User 2');
    });
  });

  test('handles fetch error gracefully', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '2' });

    // Mock console.error to prevent test logs from cluttering
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Create and catch the rejected promise
    const rejectedPromise = Promise.reject(new Error('Fetch failed'));
    rejectedPromise.catch(() => {}); // Explicitly handle rejection
    global.fetch = vi.fn().mockReturnValue(rejectedPromise);

    render(<UserDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('User not found...')).toBeInTheDocument();
    });

    // Clean up console mock
    consoleErrorSpy.mockRestore();
  });
});
