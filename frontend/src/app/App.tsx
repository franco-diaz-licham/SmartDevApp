import { PrimeReactProvider } from '@primereact/core';
import { primeReactConfig } from './primeReactConfig';
import { AppButton } from '@/components/ui/AppButton';

export const App = () => (
  <PrimeReactProvider {...primeReactConfig}>
    <AppButton appearance="primary">SmartDev</AppButton>
  </PrimeReactProvider>
);

export default App;
