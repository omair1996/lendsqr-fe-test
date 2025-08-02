import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import UserDetails from './UserDetails';
import type { User } from '@/types/User';
import { setWithExpiry, getWithExpiry } from '@/lib/utils';

// Mock dependencies
vi.mock('@/lib/utils', () => ({
  setWithExpiry: vi.fn(),
  getWithExpiry: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Create mock user data
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
    full_name: 'Test User',
    bvn: '12345678901',
    gender: 'Male',
    marital_status: 'Single',
    children: '0',
    residence: 'Lagos',
    tier: 3,
    account_balance: '100000.50',
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
    loan_repayment: 5000,
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
    {
      name: 'John Smith',
      phone: '0987654322',
      email: 'john@example.com',
      relationship: 'Friend',
    },
  ],
  hasLoan: false,
  hasSavings: true,
  ...overrides,
});

describe('UserDetails Component', () => {
  const mockUser = createMockUser();
  const savedUsers = [mockUser, createMockUser({ id: '2', status: 'Inactive' })];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getWithExpiry).mockImplementation((key) => {
      if (key === 'users') return savedUsers;
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders all user details correctly', () => {
    render(
      <MemoryRouter>
        <UserDetails user={mockUser} />
      </MemoryRouter>
    );

    // Header section
    expect(screen.getByText('Back to Users')).toBeInTheDocument();
    expect(screen.getByText('User Details')).toBeInTheDocument();

    // Status buttons
    expect(screen.getByText('Inactive User')).toBeInTheDocument();
    expect(screen.getByText('Blacklisted User')).toBeInTheDocument();

    // Summary card
    const summaryCard = screen.getByText(mockUser.username).closest('div')!;
    expect(summaryCard).toHaveTextContent(mockUser.profile.full_name);
    expect(screen.getByText('⭐️⭐️⭐️')).toBeInTheDocument();
    expect(screen.getByText('₦100,000.50')).toBeInTheDocument();
    expect(
      screen.getByText(`${mockUser.profile.account_number} / ${mockUser.profile.bank_name}`)
    ).toBeInTheDocument();

    // Tabs
    expect(screen.getByText('General Details')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Bank Details')).toBeInTheDocument();

    // Personal Info
    const personalSection = screen.getByText('Personal Information').closest('section')!;
    expect(personalSection).toHaveTextContent(mockUser.profile.full_name);
    expect(personalSection).toHaveTextContent(mockUser.phone);
    expect(personalSection).toHaveTextContent(mockUser.email);
    expect(personalSection).toHaveTextContent(mockUser.profile.bvn);
    expect(personalSection).toHaveTextContent(mockUser.profile.gender);
    expect(personalSection).toHaveTextContent(mockUser.profile.marital_status);
    expect(personalSection).toHaveTextContent(mockUser.profile.children);
    expect(personalSection).toHaveTextContent(mockUser.profile.residence);

    // Education
    const educationSection = screen.getByText('Education and Employment').closest('section')!;
    expect(educationSection).toHaveTextContent(mockUser.education.level);
    expect(educationSection).toHaveTextContent(mockUser.education.status);
    expect(educationSection).toHaveTextContent(mockUser.education.sector);
    expect(educationSection).toHaveTextContent(mockUser.education.duration);
    expect(educationSection).toHaveTextContent(mockUser.education.office_email);
    expect(educationSection).toHaveTextContent('₦50,000 - ₦100,000');
    expect(educationSection).toHaveTextContent('₦5,000');

    // Socials
    const socialsSection = screen.getByText('Socials').closest('section')!;
    expect(socialsSection).toHaveTextContent(mockUser.socials.twitter);
    expect(socialsSection).toHaveTextContent(mockUser.socials.facebook);
    expect(socialsSection).toHaveTextContent(mockUser.socials.instagram);

    // Guarantors
    const guarantorSection = screen.getByText('Guarantor').closest('section')!;
    expect(guarantorSection).toHaveTextContent('Jane Doe');
    expect(guarantorSection).toHaveTextContent('0987654321');
    expect(guarantorSection).toHaveTextContent('jane@example.com');
    expect(guarantorSection).toHaveTextContent('Sibling');
    expect(guarantorSection).toHaveTextContent('John Smith');
  });

  test('navigates back when back button is clicked', () => {
    render(
      <MemoryRouter>
        <UserDetails user={mockUser} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Back to Users'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('changes user status and updates localStorage', async () => {
    render(
      <MemoryRouter>
        <UserDetails user={mockUser} />
      </MemoryRouter>
    );

    // Click "Inactive User" button
    fireEvent.click(screen.getByText('Inactive User'));

    await waitFor(() => {
      // Verify localStorage updates
      expect(setWithExpiry).toHaveBeenCalledWith(
        'selectedUser',
        expect.objectContaining({ status: 'Inactive' }),
        3600000
      );

      expect(setWithExpiry).toHaveBeenCalledWith(
        'users',
        expect.arrayContaining([
          expect.objectContaining({ id: '1', status: 'Inactive' }),
          expect.objectContaining({ id: '2', status: 'Inactive' }),
        ]),
        3600000
      );
    });
  });

  test('handles status change for different statuses', () => {
    render(
      <MemoryRouter>
        <UserDetails user={mockUser} />
      </MemoryRouter>
    );

    // Test blacklist button
    fireEvent.click(screen.getByText('Blacklisted User'));
    expect(setWithExpiry).toHaveBeenCalledWith(
      'selectedUser',
      expect.objectContaining({ status: 'Blacklisted' }),
      3600000
    );
  });

  test('applies correct button classes based on status', () => {
    render(
      <MemoryRouter>
        <UserDetails user={mockUser} />
      </MemoryRouter>
    );

    const inactiveButton = screen.getByText('Inactive User');
    const blacklistButton = screen.getByText('Blacklisted User');

    // Check for existence of classes rather than specific names
    expect(inactiveButton.className).toMatch(/inactive/);
    expect(blacklistButton.className).toMatch(/blacklist/);
  });

  test('dispatches storage event after status change', async () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    render(
      <MemoryRouter>
        <UserDetails user={mockUser} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Inactive User'));

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));
    });
  });

  test('handles user with different initial status', () => {
    const inactiveUser = createMockUser({ status: 'Inactive' });

    render(
      <MemoryRouter>
        <UserDetails user={inactiveUser} />
      </MemoryRouter>
    );

    // Should show active and blacklisted buttons (not inactive)
    expect(screen.getByText('Active User')).toBeInTheDocument();
    expect(screen.getByText('Blacklisted User')).toBeInTheDocument();
    expect(screen.queryByText('Inactive User')).not.toBeInTheDocument();
  });

  test('formats account balance correctly', () => {
    const userWithDecimal = createMockUser({
      profile: { ...mockUser.profile, account_balance: '1234567.89' },
    });

    render(
      <MemoryRouter>
        <UserDetails user={userWithDecimal} />
      </MemoryRouter>
    );

    expect(screen.getByText('₦1,234,567.89')).toBeInTheDocument();
  });

  test('renders multiple guarantors correctly', () => {
    render(
      <MemoryRouter>
        <UserDetails user={mockUser} />
      </MemoryRouter>
    );

    const guarantorSections = screen.getAllByText('Guarantor');
    expect(guarantorSections.length).toBe(1); // Only one heading

    // But two guarantor entries in the content
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  test('handles missing optional fields gracefully', () => {
    const minimalUser = createMockUser({
      socials: { twitter: '', facebook: '', instagram: '' },
      guarantor: [],
    });

    render(
      <MemoryRouter>
        <UserDetails user={minimalUser} />
      </MemoryRouter>
    );

    // Socials should be empty
    expect(screen.getByText('Twitter').nextSibling).toHaveTextContent('');

    // Guarantor section should still exist but with no data
    expect(screen.getByText('Guarantor')).toBeInTheDocument();
  });
});
