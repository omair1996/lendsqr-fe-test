import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

import LoadingIndicator from './LoadingIndicator';
import styles from './LoadingIndicator.module.scss';

describe('LoadingIndicator', () => {
  test('renders with correct structure and classes', () => {
    render(<LoadingIndicator />);

    const wrapper = screen.getByRole('status');
    expect(wrapper).toHaveClass(styles.loaderWrapper);
    expect(wrapper.firstChild).toHaveClass(styles.spinner);
  });
});
