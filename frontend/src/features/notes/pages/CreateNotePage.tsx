import { useEffect, useState } from 'react';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteEntryEditorMainContent, type NoteEditorMode } from '../components/NoteEntryEditorMainContent';
import { NoteEntryMetadataPanel } from '../components/NoteEntryMetadataPanel';

export const CreateNotePage = () => {
  const [mode, setMode] = useState<NoteEditorMode>('edit');
  const [title, setTitle] = useState('');
  const [bodyMarkdown, setBodyMarkdown] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    document.title = `Create note | ${appConfig.appName}`;
  }, []);

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <NoteEntryEditorMainContent bodyMarkdown={bodyMarkdown} mode={mode} title={title} onBodyMarkdownChange={setBodyMarkdown} onModeChange={setMode} onTitleChange={setTitle} />
        <NoteEntryMetadataPanel category={category} slug={slug} summary={summary} tags={tags} onCategoryChange={setCategory} onSlugChange={setSlug} onSummaryChange={setSummary} onTagsChange={setTags} />
      </div>
    </WorkspacePageWrapper>
  );
};
