import { PrimeReactProvider } from '@primereact/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { primeReactConfig } from '@/app/primeReactConfig';
import { AppButton } from '@/components/ui/AppButton';
import { publishErrorFeedback } from '@/lib/feedback/feedbackEvents';
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

const ErrorToastTrigger = () => {
  const toast = useAppToast();

  return (
    <AppButton
      onClick={() => {
        toast.error({
          title: 'Article could not be saved',
          error: {
            response: {
              status: 400,
              data: {
                statusCode: 400,
                message: 'Article title is required.'
              }
            }
          }
        });
      }}
    >
      Show error toast
    </AppButton>
  );
};

const PublishedErrorToastTrigger = () => (
  <AppButton
    onClick={() => {
      publishErrorFeedback({
        response: {
          status: 409,
          data: {
            statusCode: 409,
            message: "Article slug 'lorem' already exists."
          }
        }
      });
    }}
  >
    Show published error toast
  </AppButton>
);

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

  test('shows backend error messages in an error toast', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PrimeReactProvider {...primeReactConfig}>
        <AppToastProvider>
          <ErrorToastTrigger />
        </AppToastProvider>
      </PrimeReactProvider>
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Show error toast' }));

    // Assert
    expect(screen.getByText('Article could not be saved')).toBeInTheDocument();
    expect(screen.getByText(/Article title is required/)).toBeInTheDocument();
  });

  test('shows subscription backend error messages in an error toast', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PrimeReactProvider {...primeReactConfig}>
        <AppToastProvider>
          <PublishedErrorToastTrigger />
        </AppToastProvider>
      </PrimeReactProvider>
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Show published error toast' }));

    // Assert
    expect(screen.getAllByText("Article slug 'lorem' already exists.").length).toBeGreaterThan(0);
  });
});
