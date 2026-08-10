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
  const [selectedNoteId, setSelectedNoteId] = useState('');
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
  const activeNoteId = filteredNotes.some((note) => note.id === selectedNoteId) ? selectedNoteId : (filteredNotes[0]?.id ?? '');

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedNoteId('');
  };

  const handleLoadMore = () => {
    void notesQuery.fetchNextPage();
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <NotesCategoryPane categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
        <div className="min-h-0 min-w-0">
          <NotesMainContent
            notes={filteredNotes}
            searchTerm={searchTerm}
            selectedNoteId={activeNoteId}
            isNotesLoading={notesQuery.isLoading}
            isNotesError={notesQuery.isError}
            hasNextPage={notesQuery.hasNextPage}
            isFetchingNextPage={notesQuery.isFetchingNextPage}
            isOwnerView={isAuthReady && isAuthenticated}
            onSearchTermChange={setSearchTerm}
            onSelectNote={handleSelectNote}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </WorkspacePageWrapper>
  );
};
