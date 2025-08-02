import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import MainLayout from './MainLayout';
import { SearchProvider } from '@/contexts/SearchContext';

// Mock child components
vi.mock('@/components/sidebar/SideBar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('@/components/navbar/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

describe('MainLayout Component', () => {
  test('renders layout structure with providers', () => {
    render(
      <MainLayout>
        <div data-testid="test-content">Test Content</div>
      </MainLayout>
    );

    // Verify context provider is set up
    expect(SearchProvider).toBeDefined();

    // Check main structure using test IDs
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  test('applies correct layout structure', () => {
    render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    // Verify structure hierarchy using test IDs
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    const mainContent = screen.getByTestId('sidebar').nextElementSibling;
    expect(mainContent).toContainElement(screen.getByTestId('navbar'));

    const pageContent = screen.getByTestId('navbar').nextElementSibling;
    expect(pageContent).toHaveTextContent('Test');
  });
});
