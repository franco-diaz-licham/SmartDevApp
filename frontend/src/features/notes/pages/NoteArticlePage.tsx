import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteArticleContent, type EditableNoteArticleField } from '../components/NoteArticleContent';
import { NoteArticleMetadataPane } from '../components/NoteArticleMetadataPane';
import { NotesSectionsPane } from '../components/NotesSectionsPane';
import { useNoteEntryForm } from '../hooks/useNoteEntryForm';
import { useUpdateNoteMutation } from '../queries/note.mutations';
import { useOwnerNoteQuery, usePublicNoteQuery } from '../queries/note.queries';
import { getNoteSections } from '../utils/noteContent';

export const NoteArticlePage = () => {
  const [editingField, setEditingField] = useState<EditableNoteArticleField | undefined>();
  const [savedMessage, setSavedMessage] = useState('');
  const { noteId = '', slug = '' } = useParams();
  const isOwnerArticle = noteId.trim().length > 0;
  const form = useNoteEntryForm();
  const { draft, errors } = form;
  const { getValidForm, reset, updateField } = form;
  const publicNoteQuery = usePublicNoteQuery(isOwnerArticle ? '' : slug);
  const ownerNoteQuery = useOwnerNoteQuery(noteId);
  const updateNoteMutation = useUpdateNoteMutation(noteId);
  const noteQuery = isOwnerArticle ? ownerNoteQuery : publicNoteQuery;
  const note = noteQuery.data;
  const articleMarkdown = isOwnerArticle ? draft.bodyMarkdown : (note?.bodyMarkdown ?? '');
  const sections = useMemo(() => getNoteSections(articleMarkdown), [articleMarkdown]);

  useEffect(() => {
    document.title = `${note?.title ?? 'Note'} | ${appConfig.appName}`;
  }, [note?.title]);

  useEffect(() => {
    if (!note || !isOwnerArticle) return;

    reset({
      title: note.title,
      slug: note.slug,
      summary: note.summary,
      category: note.category.displayName,
      tags: note.tags.map((tag) => tag.displayName).join(', '),
      bodyMarkdown: note.bodyMarkdown
    });
  }, [isOwnerArticle, note, reset]);

  const handleEditField = (field: EditableNoteArticleField) => {
    if (!isOwnerArticle) return;
    setSavedMessage('');
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(undefined);
  };

  const handleCancel = () => {
    if (note) {
      reset({
        title: note.title,
        slug: note.slug,
        summary: note.summary,
        category: note.category.displayName,
        tags: note.tags.map((tag) => tag.displayName).join(', '),
        bodyMarkdown: note.bodyMarkdown
      });
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
        isLoading={noteQuery.isLoading}
        isError={noteQuery.isError}
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
        errorMessage={updateNoteMutation.error instanceof Error ? updateNoteMutation.error.message : undefined}
        isDirty={form.isDirty}
        isEditable={isOwnerArticle}
        isSaving={updateNoteMutation.isPending}
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
