import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteArticleContent, type EditableNoteArticleField } from '../components/NoteArticleContent';
import { NoteArticleMetadataPane } from '../components/NoteArticleMetadataPane';
import { NotesSectionsPane } from '../components/NotesSectionsPane';
import { useNoteEntryForm } from '../hooks/useNoteEntryForm';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../queries/note.mutations';
import { useOwnerNoteQuery, usePublicNoteQuery } from '../queries/note.queries';
import { getNoteSections } from '../utils/noteContent';

export const NoteArticlePage = () => {
  const [editingField, setEditingField] = useState<EditableNoteArticleField | undefined>();
  const [savedMessage, setSavedMessage] = useState('');
  const navigate = useNavigate();
  const newArticleMatch = useMatch('/workspace/notes/new');
  const { noteId = '', slug = '' } = useParams();
  const isNewArticle = Boolean(newArticleMatch);
  const isExistingOwnerArticle = noteId.trim().length > 0 && !isNewArticle;
  const isOwnerArticle = isNewArticle || isExistingOwnerArticle;
  const form = useNoteEntryForm();
  const { draft, draftNote, errors } = form;
  const { getValidForm, reset, resetFromNote, updateField } = form;
  const publicNoteQuery = usePublicNoteQuery(isOwnerArticle ? '' : slug);
  const ownerNoteQuery = useOwnerNoteQuery(isExistingOwnerArticle ? noteId : '');
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation(noteId);
  const activeMutation = isNewArticle ? createNoteMutation : updateNoteMutation;
  const noteQuery = isExistingOwnerArticle ? ownerNoteQuery : publicNoteQuery;
  const persistedNote = isExistingOwnerArticle || !isOwnerArticle ? noteQuery.data : undefined;
  const note = isNewArticle ? draftNote : persistedNote;
  const articleMarkdown = isOwnerArticle ? draft.bodyMarkdown : (note?.bodyMarkdown ?? '');
  const sections = useMemo(() => getNoteSections(articleMarkdown), [articleMarkdown]);

  useEffect(() => {
    document.title = `${isNewArticle ? 'New note' : (note?.title ?? 'Note')} | ${appConfig.appName}`;
  }, [isNewArticle, note?.title]);

  useEffect(() => {
    if (!persistedNote || !isExistingOwnerArticle) return;

    resetFromNote(persistedNote);
  }, [isExistingOwnerArticle, persistedNote, resetFromNote]);

  const handleEditField = (field: EditableNoteArticleField) => {
    if (!isOwnerArticle) return;
    setSavedMessage('');
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(undefined);
  };

  const handleCancel = () => {
    if (persistedNote) {
      resetFromNote(persistedNote);
    } else {
      reset();
    }

    setEditingField(undefined);
    setSavedMessage('');
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOwnerArticle) return;
    setSavedMessage('');
    const entry = getValidForm();
    if (!entry) return;

    if (isNewArticle) {
      createNoteMutation.mutate(entry, {
        onSuccess: (savedNote) => {
          reset(entry);
          setEditingField(undefined);
          setSavedMessage('Saved.');
          void navigate(`/workspace/notes/${encodeURIComponent(savedNote.noteId)}`, { replace: true });
        }
      });

      return;
    }

    updateNoteMutation.mutate(entry, {
      onSuccess: () => {
        reset(entry);
        setEditingField(undefined);
        setSavedMessage('Saved.');
      }
    });
  };

  const content = (
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_18rem]">
      <NotesSectionsPane sections={sections} />
      <NoteArticleContent
        bodyMarkdownError={errors.bodyMarkdown}
        bodyMarkdownValue={isOwnerArticle ? draft.bodyMarkdown : undefined}
        editingField={editingField}
        isEditable={isOwnerArticle}
        isLoading={!isNewArticle && noteQuery.isLoading}
        isError={!isNewArticle && noteQuery.isError}
        note={note}
        summaryError={errors.summary}
        summaryValue={isOwnerArticle ? draft.summary : undefined}
        titleError={errors.title}
        titleValue={isOwnerArticle ? draft.title : undefined}
        onBodyMarkdownChange={(value) => updateField('bodyMarkdown', value)}
        onFieldBlur={handleFieldBlur}
        onEditField={handleEditField}
        onSummaryChange={(value) => updateField('summary', value)}
        onTitleChange={(value) => updateField('title', value)}
      />
      <NoteArticleMetadataPane
        categoryError={errors.category}
        categoryValue={isOwnerArticle ? draft.category : undefined}
        editingField={editingField}
        errorMessage={activeMutation.error instanceof Error ? activeMutation.error.message : noteQuery.error instanceof Error ? noteQuery.error.message : undefined}
        isDirty={form.isDirty}
        isEditable={isOwnerArticle}
        isSaving={activeMutation.isPending || (!isNewArticle && noteQuery.isLoading)}
        note={note}
        savedMessage={savedMessage}
        slugError={errors.slug}
        slugValue={isOwnerArticle ? draft.slug : undefined}
        tagsError={errors.tags}
        tagsValue={isOwnerArticle ? draft.tags : undefined}
        onCancel={handleCancel}
        onFieldBlur={handleFieldBlur}
        onEditField={handleEditField}
        onFieldChange={updateField}
      />
    </div>
  );

  return (
    <WorkspacePageWrapper>
      {isOwnerArticle ? (
        <form className="h-full min-h-0" onSubmit={handleSave}>
          {content}
        </form>
      ) : (
        content
      )}
    </WorkspacePageWrapper>
  );
};
