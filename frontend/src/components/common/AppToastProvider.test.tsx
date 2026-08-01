import { PrimeReactProvider } from '@primereact/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { primeReactConfig } from '@/app/primeReactConfig';
import { AppButton } from '@/components/ui/AppButton';
import { useAppToast } from './AppToastContext';
import { AppToastProvider } from './AppToastProvider';

const ToastTrigger = () => {
  const toast = useAppToast();

  return (
    <AppButton
      onClick={() => {
        toast.success({
          title: 'Message sent',
          message: 'Thanks! Message sent.',
          duration: 10000
        });
      }}
    >
      Show toast
    </AppButton>
  );
};

describe('AppToastProvider', () => {
  test('shows a toast from provider state', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PrimeReactProvider {...primeReactConfig}>
        <AppToastProvider>
          <ToastTrigger />
        </AppToastProvider>
      </PrimeReactProvider>
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Show toast' }));

    // Assert
    expect(screen.getByText('Message sent')).toBeInTheDocument();
    expect(screen.getByText('Thanks! Message sent.')).toBeInTheDocument();
  });
});
