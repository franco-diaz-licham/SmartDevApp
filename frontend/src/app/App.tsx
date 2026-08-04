import { PrimeReactProvider } from '@primereact/core';
import { RouterProvider } from 'react-router-dom';
import { AppToastProvider } from '@/components/common/AppToastProvider';
import { AuthBootstrap } from '@/features/auth';
import { primeReactConfig } from './primeReactConfig';
import { router } from './router';

export const App = () => (
  <PrimeReactProvider {...primeReactConfig}>
    <AppToastProvider>
      <AuthBootstrap />
      <RouterProvider router={router} />
    </AppToastProvider>
  </PrimeReactProvider>
);

export default App;
