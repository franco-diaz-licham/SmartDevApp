import { useCallback, useMemo, useState } from 'react';
import { contactMeFormSchema, type ContactMeFormErrors, type ContactMeFormValues } from '../types/contactMeForm.schema';

type ContactMeTouchedFields = Partial<Record<keyof ContactMeFormValues, boolean>>;

const createEmptyContactMeForm = (): ContactMeFormValues => ({
  name: '',
  email: '',
  message: '',
  companyWebsite: ''
});

const getContactMeFormErrors = (draft: ContactMeFormValues): ContactMeFormErrors => {
  const result = contactMeFormSchema.safeParse(draft);
  if (result.success) return {};

  return result.error.issues.reduce<ContactMeFormErrors>((errors, issue) => {
    const field = issue.path[0] as keyof ContactMeFormValues | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
    return errors;
  }, {});
};

const getVisibleContactMeFormErrors = (validationErrors: ContactMeFormErrors, touchedFields: ContactMeTouchedFields, hasSubmitted: boolean): ContactMeFormErrors => {
  if (hasSubmitted) return validationErrors;

  return Object.entries(validationErrors).reduce<ContactMeFormErrors>((visibleErrors, [field, message]) => {
    const formField = field as keyof ContactMeFormValues;
    if (touchedFields[formField]) visibleErrors[formField] = message;
    return visibleErrors;
  }, {});
};

export const useContactMeForm = () => {
  const [draft, setDraft] = useState<ContactMeFormValues>(() => createEmptyContactMeForm());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<ContactMeTouchedFields>({});

  const validationErrors = useMemo(() => getContactMeFormErrors(draft), [draft]);
  const errors = useMemo(() => getVisibleContactMeFormErrors(validationErrors, touchedFields, hasSubmitted), [hasSubmitted, touchedFields, validationErrors]);
  const isValid = useMemo(() => Object.keys(validationErrors).length === 0, [validationErrors]);

  const reset = useCallback(() => {
    setHasSubmitted(false);
    setTouchedFields({});
    setDraft(createEmptyContactMeForm());
  }, []);

  const getValidForm = useCallback((): ContactMeFormValues | null => {
    setHasSubmitted(true);
    const result = contactMeFormSchema.safeParse(draft);
    return result.success ? result.data : null;
  }, [draft]);

  const updateField = <TField extends keyof ContactMeFormValues>(field: TField, value: ContactMeFormValues[TField]) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
    setTouchedFields((currentFields) => ({ ...currentFields, [field]: true }));
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
