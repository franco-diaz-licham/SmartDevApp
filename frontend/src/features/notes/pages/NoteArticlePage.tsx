import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteArticleContent } from '../components/NoteArticleContent';
import { NoteArticleNavigationPane } from '../components/NoteArticleNavigationPane';
import { NotesSectionsPane } from '../components/NotesSectionsPane';
import { usePublicNoteQuery } from '../queries/note.queries';
import { getNoteSections } from '../utils/noteContent';

export const NoteArticlePage = () => {
  const { slug = '' } = useParams();
  const noteQuery = usePublicNoteQuery(slug);
  const note = noteQuery.data;
  const sections = useMemo(() => getNoteSections(note?.bodyMarkdown ?? ''), [note?.bodyMarkdown]);

  useEffect(() => {
    document.title = `${note?.title ?? 'Note'} | ${appConfig.appName}`;
  }, [note?.title]);

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_18rem]">
        <NoteArticleNavigationPane note={note} />
        <NoteArticleContent note={note} isLoading={noteQuery.isLoading} isError={noteQuery.isError} />
        <NotesSectionsPane sections={sections} />
      </div>
    </WorkspacePageWrapper>
  );
};
