import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import User from './User';

// Mock the UserDashboard component
vi.mock('@/components/userDashboard/UserDashboard', () => ({
  default: () => <div data-testid="user-dashboard">User Dashboard</div>,
}));

describe('User Page', () => {
  test('renders without crashing', () => {
    render(<User />);
    expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
  });

  test('displays the UserDashboard component', () => {
    render(<User />);
    expect(screen.getByTestId('user-dashboard')).toHaveTextContent('User Dashboard');
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<User />);
    expect(asFragment()).toMatchSnapshot();
  });
});
