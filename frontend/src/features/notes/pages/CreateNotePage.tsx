import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteEntryEditorMainContent, type NoteEditorMode } from '../components/NoteEntryEditorMainContent';
import { NoteEntryMetadataPanel } from '../components/NoteEntryMetadataPanel';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../queries/note.mutations';
import { useOwnerNoteEntryQuery } from '../queries/note.queries';
import type { NoteEntryModel } from '../types/note.types';
import { defaultNoteEntryFormValues, noteEntryFormResolver } from '../types/noteEntryForm.schema';

export const CreateNotePage = () => {
  const [mode, setMode] = useState<NoteEditorMode>('edit');
  const [savedMessage, setSavedMessage] = useState('');
  const navigate = useNavigate();
  const { noteId = '' } = useParams();
  const isExistingNote = noteId.trim().length > 0;
  const form = useForm<NoteEntryModel>({
    defaultValues: defaultNoteEntryFormValues,
    mode: 'onBlur',
    resolver: noteEntryFormResolver
  });
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation(noteId);
  const noteEntryQuery = useOwnerNoteEntryQuery(noteId);
  const activeMutation = isExistingNote ? updateNoteMutation : createNoteMutation;
  const bodyMarkdown = form.watch('bodyMarkdown');

  useEffect(() => {
    document.title = `${isExistingNote ? 'Edit note' : 'Create note'} | ${appConfig.appName}`;
  }, [isExistingNote]);

  useEffect(() => {
    if (!noteEntryQuery.data) return;

    form.reset(noteEntryQuery.data);
  }, [form, noteEntryQuery.data]);

  const handleSave = (note: NoteEntryModel) => {
    setSavedMessage('');

    if (isExistingNote) {
      updateNoteMutation.mutate(note, {
        onSuccess: () => {
          form.reset(note);
          setSavedMessage('Draft saved.');
        }
      });

      return;
    }

    createNoteMutation.mutate(note, {
      onSuccess: (savedNote) => {
        setSavedMessage('Draft saved.');
        void navigate(`/workspace/notes/${encodeURIComponent(savedNote.noteId)}`, { replace: true });
      }
    });
  };

  return (
    <WorkspacePageWrapper>
      <form className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]" onSubmit={form.handleSubmit(handleSave)}>
        <NoteEntryEditorMainContent
          bodyMarkdown={bodyMarkdown}
          bodyMarkdownError={form.formState.errors.bodyMarkdown}
          bodyMarkdownField={form.register('bodyMarkdown')}
          mode={mode}
          titleError={form.formState.errors.title}
          titleField={form.register('title')}
          onModeChange={setMode}
        />
        <NoteEntryMetadataPanel
          categoryError={form.formState.errors.category}
          categoryField={form.register('category')}
          errorMessage={activeMutation.error instanceof Error ? activeMutation.error.message : noteEntryQuery.error instanceof Error ? noteEntryQuery.error.message : undefined}
          isSaving={activeMutation.isPending || noteEntryQuery.isLoading}
          savedMessage={savedMessage}
          slugError={form.formState.errors.slug}
          slugField={form.register('slug')}
          summaryError={form.formState.errors.summary}
          summaryField={form.register('summary')}
          tagsError={form.formState.errors.tags}
          tagsField={form.register('tags')}
        />
      </form>
    </WorkspacePageWrapper>
  );
};
