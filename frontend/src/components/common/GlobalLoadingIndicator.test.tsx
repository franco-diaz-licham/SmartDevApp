import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { GlobalLoadingIndicator } from './GlobalLoadingIndicator';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

const FetchingComponent = () => {
  useQuery({
    queryKey: ['global-loading-indicator-test'],
    queryFn: () => new Promise((resolve) => window.setTimeout(() => resolve('done'), 10))
  });

  return null;
};

const renderWithClient = () =>
  render(
    <QueryClientProvider client={createQueryClient()}>
      <FetchingComponent />
      <GlobalLoadingIndicator delayMs={0} />
    </QueryClientProvider>
  );

describe('GlobalLoadingIndicator', () => {
  test('shows while a query is fetching and hides when it completes', async () => {
    renderWithClient();

    expect(await screen.findByRole('status', { name: 'Loading data...' })).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading data...' }));
  });
});
