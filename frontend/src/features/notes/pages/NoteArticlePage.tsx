import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { NoteArticleContent } from '../components/NoteArticleContent';
import { NoteArticleMetadataPane } from '../components/NoteArticleMetadataPane';
import { NoteArticlePageSkeleton } from '../components/NoteArticlePageSkeleton';
import { NotesSectionsPane } from '../components/NotesSectionsPane';
import { useNoteEntryForm, type EditableNoteEntryField, type NoteEntryFormController } from '../hooks/useNoteEntryForm';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../queries/note.mutations';
import { useOwnerNoteQuery, usePublicNoteQuery } from '../queries/note.queries';
import { getNoteSections } from '../utils/noteContent';

export const NoteArticlePage = () => {
  const navigate = useNavigate();
  const newArticleMatch = useMatch('/workspace/notes/new');
  const { noteId = '' } = useParams();
  const { isAuthReady, isPublicView } = useAuth();

  const isNewArticle = Boolean(newArticleMatch);
  const hasNoteId = noteId.trim().length > 0;

  const [editingField, setEditingField] = useState<EditableNoteEntryField | undefined>();
  const [savedMessage, setSavedMessage] = useState('');

  const form = useNoteEntryForm();
  const { draft, draftNote } = form;
  const { getValidForm, reset, resetFromNote, updateField } = form;

  const publicNoteQuery = usePublicNoteQuery(noteId, isAuthReady && hasNoteId && isPublicView);
  const ownerNoteQuery = useOwnerNoteQuery(noteId, isAuthReady && hasNoteId && !isPublicView);
  const noteQuery = isPublicView ? publicNoteQuery : ownerNoteQuery;

  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation(noteId);
  const activeMutation = isNewArticle ? createNoteMutation : updateNoteMutation;

  const persistedNote = isNewArticle ? undefined : noteQuery.data;
  const note = isNewArticle ? draftNote : persistedNote;

  const articleMarkdown = isPublicView ? (note?.bodyMarkdown ?? '') : draft.bodyMarkdown;
  const sections = useMemo(() => getNoteSections(articleMarkdown), [articleMarkdown]);

  useEffect(() => {
    document.title = `${isNewArticle ? 'New note' : (note?.title ?? 'Note')} | ${appConfig.appName}`;
  }, [isNewArticle, note?.title]);

  useEffect(() => {
    if (!persistedNote || !hasNoteId || isPublicView) return;

    resetFromNote(persistedNote);
  }, [hasNoteId, isPublicView, persistedNote, resetFromNote]);

  const handleEditField = (field: EditableNoteEntryField) => {
    if (isPublicView) return;
    setSavedMessage('');
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(undefined);
  };

  const handleCancel = () => {
    if (persistedNote) resetFromNote(persistedNote);
    else reset();
    setEditingField(undefined);
    setSavedMessage('');
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPublicView) return;
    setSavedMessage('');
    const entry = await getValidForm();
    if (!entry) return;

    try {
      if (isNewArticle) {
        const savedNote = await createNoteMutation.mutateAsync(entry);
        reset(entry);
        setEditingField(undefined);
        setSavedMessage('Saved.');
        void navigate(`/workspace/notes/${encodeURIComponent(savedNote.noteId)}`, { replace: true });
        return;
      }

      await updateNoteMutation.mutateAsync(entry);
      reset(entry);
      setEditingField(undefined);
      setSavedMessage('Saved.');
    } catch {
      // The mutation state drives the visible error message.
    }
  };

  const formController: NoteEntryFormController = {
    values: draft,
    errors: form.errors,
    editingField,
    isDirty: form.isDirty,
    isSaving: activeMutation.isPending || (!isNewArticle && noteQuery.isLoading),
    savedMessage,
    errorMessage: activeMutation.error instanceof Error ? activeMutation.error.message : noteQuery.error instanceof Error ? noteQuery.error.message : undefined,
    cancel: handleCancel,
    blurField: handleFieldBlur,
    editField: handleEditField,
    updateField
  };

  if (!isAuthReady || (!isNewArticle && noteQuery.isLoading)) return <NoteArticlePageSkeleton />;

  const content = (
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_18rem]">
      <NotesSectionsPane sections={sections} />
      <NoteArticleContent form={isPublicView ? undefined : formController} isEditable={!isPublicView} isLoading={!isNewArticle && noteQuery.isLoading} isError={!isNewArticle && noteQuery.isError} note={note} />
      <NoteArticleMetadataPane form={isPublicView ? undefined : formController} isEditable={!isPublicView} note={note} />
    </div>
  );

  return (
    <WorkspacePageWrapper>
      {!isPublicView ? (
        <form className="h-full min-h-0" onSubmit={handleSave}>
          {content}
        </form>
      ) : (
        content
      )}
    </WorkspacePageWrapper>
  );
};
