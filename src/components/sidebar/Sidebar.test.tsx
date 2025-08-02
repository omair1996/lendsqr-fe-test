import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import styles from './Sidebar.module.scss';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './SideBar';

// Mock window.innerWidth
const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Reset window size before each test
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });

  const renderSidebar = () => {
    return render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  };

  test('renders logo and collapse button', () => {
    renderSidebar();

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('collapse-button')).toBeInTheDocument();
  });

  test('renders all sidebar sections and items', () => {
    renderSidebar();

    // Check for section headers
    expect(screen.getAllByTestId('sidebar-section').length).toBe(3);
    expect(screen.getByText('CUSTOMERS')).toBeInTheDocument();
    expect(screen.getByText('BUSINESSES')).toBeInTheDocument();
    expect(screen.getByText('SETTINGS')).toBeInTheDocument();

    // Check for some specific items
    expect(screen.getByTestId('nav-link-users')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-organization')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-preferences')).toBeInTheDocument();
  });

  test('toggles collapsed state when collapse button is clicked', () => {
    renderSidebar();

    const collapseBtn = screen.getByTestId('collapse-button');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('sidebar')).toHaveClass(styles.collapsed);
    fireEvent.click(collapseBtn);
    expect(screen.getByTestId('sidebar')).not.toHaveClass(styles.collapsed);
  });

  test('hides text labels when collapsed', () => {
    renderSidebar();

    const collapseBtn = screen.getByTestId('collapse-button');
    fireEvent.click(collapseBtn);

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
  });

  test('shows mobile menu button on small screens', () => {
    // Set mobile size
    window.innerWidth = 768;
    renderSidebar();

    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
  });

  test('expands sidebar when mobile menu button is clicked', () => {
    // Set mobile size
    window.innerWidth = 768;
    renderSidebar();

    const menuBtn = screen.getByTestId('mobile-menu-button');
    fireEvent.click(menuBtn);

    expect(screen.getByTestId('sidebar')).not.toHaveClass(styles.collapsed);
  });

  test('marks active nav link', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/user']}>
        <Sidebar />
      </MemoryRouter>
    );

    const usersLink = screen.getByTestId('nav-link-users');
    expect(usersLink).toHaveClass(styles.active);
  });

  test('renders organization switcher with special styling', () => {
    renderSidebar();

    const orgSwitcher = screen.getByTestId('nav-item-switch-organization');
    expect(orgSwitcher).toHaveClass(styles.orgSwitch);
  });

  test('collapses sidebar by default on mobile', () => {
    // Set mobile size
    window.innerWidth = 768;
    renderSidebar();

    expect(screen.getByTestId('sidebar')).toHaveClass(styles.collapsed);
  });
});

// Cleanup
afterAll(() => {
  window.innerWidth = originalInnerWidth;
  window.innerHeight = originalInnerHeight;
});
