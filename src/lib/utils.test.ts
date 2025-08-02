import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, setWithExpiry, getWithExpiry, cleanupExpiredLocalStorage } from './utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

beforeEach(() => {
  // Reset mocks and clear storage
  vi.clearAllMocks();
  localStorageMock.clear();

  // Replace global localStorage with mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cn utility', () => {
  test('combines string arguments', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  test('handles object arguments', () => {
    const result = cn({ active: true, disabled: false }, 'text-base');
    expect(result).toBe('active text-base');
  });

  test('filters falsy values', () => {
    expect(cn('class1', null, undefined, false, 'class2')).toBe('class1 class2');
  });

  test('handles mixed arguments', () => {
    const result = cn('btn', { primary: true, secondary: false }, 'px-4', undefined, {
      'py-2': true,
    });
    expect(result).toBe('btn primary px-4 py-2');
  });

  test('returns empty string for no valid inputs', () => {
    expect(cn(null, undefined, false, { inactive: false })).toBe('');
  });
});

describe('localStorage utilities', () => {
  const mockDate = new Date(2023, 0, 1, 12, 0, 0); // Jan 1, 2023 12:00:00

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('setWithExpiry stores item with expiry', () => {
    const testData = { user: 'test' };
    setWithExpiry('testKey', testData, 3600000); // 1 hour expiry

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify({
        value: testData,
        expiry: mockDate.getTime() + 3600000,
      })
    );
  });

  test('getWithExpiry returns item before expiry', () => {
    const testData = { user: 'test' };
    const expiry = mockDate.getTime() + 3600000; // 1 hour from now
    localStorageMock.setItem('testKey', JSON.stringify({ value: testData, expiry }));

    const result = getWithExpiry('testKey');
    expect(result).toEqual(testData);
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  test('getWithExpiry removes and returns null for expired item', () => {
    const testData = { user: 'test' };
    const expiry = mockDate.getTime() - 1000; // 1 second expired
    localStorageMock.setItem('testKey', JSON.stringify({ value: testData, expiry }));

    const result = getWithExpiry('testKey');
    expect(result).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
  });

  test('getWithExpiry returns null for non-existent key', () => {
    const result = getWithExpiry('nonExistentKey');
    expect(result).toBeNull();
  });

  test('getWithExpiry handles invalid JSON gracefully', () => {
    localStorageMock.setItem('invalidKey', 'invalid-json');

    const result = getWithExpiry('invalidKey');
    expect(result).toBeNull();
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  test('cleanupExpiredLocalStorage removes expired items', () => {
    // Set up items
    const currentTime = mockDate.getTime();

    // Add items directly to the mock store
    localStorageMock.setItem(
      'valid1',
      JSON.stringify({ value: 'data1', expiry: currentTime + 3600000 })
    );
    localStorageMock.setItem(
      'expired1',
      JSON.stringify({ value: 'data2', expiry: currentTime - 1000 })
    );
    localStorageMock.setItem(
      'valid2',
      JSON.stringify({ value: 'data3', expiry: currentTime + 7200000 })
    );
    localStorageMock.setItem(
      'expired2',
      JSON.stringify({ value: 'data4', expiry: currentTime - 2000 })
    );
    localStorageMock.setItem('noExpiry', JSON.stringify({ value: 'data5' }));

    // Run cleanup
    cleanupExpiredLocalStorage();

    // Verify results
    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('expired1');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('expired2');

    // Valid items remain
    expect(localStorageMock.getItem('valid1')).toBeTruthy();
    expect(localStorageMock.getItem('valid2')).toBeTruthy();
    expect(localStorageMock.getItem('noExpiry')).toBeTruthy();
  });
});
