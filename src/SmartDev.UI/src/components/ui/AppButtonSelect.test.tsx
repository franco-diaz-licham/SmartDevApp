import { PrimeReactProvider } from '@primereact/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { primeReactConfig } from '@/app/primeReactConfig';
import { AppButtonSelect } from './AppButtonSelect';

describe('AppButtonSelect', () => {
  test('renders options and reports selected value changes', async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <PrimeReactProvider {...primeReactConfig}>
        <AppButtonSelect
          aria-label="Article categories"
          options={[
            { label: 'All articles', value: 'All articles' },
            { label: 'test', value: 'test' }
          ]}
          value="All articles"
          onChange={onChange}
        />
      </PrimeReactProvider>
    );

    // Act
    await user.click(screen.getByRole('option', { name: 'test' }));

    // Assert
    expect(screen.getByRole('option', { name: 'All articles' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'test' })).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('test');
  });
});
