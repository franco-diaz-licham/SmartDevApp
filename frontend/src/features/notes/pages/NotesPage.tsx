import { useEffect, useMemo, useState } from 'react';
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

  const notesQueryParams = useMemo(() => ({ pageSize: 30 }), []);
  const notesQuery = usePublicNotesQuery(notesQueryParams);

  useEffect(() => {
    document.title = `Notes | ${appConfig.appName}`;
  }, []);

  const notes = useMemo(() => notesQuery.data?.pages.flatMap((page) => page.items) ?? [], [notesQuery.data]);
  const categories = useMemo(() => getNoteCategories(notes), [notes]);
  const filteredNotes = useMemo(() => getFilteredNotes(notes, selectedCategory, searchTerm), [notes, searchTerm, selectedCategory]);
  const activeSlug = filteredNotes.some((note) => note.slug === selectedSlug) ? selectedSlug : (filteredNotes[0]?.slug ?? '');
  const selectedListItem = notes.find((note) => note.slug === activeSlug);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSlug('');
  };

  const handleLoadMore = () => {
    void notesQuery.fetchNextPage();
  };

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <NotesCategoryPane categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
        <NotesMainContent
          notes={filteredNotes}
          selectedNoteSummary={selectedListItem}
          searchTerm={searchTerm}
          selectedSlug={activeSlug}
          isNotesLoading={notesQuery.isLoading}
          isNotesError={notesQuery.isError}
          hasNextPage={notesQuery.hasNextPage}
          isFetchingNextPage={notesQuery.isFetchingNextPage}
          onSearchTermChange={setSearchTerm}
          onSelectNote={setSelectedSlug}
          onLoadMore={handleLoadMore}
        />
      </div>
    </WorkspacePageWrapper>
  );
};
