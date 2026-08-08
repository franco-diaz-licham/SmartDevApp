import { useEffect, useMemo, useState } from 'react';
import { appConfig } from '@/app/appConfig';
import { NotesCategoryPane } from '../components/NotesCategoryPane';
import { NotesMainContent } from '../components/NotesMainContent';
import { NotesSectionsPane } from '../components/NotesSectionsPane';
import { usePublicNoteQuery, usePublicNotesQuery } from '../queries/note.queries';
import { allNotesCategory, getFilteredNotes, getNoteCategories, getNoteSections } from '../utils/noteContent';

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
  const selectedNoteQuery = usePublicNoteQuery(activeSlug);
  const selectedNote = selectedNoteQuery.data;
  const noteSections = useMemo(() => getNoteSections(selectedNote?.bodyMarkdown ?? ''), [selectedNote?.bodyMarkdown]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSlug('');
  };

  const handleLoadMore = () => {
    void notesQuery.fetchNextPage();
  };

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-background text-foreground">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_18rem]">
        <NotesCategoryPane categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

        <NotesMainContent
          notes={filteredNotes}
          selectedNote={selectedNote}
          selectedNoteSummary={selectedNote ?? selectedListItem}
          searchTerm={searchTerm}
          selectedSlug={activeSlug}
          isNotesLoading={notesQuery.isLoading}
          isNotesError={notesQuery.isError}
          hasNextPage={notesQuery.hasNextPage}
          isFetchingNextPage={notesQuery.isFetchingNextPage}
          isSelectedNoteLoading={selectedNoteQuery.isLoading}
          isSelectedNoteError={selectedNoteQuery.isError}
          onSearchTermChange={setSearchTerm}
          onSelectNote={setSelectedSlug}
          onLoadMore={handleLoadMore}
        />

        <NotesSectionsPane sections={noteSections} />
      </div>
    </main>
  );
};
