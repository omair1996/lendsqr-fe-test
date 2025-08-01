import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import ActionMenu from './ActionMenu';
import { setWithExpiry, cleanupExpiredLocalStorage } from '@/lib/utils';
import type { User } from '@/types/User';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/lib/utils', () => ({
  setWithExpiry: vi.fn(),
  cleanupExpiredLocalStorage: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockSetUsers = vi.fn();

// Mock user data with complete User interface
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  organization: 'Test Org',
  username: 'johndoe',
  email: 'john@example.com',
  phone: '1234567890',
  date_joined: '2023-01-01T00:00:00Z',
  status: 'Active',
  profile: {
    avatar: 'avatar.jpg',
    full_name: 'John Doe',
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
    office_email: 'john.work@example.com',
    monthly_income: [50000, 100000],
    loan_repayment: 0,
  },
  socials: {
    twitter: '@johndoe',
    facebook: 'john.doe',
    instagram: '@johndoe',
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
  ...overrides,
});

const mockActiveUser = createMockUser({ status: 'Active' });
const mockInactiveUser = createMockUser({
  id: '2',
  status: 'Inactive',
  profile: { ...createMockUser().profile, full_name: 'Jane Doe' },
});
const mockUserWithoutId = createMockUser({ id: '', status: 'Active' });

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('ActionMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    //  mock implementation for useNavigate
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Clean up localStorage between tests
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // POSITIVE SCENARIOS

  describe('Positive Scenarios', () => {
    test('renders menu trigger button correctly', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      const triggerButton = screen.getByRole('button');
      expect(triggerButton).toBeInTheDocument();
    });

    test('opens menu when trigger button is clicked', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      const triggerButton = screen.getByRole('button');
      fireEvent.click(triggerButton);

      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    test('closes menu when trigger button is clicked again', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      const triggerButton = screen.getByRole('button');

      // Open menu
      fireEvent.click(triggerButton);
      expect(screen.getByText('View Details')).toBeInTheDocument();

      // Close menu
      fireEvent.click(triggerButton);
      expect(screen.queryByText('View Details')).not.toBeInTheDocument();
    });

    test('displays correct status options for active user', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      expect(screen.getByText('Blacklisted')).toBeInTheDocument();
      expect(screen.queryByText('Activate')).not.toBeInTheDocument();
    });

    test('displays correct status options for inactive user', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockInactiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Activate')).toBeInTheDocument();
      expect(screen.getByText('Blacklisted')).toBeInTheDocument();
      expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
    });

    test('navigates to user details page when View Details is clicked', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('View Details'));

      expect(setWithExpiry).toHaveBeenCalledWith('selectedUser', mockActiveUser, 3600000);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/user/1');
    });

    test('updates user status when status change button is clicked', () => {
      const mockUsers = [mockActiveUser, mockInactiveUser];
      mockSetUsers.mockImplementation((callback) => {
        const result = callback(mockUsers);
        return result;
      });

      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Inactive'));

      expect(mockSetUsers).toHaveBeenCalled();
      expect(setWithExpiry).toHaveBeenCalledWith(
        'users',
        expect.arrayContaining([expect.objectContaining({ id: '1', status: 'Inactive' })]),
        3600000
      );
    });

    test('closes menu after status change', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('View Details')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Inactive'));
      expect(screen.queryByText('View Details')).not.toBeInTheDocument();
    });

    test('closes menu when clicking outside', async () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('View Details')).toBeInTheDocument();

      // Click outside the menu
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByText('View Details')).not.toBeInTheDocument();
      });
    });
  });

  // NEGATIVE SCENARIOS

  describe('Negative Scenarios', () => {
    test('handles user without ID gracefully', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockUserWithoutId} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('View Details'));

      expect(console.error).toHaveBeenCalledWith('User ID is missing');
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(setWithExpiry).not.toHaveBeenCalledWith(
        'selectedUser',
        expect.any(Object),
        expect.any(Number)
      );
    });

    test('handles setUsers function throwing error', () => {
      const errorThrowingSetUsers = vi.fn().mockImplementation(() => {
        throw new Error('Update failed');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error');

      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={errorThrowingSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Inactive'));

      // Verify the error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating user status:',
        expect.any(Error)
      );
      // Verify the menu is closed (component didn't crash)
      expect(screen.queryByText('View Details')).not.toBeInTheDocument();
    });
    test('handles unknown status gracefully', () => {
      const userWithUnknownStatus = createMockUser({ status: 'Unknown' });

      render(
        <TestWrapper>
          <ActionMenu user={userWithUnknownStatus} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button'));

      // Should show all three status options since 'unknown' is not in the filter list
      expect(screen.getByText('Activate')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      expect(screen.getByText('Blacklisted')).toBeInTheDocument();
    });

    // NEW TEST: Verify cleanupExpiredLocalStorage is called
    test('calls cleanupExpiredLocalStorage on mount', () => {
      render(
        <TestWrapper>
          <ActionMenu user={mockActiveUser} setUsers={mockSetUsers} />
        </TestWrapper>
      );

      expect(cleanupExpiredLocalStorage).toHaveBeenCalled();
    });
  });
});
