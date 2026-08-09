import { useCallback, useMemo, useState } from 'react';
import type { NoteEntryModel, PublicNoteDetailModel } from '../types/note.types';
import { defaultNoteEntryFormValues, noteEntryFormSchema, type NoteEntryFormErrors } from '../types/noteEntryForm.schema';

type NoteEntryTouchedFields = Partial<Record<keyof NoteEntryModel, boolean>>;

const getNoteEntryFormErrors = (draft: NoteEntryModel): NoteEntryFormErrors => {
  const result = noteEntryFormSchema.safeParse(draft);
  if (result.success) return {};

  return result.error.issues.reduce<NoteEntryFormErrors>((errors, issue) => {
    const field = issue.path[0] as keyof NoteEntryModel | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
    return errors;
  }, {});
};

const getVisibleNoteEntryFormErrors = (validationErrors: NoteEntryFormErrors, touchedFields: NoteEntryTouchedFields, hasSubmitted: boolean): NoteEntryFormErrors => {
  if (hasSubmitted) return validationErrors;

  return Object.entries(validationErrors).reduce<NoteEntryFormErrors>((visibleErrors, [field, message]) => {
    const formField = field as keyof NoteEntryModel;
    if (touchedFields[formField]) visibleErrors[formField] = message;
    return visibleErrors;
  }, {});
};

const isSameNoteEntryForm = (left: NoteEntryModel, right: NoteEntryModel) =>
  left.title === right.title && left.slug === right.slug && left.summary === right.summary && left.category === right.category && left.tags === right.tags && left.bodyMarkdown === right.bodyMarkdown;

const getNoteEntryFormValues = (note: PublicNoteDetailModel): NoteEntryModel => ({
  title: note.title,
  slug: note.slug,
  summary: note.summary,
  category: note.category.displayName,
  tags: note.tags.map((tag) => tag.displayName).join(', '),
  bodyMarkdown: note.bodyMarkdown
});

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
  relatedProjects: []
});

export const useNoteEntryForm = (initialValues: NoteEntryModel = defaultNoteEntryFormValues) => {
  const [draft, setDraft] = useState<NoteEntryModel>(initialValues);
  const [baseline, setBaseline] = useState<NoteEntryModel>(initialValues);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<NoteEntryTouchedFields>({});

  const validationErrors = useMemo(() => getNoteEntryFormErrors(draft), [draft]);
  const errors = useMemo(() => getVisibleNoteEntryFormErrors(validationErrors, touchedFields, hasSubmitted), [hasSubmitted, touchedFields, validationErrors]);
  const draftNote = useMemo(() => getDraftNote(draft), [draft]);
  const isDirty = useMemo(() => !isSameNoteEntryForm(draft, baseline), [baseline, draft]);
  const isValid = useMemo(() => Object.keys(validationErrors).length === 0, [validationErrors]);

  const reset = useCallback((values: NoteEntryModel = defaultNoteEntryFormValues) => {
    setDraft(values);
    setBaseline(values);
    setHasSubmitted(false);
    setTouchedFields({});
  }, []);

  const getValidForm = useCallback((): NoteEntryModel | null => {
    setHasSubmitted(true);
    const result = noteEntryFormSchema.safeParse(draft);
    return result.success ? result.data : null;
  }, [draft]);

  const resetFromNote = useCallback(
    (note: PublicNoteDetailModel) => {
      reset(getNoteEntryFormValues(note));
    },
    [reset]
  );

  const updateField = <TField extends keyof NoteEntryModel>(field: TField, value: NoteEntryModel[TField]) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
    setTouchedFields((currentFields) => ({ ...currentFields, [field]: true }));
  };

  const touchField = <TField extends keyof NoteEntryModel>(field: TField) => {
    setTouchedFields((currentFields) => ({ ...currentFields, [field]: true }));
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
    touchField,
    updateField
  };
};
