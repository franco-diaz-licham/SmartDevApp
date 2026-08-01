import { PrimeReactProvider } from '@primereact/core';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { primeReactConfig } from '@/app/primeReactConfig';
import { ContactMeForm } from './ContactMeForm';
import { useContactMeForm } from '../hooks/useContactMeForm';
import type { ContactMeFormValues } from '../types/contactMeForm.schema';

type ContactMeFormHarnessProps = {
  onSave?: (form: ContactMeFormValues) => void;
  saving?: boolean;
  status?: 'idle' | 'sending' | 'sent' | 'failed';
};

const ContactMeFormHarness = ({ onSave = vi.fn(), saving = false, status = 'idle' }: ContactMeFormHarnessProps) => {
  const form = useContactMeForm();
  return (
    <PrimeReactProvider {...primeReactConfig}>
      <ContactMeForm form={form} saving={saving} status={status} onSave={onSave} />
    </PrimeReactProvider>
  );
};

describe('ContactMeForm', () => {
  test('keeps submit disabled until the visible required fields are valid', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ContactMeFormHarness />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();

    // Act
    await user.type(screen.getByLabelText(/name/i), 'Franco Diaz');
    await user.type(screen.getByLabelText(/email/i), 'franco@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there');

    // Assert
    expect(submitButton).toBeEnabled();
  });

  test('submits the valid controlled draft', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ContactMeFormHarness onSave={onSave} />);

    // Act
    await user.type(screen.getByLabelText(/name/i), 'Franco Diaz');
    await user.type(screen.getByLabelText(/email/i), 'franco@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // Assert
    expect(onSave).toHaveBeenCalledWith({
      name: 'Franco Diaz',
      email: 'franco@example.com',
      message: 'Hello there',
      companyWebsite: ''
    });
  });

  test('includes the honeypot value when it has been filled', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ContactMeFormHarness onSave={onSave} />);

    // Act
    fireEvent.change(screen.getByLabelText(/company website/i), { target: { value: 'https://spam.example' } });
    await user.type(screen.getByLabelText(/name/i), 'Franco Diaz');
    await user.type(screen.getByLabelText(/email/i), 'franco@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // Assert
    expect(onSave).toHaveBeenCalledWith({
      name: 'Franco Diaz',
      email: 'franco@example.com',
      message: 'Hello there',
      companyWebsite: 'https://spam.example'
    });
  });

  test('shows the sending, sent, and failed states', () => {
    // Arrange & Act
    const { rerender } = render(<ContactMeFormHarness saving status="sending" />);

    // Assert
    expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled();

    // Act
    rerender(<ContactMeFormHarness status="sent" />);

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent('Thanks! Message sent.');

    // Act
    rerender(<ContactMeFormHarness status="failed" />);

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('Message could not be sent. Please try again.');
  });
});
