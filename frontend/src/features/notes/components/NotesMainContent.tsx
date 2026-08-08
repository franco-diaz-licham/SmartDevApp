import type { PublicNoteListItemModel } from '../types/note.types';
import { NotesResultsList } from './NotesResultsList';

interface NotesMainContentProps {
  notes: PublicNoteListItemModel[];
  searchTerm: string;
  selectedNoteId: string;
  isNotesLoading: boolean;
  isNotesError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onSelectNote: (noteId: string) => void;
  onLoadMore: () => void;
}

export const NotesMainContent = ({
  notes,
  searchTerm,
  selectedNoteId,
  isNotesLoading,
  isNotesError,
  hasNextPage,
  isFetchingNextPage,
  onSearchTermChange,
  onSelectNote,
  onLoadMore
}: NotesMainContentProps) => (
  <section className="min-h-0 min-w-0 overflow-y-auto xl:border-r">
    <NotesResultsList
      notes={notes}
      searchTerm={searchTerm}
      selectedNoteId={selectedNoteId}
      isLoading={isNotesLoading}
      isError={isNotesError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onSearchTermChange={onSearchTermChange}
      onSelectNote={onSelectNote}
      onLoadMore={onLoadMore}
    />
  </section>
);
