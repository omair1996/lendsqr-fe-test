export function cn(
  ...args: Array<string | undefined | null | false | Record<string, boolean>>
): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

// Save a value in localStorage with expiry
export function setWithExpiry(key: string, value: any, ttlMs: number) {
  const now = new Date();

  const item = {
    value,
    expiry: now.getTime() + ttlMs, // expiry time in ms
  };

  localStorage.setItem(key, JSON.stringify(item));
}

// Get a value from localStorage and remove it if expired
export function getWithExpiry<T = any>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);

    if (item?.expiry && new Date().getTime() > item.expiry) {
      localStorage.removeItem(key); //  remove expired item
      return null;
    }

    return item?.value ?? null;
  } catch {
    return null;
  }
}

// clean up all expired keys in localStorage
export function cleanupExpiredLocalStorage() {
  const now = new Date().getTime();

  Object.keys(localStorage).forEach((key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return;

    try {
      const item = JSON.parse(itemStr);
      if (item?.expiry && now > item.expiry) {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignore invalid JSON
    }
  });
}
