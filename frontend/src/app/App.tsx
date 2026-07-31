import { PrimeReactProvider } from '@primereact/core/config';
import { primeReactConfig } from './primeReactConfig';
import { AppButton } from '@/components/ui/AppButton';

export const App = () => (
  <PrimeReactProvider {...primeReactConfig}>
    <AppButton>SmartDev</AppButton>
  </PrimeReactProvider>
);

export default App;
