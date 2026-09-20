import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import type { Path, PathValue } from 'react-hook-form';
import type { JournalEntryFormModel } from '../types/journal.types';
import { defaultJournalEntryFormValues, journalEntryFormSchema, type JournalEntryFormErrors } from '../types/journalEntryForm.schema';

export type EditableJournalEntryField = 'title' | 'summary' | 'bodyMarkdown' | 'tags' | 'companyName' | 'companyRoleTitle' | 'collaborators';

export interface JournalEntryFormController {
  values: JournalEntryFormModel;
  errors: JournalEntryFormErrors;
  editingField?: EditableJournalEntryField;
  isDirty: boolean;
  isSaving: boolean;
  savedMessage?: string;
  blurField: () => void;
  editField: (field: EditableJournalEntryField) => void;
  updateField: <TField extends keyof JournalEntryFormModel>(field: TField, value: JournalEntryFormModel[TField]) => void;
}

type JournalEntryTouchedFields = Partial<Record<keyof JournalEntryFormModel, boolean>>;

const getVisibleJournalEntryFormErrors = (validationErrors: JournalEntryFormErrors, touchedFields: JournalEntryTouchedFields, hasSubmitted: boolean): JournalEntryFormErrors => {
  if (hasSubmitted) return validationErrors;

  return Object.entries(validationErrors).reduce<JournalEntryFormErrors>((visibleErrors, [field, message]) => {
    const formField = field as keyof JournalEntryFormModel;
    if (touchedFields[formField]) visibleErrors[formField] = message;
    return visibleErrors;
  }, {});
};

export const useJournalEntryForm = (initialValues: JournalEntryFormModel = defaultJournalEntryFormValues) => {
  const {
    control,
    formState: { errors: formErrors, isDirty, isSubmitted, isSubmitting, touchedFields },
    handleSubmit,
    reset: resetForm,
    setValue
  } = useForm<JournalEntryFormModel>({
    defaultValues: initialValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(journalEntryFormSchema)
  });

  const draft = useWatch({ control, defaultValue: initialValues }) as JournalEntryFormModel;

  const validationErrors = useMemo(
    () =>
      Object.entries(formErrors).reduce<JournalEntryFormErrors>((errors, [field, error]) => {
        const formField = field as keyof JournalEntryFormModel;
        if (error?.message) errors[formField] = error.message;
        return errors;
      }, {}),
    [formErrors]
  );

  const errors = useMemo(() => getVisibleJournalEntryFormErrors(validationErrors, touchedFields as JournalEntryTouchedFields, isSubmitted), [isSubmitted, touchedFields, validationErrors]);

  const reset = useCallback(
    (values: JournalEntryFormModel = defaultJournalEntryFormValues) => {
      resetForm(values);
    },
    [resetForm]
  );

  const getValidForm = useCallback(async (): Promise<JournalEntryFormModel | null> => {
    let validForm: JournalEntryFormModel | null = null;

    await handleSubmit((values) => {
      validForm = values;
    })();

    return validForm;
  }, [handleSubmit]);

  const updateField = <TField extends keyof JournalEntryFormModel>(field: TField, value: JournalEntryFormModel[TField]) => {
    setValue(field as Path<JournalEntryFormModel>, value as PathValue<JournalEntryFormModel, Path<JournalEntryFormModel>>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return {
    draft,
    errors,
    isDirty,
    isSubmitting,
    getValidForm,
    reset,
    updateField
  };
};
