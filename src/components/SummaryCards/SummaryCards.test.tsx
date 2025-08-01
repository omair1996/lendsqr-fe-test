import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import SummaryCards from './SummaryCards';
import type { User } from '@/types/User';
import styles from './SummaryCards.module.scss';

// Helper function to create mock users with required properties
const createMockUser = (overrides: Partial<User>): User => ({
  id: '1',
  organization: 'Test Org',
  username: 'testuser',
  email: 'test@example.com',
  phone: '1234567890',
  date_joined: '2023-01-01T00:00:00Z',
  status: 'Active',
  profile: {
    avatar: 'avatar.jpg',
    full_name: 'Test User',
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
  hasSavings: false,
  ...overrides,
});

describe('SummaryCards Component', () => {
  const mockUsers: User[] = [
    createMockUser({ id: '1', status: 'Active', hasLoan: true, hasSavings: false }),
    createMockUser({ id: '2', status: 'Inactive', hasLoan: false, hasSavings: true }),
    createMockUser({ id: '3', status: 'Active', hasLoan: true, hasSavings: true }),
    createMockUser({ id: '4', status: 'Pending', hasLoan: false, hasSavings: false }),
    createMockUser({ id: '5', status: 'Active', hasLoan: false, hasSavings: true }),
  ];

  test('renders all summary cards', () => {
    render(<SummaryCards users={mockUsers} />);

    expect(screen.getByTestId('summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('total-users-card')).toBeInTheDocument();
    expect(screen.getByTestId('active-users-card')).toBeInTheDocument();
    expect(screen.getByTestId('loans-card')).toBeInTheDocument();
    expect(screen.getByTestId('savings-card')).toBeInTheDocument();
  });

  test('displays correct user counts', () => {
    render(<SummaryCards users={mockUsers} />);

    expect(screen.getByTestId('total-users-count')).toHaveTextContent('5');
    expect(screen.getByTestId('active-users-count')).toHaveTextContent('3');
    expect(screen.getByTestId('loans-count')).toHaveTextContent('2');
    expect(screen.getByTestId('savings-count')).toHaveTextContent('3');
  });

  test('renders all icons with correct colors', () => {
    render(<SummaryCards users={mockUsers} />);

    const usersIconWrapper = screen.getByTestId('users-icon').parentElement;
    expect(usersIconWrapper).toHaveStyle({ color: '#DF18FF' });

    const activeUsersIconWrapper = screen.getByTestId('active-users-icon').parentElement;
    expect(activeUsersIconWrapper).toHaveStyle({ color: '#5718FF' });

    const loansIconWrapper = screen.getByTestId('loans-icon').parentElement;
    expect(loansIconWrapper).toHaveStyle({ color: '#F55F44' });

    const savingsIconWrapper = screen.getByTestId('savings-icon').parentElement;
    expect(savingsIconWrapper).toHaveStyle({ color: '#FF3366' });
  });

  test('displays correct card labels', () => {
    render(<SummaryCards users={mockUsers} />);

    expect(screen.getByText('USERS')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
    expect(screen.getByText('USERS WITH LOANS')).toBeInTheDocument();
    expect(screen.getByText('USERS WITH SAVINGS')).toBeInTheDocument();
  });

  test('handles empty users array', () => {
    render(<SummaryCards users={[]} />);

    expect(screen.getByTestId('total-users-count')).toHaveTextContent('0');
    expect(screen.getByTestId('active-users-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loans-count')).toHaveTextContent('0');
    expect(screen.getByTestId('savings-count')).toHaveTextContent('0');
  });

  test('applies correct CSS classes', () => {
    render(<SummaryCards users={mockUsers} />);

    expect(screen.getByTestId('summary-cards')).toHaveClass(styles.cards);
    expect(screen.getByTestId('total-users-card')).toHaveClass(styles.card);
  });
});
