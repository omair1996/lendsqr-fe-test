import { render, screen, fireEvent } from '@testing-library/react';

import { describe, test, expect, vi } from 'vitest';
import { SearchProvider, useSearch } from './SearchContext';
import { useState } from 'react';

// Test component that uses the context
const TestComponent = () => {
  const { search, setSearch } = useSearch();
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    setSearch(inputValue);
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter search"
        data-testid="search-input"
      />
      <button onClick={handleClick} data-testid="set-search">
        Set Search
      </button>
      <div data-testid="current-search">{search}</div>
    </div>
  );
};

describe('SearchContext', () => {
  test('provides search value to consuming components', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    expect(screen.getByTestId('current-search')).toHaveTextContent('');
  });

  test('allows updating search value', async () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    const input = screen.getByPlaceholderText('Enter search');
    const button = screen.getByTestId('set-search');

    // Type new search value
    fireEvent.change(input, { target: { value: 'test query' } });

    // Update context
    fireEvent.click(button);

    // Verify context update
    expect(screen.getByTestId('current-search')).toHaveTextContent('test query');
  });

  test('throws error when used outside provider', () => {
    // Prevent React from logging the error
    const consoleError = vi.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});

    // Test component without provider
    const ComponentWithoutProvider = () => {
      useSearch();
      return null;
    };

    // Should throw error
    expect(() => render(<ComponentWithoutProvider />)).toThrowError(
      'useSearch must be used within a SearchProvider'
    );

    consoleError.mockRestore();
  });

  test('shares context state between components', () => {
    const DisplaySearch = () => {
      const { search } = useSearch();
      return <div data-testid="display-search">{search}</div>;
    };

    render(
      <SearchProvider>
        <TestComponent />
        <DisplaySearch />
      </SearchProvider>
    );

    const input = screen.getByPlaceholderText('Enter search');
    const button = screen.getByTestId('set-search');

    fireEvent.change(input, { target: { value: 'shared state' } });
    fireEvent.click(button);

    // Both components should show the same value
    expect(screen.getByTestId('current-search')).toHaveTextContent('shared state');
    expect(screen.getByTestId('display-search')).toHaveTextContent('shared state');
  });

  test('maintains context state on re-renders', () => {
    const { rerender } = render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    // Set initial search
    fireEvent.change(screen.getByPlaceholderText('Enter search'), {
      target: { value: 'persistent' },
    });
    fireEvent.click(screen.getByTestId('set-search'));

    // Re-render
    rerender(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    // State should persist
    expect(screen.getByTestId('current-search')).toHaveTextContent('persistent');
  });
});
