import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteEntryEditorMainContent, type NoteEditorMode } from '../components/NoteEntryEditorMainContent';
import { NoteEntryMetadataPanel } from '../components/NoteEntryMetadataPanel';
import { useNoteEntryForm } from '../hooks/useNoteEntryForm';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../queries/note.mutations';
import { useOwnerNoteEntryQuery } from '../queries/note.queries';

export const CreateNotePage = () => {
  const [mode, setMode] = useState<NoteEditorMode>('edit');
  const [savedMessage, setSavedMessage] = useState('');
  const navigate = useNavigate();
  const { noteId = '' } = useParams();
  const isExistingNote = noteId.trim().length > 0;
  const form = useNoteEntryForm();
  const { draft, errors } = form;
  const { getValidForm, reset, touchField, updateField } = form;
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation(noteId);
  const noteEntryQuery = useOwnerNoteEntryQuery(noteId);
  const activeMutation = isExistingNote ? updateNoteMutation : createNoteMutation;

  useEffect(() => {
    document.title = `${isExistingNote ? 'Edit note' : 'Create note'} | ${appConfig.appName}`;
  }, [isExistingNote]);

  useEffect(() => {
    if (!noteEntryQuery.data) return;

    reset(noteEntryQuery.data);
  }, [noteEntryQuery.data, reset]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage('');
    const note = getValidForm();
    if (!note) return;

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
      <form className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]" onSubmit={handleSave}>
        <NoteEntryEditorMainContent
          bodyMarkdown={draft.bodyMarkdown}
          bodyMarkdownError={errors.bodyMarkdown}
          mode={mode}
          title={draft.title}
          titleError={errors.title}
          onBodyMarkdownBlur={() => touchField('bodyMarkdown')}
          onBodyMarkdownChange={(value) => updateField('bodyMarkdown', value)}
          onModeChange={setMode}
          onTitleBlur={() => touchField('title')}
          onTitleChange={(value) => updateField('title', value)}
        />
        <NoteEntryMetadataPanel
          categoryError={errors.category}
          errorMessage={activeMutation.error instanceof Error ? activeMutation.error.message : noteEntryQuery.error instanceof Error ? noteEntryQuery.error.message : undefined}
          isSaving={activeMutation.isPending || noteEntryQuery.isLoading}
          note={draft}
          savedMessage={savedMessage}
          slugError={errors.slug}
          summaryError={errors.summary}
          tagsError={errors.tags}
          onFieldBlur={touchField}
          onFieldChange={updateField}
        />
      </form>
    </WorkspacePageWrapper>
  );
};
