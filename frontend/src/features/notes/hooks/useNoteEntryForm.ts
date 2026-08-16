import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import type { Path, PathValue } from 'react-hook-form';
import type { NoteEntryModel, PublicNoteDetailModel } from '../types/note.types';
import { defaultNoteEntryFormValues, noteEntryFormSchema, type NoteEntryFormErrors } from '../types/noteEntryForm.schema';

export type EditableNoteEntryField = 'title' | 'summary' | 'bodyMarkdown' | 'slug' | 'category' | 'tags';

export interface NoteEntryFormController {
  values: NoteEntryModel;
  errors: NoteEntryFormErrors;
  editingField?: EditableNoteEntryField;
  isDirty: boolean;
  isSaving: boolean;
  savedMessage?: string;
  errorMessage?: string;
  cancel: () => void;
  blurField: () => void;
  editField: (field: EditableNoteEntryField) => void;
  updateField: <TField extends keyof NoteEntryModel>(field: TField, value: NoteEntryModel[TField]) => void;
}

type NoteEntryTouchedFields = Partial<Record<keyof NoteEntryModel, boolean>>;

/**
 * Keeps validation quiet until a field has been touched, then shows all errors
 * after the user attempts to save.
 */
const getVisibleNoteEntryFormErrors = (validationErrors: NoteEntryFormErrors, touchedFields: NoteEntryTouchedFields, hasSubmitted: boolean): NoteEntryFormErrors => {
  if (hasSubmitted) return validationErrors;

  return Object.entries(validationErrors).reduce<NoteEntryFormErrors>((visibleErrors, [field, message]) => {
    const formField = field as keyof NoteEntryModel;
    if (touchedFields[formField]) visibleErrors[formField] = message;
    return visibleErrors;
  }, {});
};

/**
 * Converts a persisted note detail into the editable form shape used by the
 * owner-facing note editor.
 */
const getNoteEntryFormValues = (note: PublicNoteDetailModel): NoteEntryModel => ({
  title: note.title,
  slug: note.slug,
  summary: note.summary,
  category: note.category.displayName,
  tags: note.tags.map((tag) => tag.displayName).join(', '),
  bodyMarkdown: note.bodyMarkdown,
  status: note.status,
  visibility: note.visibility
});

/**
 * Builds a previewable note detail from unsaved form values so the article page
 * can render a new note before it exists in the API.
 */
const getDraftNote = (draft: NoteEntryModel): PublicNoteDetailModel => ({
  id: '',
  slug: draft.slug,
  title: draft.title || 'Untitled note',
  summary: draft.summary || 'Click to add a summary.',
  category: {
    slug: draft.category.trim().toLowerCase().replace(/\s+/g, '-'),
    displayName: draft.category || 'Uncategorised'
  },
  tags: draft.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => ({
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
      displayName: tag
    })),
  updatedAt: null,
  publishedAt: new Date(),
  bodyMarkdown: draft.bodyMarkdown || 'Click to start writing.',
  status: draft.status,
  visibility: draft.visibility,
  relatedProjects: []
});

/**
 * Manages the owner note editor state with react-hook-form while exposing a
 * small domain-specific API for inline editable article fields.
 *
 * @param initialValues - Optional values used to seed the editor when creating
 * or editing a note.
 * @returns Draft note state, visible validation errors, validation helpers, and
 * field update/reset commands for the note editor UI.
 */
export const useNoteEntryForm = (initialValues: NoteEntryModel = defaultNoteEntryFormValues) => {
  const {
    control,
    formState: { errors: formErrors, isDirty, isSubmitted, isValid, touchedFields },
    handleSubmit,
    reset: resetForm,
    setValue
  } = useForm<NoteEntryModel>({
    defaultValues: initialValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(noteEntryFormSchema)
  });

  const draft = useWatch({ control, defaultValue: initialValues }) as NoteEntryModel;

  const validationErrors = useMemo(
    () =>
      Object.entries(formErrors).reduce<NoteEntryFormErrors>((errors, [field, error]) => {
        const formField = field as keyof NoteEntryModel;
        if (error?.message) errors[formField] = error.message;
        return errors;
      }, {}),
    [formErrors]
  );

  const errors = useMemo(() => getVisibleNoteEntryFormErrors(validationErrors, touchedFields as NoteEntryTouchedFields, isSubmitted), [isSubmitted, touchedFields, validationErrors]);

  const draftNote = useMemo(() => getDraftNote(draft), [draft]);

  const reset = useCallback(
    (values: NoteEntryModel = defaultNoteEntryFormValues) => {
      resetForm(values);
    },
    [resetForm]
  );

  const getValidForm = useCallback(async (): Promise<NoteEntryModel | null> => {
    let validForm: NoteEntryModel | null = null;

    await handleSubmit((values) => {
      validForm = values;
    })();

    return validForm;
  }, [handleSubmit]);

  const resetFromNote = useCallback(
    (note: PublicNoteDetailModel) => {
      reset(getNoteEntryFormValues(note));
    },
    [reset]
  );

  const updateField = <TField extends keyof NoteEntryModel>(field: TField, value: NoteEntryModel[TField]) => {
    setValue(field as Path<NoteEntryModel>, value as PathValue<NoteEntryModel, Path<NoteEntryModel>>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return {
    draft,
    draftNote,
    errors,
    isDirty,
    isValid,
    getValidForm,
    reset,
    resetFromNote,
    updateField
  };
};
