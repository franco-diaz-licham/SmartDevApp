import { PrimeReactProvider } from '@primereact/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AppToastProvider } from '@/components/common/AppToastProvider';
import { GlobalLoadingIndicator } from '@/components/common/GlobalLoadingIndicator';
import { AuthBootstrap } from '@/features/auth';
import { queryClient } from '@/lib/api/queryClient';
import { primeReactConfig } from './primeReactConfig';
import { router } from './router';

export const App = () => (
  <PrimeReactProvider {...primeReactConfig}>
    <QueryClientProvider client={queryClient}>
      <AppToastProvider>
        <AuthBootstrap>
          <RouterProvider router={router} />
          <GlobalLoadingIndicator />
        </AuthBootstrap>
      </AppToastProvider>
    </QueryClientProvider>
  </PrimeReactProvider>
);

export default App;
