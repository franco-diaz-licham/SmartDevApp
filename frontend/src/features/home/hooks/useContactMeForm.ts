import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import type { Path, PathValue } from 'react-hook-form';
import { contactMeFormSchema, type ContactMeFormErrors, type ContactMeFormValues } from '../types/contactMeForm.schema';

type ContactMeTouchedFields = Partial<Record<keyof ContactMeFormValues, boolean>>;

/**
 * Returns the controlled contact form defaults, including the hidden honeypot
 * field submitted to the backend for spam detection.
 */
const createEmptyContactMeForm = (): ContactMeFormValues => ({
  name: '',
  email: '',
  message: '',
  companyWebsite: ''
});

/**
 * Keeps validation messages hidden until fields are touched, then reveals all
 * current validation errors after a submit attempt.
 */
const getVisibleContactMeFormErrors = (validationErrors: ContactMeFormErrors, touchedFields: ContactMeTouchedFields, hasSubmitted: boolean): ContactMeFormErrors => {
  if (hasSubmitted) return validationErrors;

  return Object.entries(validationErrors).reduce<ContactMeFormErrors>((visibleErrors, [field, message]) => {
    const formField = field as keyof ContactMeFormValues;
    if (touchedFields[formField]) visibleErrors[formField] = message;
    return visibleErrors;
  }, {});
};

/**
 * Manages the contact form with react-hook-form and Zod validation while keeping
 * the component API simple: draft values, visible errors, reset, and submit.
 *
 * @returns Draft contact values, visible validation errors, validity state, and
 * commands for submitting, resetting, and updating fields.
 */
export const useContactMeForm = () => {
  const defaultValues = useMemo(() => createEmptyContactMeForm(), []);
  const {
    control,
    formState: { errors: formErrors, isSubmitted, isValid, touchedFields },
    handleSubmit,
    reset: resetForm,
    setValue
  } = useForm<ContactMeFormValues>({
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(contactMeFormSchema)
  });

  const draft = useWatch({ control, defaultValue: defaultValues }) as ContactMeFormValues;

  const validationErrors = useMemo(
    () =>
      Object.entries(formErrors).reduce<ContactMeFormErrors>((errors, [field, error]) => {
        const formField = field as keyof ContactMeFormValues;
        if (error?.message) errors[formField] = error.message;
        return errors;
      }, {}),
    [formErrors]
  );

  const errors = useMemo(() => getVisibleContactMeFormErrors(validationErrors, touchedFields as ContactMeTouchedFields, isSubmitted), [isSubmitted, touchedFields, validationErrors]);

  const reset = useCallback(() => {
    resetForm(createEmptyContactMeForm());
  }, [resetForm]);

  const getValidForm = useCallback(async (): Promise<ContactMeFormValues | null> => {
    let validForm: ContactMeFormValues | null = null;

    await handleSubmit((values) => {
      validForm = values;
    })();

    return validForm;
  }, [handleSubmit]);

  const updateField = <TField extends keyof ContactMeFormValues>(field: TField, value: ContactMeFormValues[TField]) => {
    setValue(field as Path<ContactMeFormValues>, value as PathValue<ContactMeFormValues, Path<ContactMeFormValues>>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return {
    draft,
    errors,
    isValid,
    getValidForm,
    reset,
    updateField
  };
};
