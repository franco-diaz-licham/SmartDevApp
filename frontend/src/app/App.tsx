import { PrimeReactProvider } from '@primereact/core';
import { RouterProvider } from 'react-router-dom';
import { primeReactConfig } from './primeReactConfig';
import { router } from './router';

export const App = () => (
  <PrimeReactProvider {...primeReactConfig}>
    <RouterProvider router={router} />
  </PrimeReactProvider>
);

export default App;
