import type { PublicNoteListItemModel } from '../types/note.types';
import { NotesResultsList } from './NotesResultsList';
import { SelectedNoteMiniArticle } from './SelectedNoteMiniArticle';

interface NotesMainContentProps {
  notes: PublicNoteListItemModel[];
  selectedNoteSummary: PublicNoteListItemModel | undefined;
  searchTerm: string;
  selectedSlug: string;
  isNotesLoading: boolean;
  isNotesError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onSelectNote: (slug: string) => void;
  onLoadMore: () => void;
}

export const NotesMainContent = ({
  notes,
  selectedNoteSummary,
  searchTerm,
  selectedSlug,
  isNotesLoading,
  isNotesError,
  hasNextPage,
  isFetchingNextPage,
  onSearchTermChange,
  onSelectNote,
  onLoadMore
}: NotesMainContentProps) => (
  <section className="min-h-0 min-w-0 overflow-y-auto xl:border-r">
    <SelectedNoteMiniArticle note={selectedNoteSummary} />

    <NotesResultsList
      notes={notes}
      searchTerm={searchTerm}
      selectedSlug={selectedSlug}
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
