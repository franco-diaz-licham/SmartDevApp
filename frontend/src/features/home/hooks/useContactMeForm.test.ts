import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useContactMeForm } from './useContactMeForm';

describe('useContactMeForm', () => {
  test('starts with an empty draft and hides initial validation errors', () => {
    // Arrange & Act
    const { result } = renderHook(() => useContactMeForm());

    // Assert
    expect(result.current.draft).toEqual({
      name: '',
      email: '',
      message: '',
      companyWebsite: ''
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(false);
  });

  test('shows field errors after a field has been touched', async () => {
    // Arrange
    const { result } = renderHook(() => useContactMeForm());

    // Act
    await act(async () => {
      result.current.updateField('email', 'not-an-email');
    });

    // Assert
    await waitFor(() => {
      expect(result.current.errors).toEqual({
        email: 'Enter a valid email address.'
      });
    });
  });

  test('shows all validation errors after submit is attempted', async () => {
    // Arrange
    const { result } = renderHook(() => useContactMeForm());

    // Act
    let validForm = null;
    await act(async () => {
      validForm = await result.current.getValidForm();
    });

    // Assert
    expect(validForm).toBeNull();
    expect(result.current.errors).toEqual({
      name: 'Name is required.',
      email: 'Email is required.',
      message: 'Message is required.'
    });
  });

  test('returns trimmed valid form values and preserves the honeypot value', async () => {
    // Arrange
    const { result } = renderHook(() => useContactMeForm());

    // Act
    act(() => {
      result.current.updateField('name', '  Franco Diaz  ');
      result.current.updateField('email', '  franco@example.com  ');
      result.current.updateField('message', '  Hello there  ');
      result.current.updateField('companyWebsite', 'https://spam.example');
    });

    let validForm = null;
    await act(async () => {
      validForm = await result.current.getValidForm();
    });

    // Assert
    expect(validForm).toEqual({
      name: 'Franco Diaz',
      email: 'franco@example.com',
      message: 'Hello there',
      companyWebsite: 'https://spam.example'
    });
    expect(result.current.isValid).toBe(true);
  });

  test('resets the draft and clears visible errors', () => {
    // Arrange
    const { result } = renderHook(() => useContactMeForm());

    // Act
    act(() => {
      result.current.updateField('email', 'not-an-email');
      result.current.reset();
    });

    // Assert
    expect(result.current.draft.email).toBe('');
    expect(result.current.errors).toEqual({});
  });
});
