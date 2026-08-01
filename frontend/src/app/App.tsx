import { PrimeReactProvider } from '@primereact/core';
import { primeReactConfig } from './primeReactConfig';
import { HomePage } from '@/features/home/pages/HomePage';

export const App = () => (
  <PrimeReactProvider {...primeReactConfig}>
    <HomePage />
  </PrimeReactProvider>
);

export default App;
