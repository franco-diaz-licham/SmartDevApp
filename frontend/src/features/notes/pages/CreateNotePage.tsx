import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteEntryEditorMainContent, type NoteEditorMode } from '../components/NoteEntryEditorMainContent';
import { NoteEntryMetadataPanel } from '../components/NoteEntryMetadataPanel';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../queries/note.mutations';
import type { NoteEntryModel } from '../types/note.types';

export const CreateNotePage = () => {
  const [mode, setMode] = useState<NoteEditorMode>('edit');
  const [title, setTitle] = useState('');
  const [bodyMarkdown, setBodyMarkdown] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const navigate = useNavigate();
  const { noteId = '' } = useParams();
  const isExistingNote = noteId.trim().length > 0;
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation(noteId);
  const activeMutation = isExistingNote ? updateNoteMutation : createNoteMutation;

  useEffect(() => {
    document.title = `${isExistingNote ? 'Edit note' : 'Create note'} | ${appConfig.appName}`;
  }, [isExistingNote]);

  const handleSave = () => {
    setSavedMessage('');

    const note: NoteEntryModel = {
      title,
      slug,
      summary,
      category,
      tags,
      bodyMarkdown
    };

    if (isExistingNote) {
      updateNoteMutation.mutate(note, {
        onSuccess: () => {
          setSavedMessage('Draft saved.');
        }
      });

      return;
    }

    createNoteMutation.mutate(note, {
      onSuccess: (savedNote) => {
        setSavedMessage('Draft saved.');
        void navigate(`/workspace/notes/${encodeURIComponent(savedNote.noteId)}/edit`, { replace: true });
      }
    });
  };

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <NoteEntryEditorMainContent bodyMarkdown={bodyMarkdown} mode={mode} title={title} onBodyMarkdownChange={setBodyMarkdown} onModeChange={setMode} onTitleChange={setTitle} />
        <NoteEntryMetadataPanel
          category={category}
          errorMessage={activeMutation.error instanceof Error ? activeMutation.error.message : undefined}
          isSaving={activeMutation.isPending}
          savedMessage={savedMessage}
          slug={slug}
          summary={summary}
          tags={tags}
          onCategoryChange={setCategory}
          onSave={handleSave}
          onSlugChange={setSlug}
          onSummaryChange={setSummary}
          onTagsChange={setTags}
        />
      </div>
    </WorkspacePageWrapper>
  );
};
