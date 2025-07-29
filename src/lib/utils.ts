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
