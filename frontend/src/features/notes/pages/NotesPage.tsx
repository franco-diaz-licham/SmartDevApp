import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NotesCategoryPane } from '../components/NotesCategoryPane';
import { NotesMainContent } from '../components/NotesMainContent';
import { usePublicNotesQuery } from '../queries/note.queries';
import { allNotesCategory, getFilteredNotes, getNoteCategories } from '../utils/noteContent';

export const NotesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(allNotesCategory);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const notesQueryParams = useMemo(() => ({ pageSize: 30 }), []);
  const notesQuery = usePublicNotesQuery(notesQueryParams);

  useEffect(() => {
    document.title = `Notes | ${appConfig.appName}`;
  }, []);

  const notes = useMemo(() => notesQuery.data?.pages.flatMap((page) => page.items) ?? [], [notesQuery.data]);
  const categories = useMemo(() => getNoteCategories(notes), [notes]);
  const filteredNotes = useMemo(() => getFilteredNotes(notes, selectedCategory, searchTerm), [notes, searchTerm, selectedCategory]);
  const activeSlug = filteredNotes.some((note) => note.slug === selectedSlug) ? selectedSlug : (filteredNotes[0]?.slug ?? '');

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSlug('');
  };

  const handleLoadMore = () => {
    void notesQuery.fetchNextPage();
  };

  const handleSelectNote = (slug: string) => {
    setSelectedSlug(slug);
    void navigate(`/workspace/notes/${encodeURIComponent(slug)}`);
  };

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <NotesCategoryPane categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
        <div className="min-h-0 min-w-0">
          <NotesMainContent
            notes={filteredNotes}
            searchTerm={searchTerm}
            selectedSlug={activeSlug}
            isNotesLoading={notesQuery.isLoading}
            isNotesError={notesQuery.isError}
            hasNextPage={notesQuery.hasNextPage}
            isFetchingNextPage={notesQuery.isFetchingNextPage}
            onSearchTermChange={setSearchTerm}
            onSelectNote={handleSelectNote}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </WorkspacePageWrapper>
  );
};
