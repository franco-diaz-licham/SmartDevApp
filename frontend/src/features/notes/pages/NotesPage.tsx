import { useEffect, useMemo, useState } from 'react';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { NotesCategoryPane } from '../components/NotesCategoryPane';
import { NotesMainContent } from '../components/NotesMainContent';
import { useOwnerNotesQuery, usePublicNotesQuery } from '../queries/note.queries';
import { allNotesCategory, getFilteredNotes, getNoteCategories } from '../utils/noteContent';

export const NotesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(allNotesCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, isAuthReady } = useAuth();

  const notesQueryParams = useMemo(() => ({ pageSize: 30 }), []);
  const publicNotesQuery = usePublicNotesQuery(notesQueryParams, !isAuthReady || !isAuthenticated);
  const ownerNotesQuery = useOwnerNotesQuery(notesQueryParams, isAuthReady && isAuthenticated);
  const notesQuery = isAuthReady && isAuthenticated ? ownerNotesQuery : publicNotesQuery;

  useEffect(() => {
    document.title = `Notes | ${appConfig.appName}`;
  }, []);

  const notes = useMemo(() => notesQuery.data?.pages.flatMap((page) => page.items) ?? [], [notesQuery.data]);
  const categories = useMemo(() => getNoteCategories(notes), [notes]);
  const filteredNotes = useMemo(() => getFilteredNotes(notes, selectedCategory, searchTerm), [notes, searchTerm, selectedCategory]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLoadMore = () => {
    void notesQuery.fetchNextPage();
  };

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]">
        <NotesCategoryPane categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
        <NotesMainContent
          notes={filteredNotes}
          searchTerm={searchTerm}
          isNotesLoading={notesQuery.isLoading}
          isNotesError={notesQuery.isError}
          hasNextPage={notesQuery.hasNextPage}
          isFetchingNextPage={notesQuery.isFetchingNextPage}
          onSearchTermChange={setSearchTerm}
          onLoadMore={handleLoadMore}
        />
      </div>
    </WorkspacePageWrapper>
  );
};
