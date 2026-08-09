import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteArticleContent, type EditableNoteArticleField } from '../components/NoteArticleContent';
import { NoteArticleMetadataPane } from '../components/NoteArticleMetadataPane';
import { NotesSectionsPane } from '../components/NotesSectionsPane';
import { useUpdateNoteMutation } from '../queries/note.mutations';
import { useOwnerNoteQuery, usePublicNoteQuery } from '../queries/note.queries';
import type { NoteEntryModel } from '../types/note.types';
import { defaultNoteEntryFormValues, noteEntryFormResolver } from '../types/noteEntryForm.schema';
import { getNoteSections } from '../utils/noteContent';

export const NoteArticlePage = () => {
  const [editingField, setEditingField] = useState<EditableNoteArticleField | undefined>();
  const [savedMessage, setSavedMessage] = useState('');
  const { noteId = '', slug = '' } = useParams();
  const isOwnerArticle = noteId.trim().length > 0;
  const form = useForm<NoteEntryModel>({
    defaultValues: defaultNoteEntryFormValues,
    mode: 'onBlur',
    resolver: noteEntryFormResolver
  });
  const publicNoteQuery = usePublicNoteQuery(isOwnerArticle ? '' : slug);
  const ownerNoteQuery = useOwnerNoteQuery(noteId);
  const updateNoteMutation = useUpdateNoteMutation(noteId);
  const noteQuery = isOwnerArticle ? ownerNoteQuery : publicNoteQuery;
  const note = noteQuery.data;
  const bodyMarkdown = form.watch('bodyMarkdown');
  const sections = useMemo(() => getNoteSections(isOwnerArticle ? bodyMarkdown : (note?.bodyMarkdown ?? '')), [bodyMarkdown, isOwnerArticle, note?.bodyMarkdown]);

  useEffect(() => {
    document.title = `${note?.title ?? 'Note'} | ${appConfig.appName}`;
  }, [note?.title]);

  useEffect(() => {
    if (!note || !isOwnerArticle) return;

    form.reset({
      title: note.title,
      slug: note.slug,
      summary: note.summary,
      category: note.category.displayName,
      tags: note.tags.map((tag) => tag.displayName).join(', '),
      bodyMarkdown: note.bodyMarkdown
    });
  }, [form, isOwnerArticle, note]);

  const handleEditField = (field: EditableNoteArticleField) => {
    if (!isOwnerArticle) return;
    setSavedMessage('');
    setEditingField(field);
  };

  const handleCancel = () => {
    if (note) {
      form.reset({
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

  const handleSave = (entry: NoteEntryModel) => {
    if (!isOwnerArticle) return;
    setSavedMessage('');

    updateNoteMutation.mutate(entry, {
      onSuccess: () => {
        form.reset(entry);
        setEditingField(undefined);
        setSavedMessage('Saved.');
      }
    });
  };

  const content = (
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_18rem]">
      <NoteArticleMetadataPane
        categoryError={form.formState.errors.category}
        categoryField={form.register('category')}
        editingField={editingField}
        errorMessage={updateNoteMutation.error instanceof Error ? updateNoteMutation.error.message : undefined}
        isDirty={form.formState.isDirty}
        isEditable={isOwnerArticle}
        isSaving={updateNoteMutation.isPending}
        note={note}
        savedMessage={savedMessage}
        slugError={form.formState.errors.slug}
        slugField={form.register('slug')}
        tagsError={form.formState.errors.tags}
        tagsField={form.register('tags')}
        onCancel={handleCancel}
        onEditField={handleEditField}
      />
      <NoteArticleContent
        bodyMarkdownError={form.formState.errors.bodyMarkdown}
        bodyMarkdownField={form.register('bodyMarkdown')}
        bodyMarkdownValue={bodyMarkdown}
        editingField={editingField}
        isEditable={isOwnerArticle}
        isLoading={noteQuery.isLoading}
        isError={noteQuery.isError}
        note={note}
        summaryError={form.formState.errors.summary}
        summaryField={form.register('summary')}
        titleError={form.formState.errors.title}
        titleField={form.register('title')}
        onEditField={handleEditField}
      />
      <NotesSectionsPane sections={sections} />
    </div>
  );

  return (
    <WorkspacePageWrapper>
      {isOwnerArticle ? (
        <form className="h-full min-h-0" onSubmit={form.handleSubmit(handleSave)}>
          {content}
        </form>
      ) : (
        content
      )}
    </WorkspacePageWrapper>
  );
};
