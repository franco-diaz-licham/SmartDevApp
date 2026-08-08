import type { PublicNoteDetailModel, PublicNoteListItemModel } from '../types/note.types';
import { NotesResultsList } from './NotesResultsList';
import { SelectedNoteContent } from './SelectedNoteContent';

interface NotesMainContentProps {
  notes: PublicNoteListItemModel[];
  selectedNote: PublicNoteDetailModel | undefined;
  selectedNoteSummary: PublicNoteListItemModel | undefined;
  searchTerm: string;
  selectedSlug: string;
  isNotesLoading: boolean;
  isNotesError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isSelectedNoteLoading: boolean;
  isSelectedNoteError: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onSelectNote: (slug: string) => void;
  onLoadMore: () => void;
}

export const NotesMainContent = ({
  notes,
  selectedNote,
  selectedNoteSummary,
  searchTerm,
  selectedSlug,
  isNotesLoading,
  isNotesError,
  hasNextPage,
  isFetchingNextPage,
  isSelectedNoteLoading,
  isSelectedNoteError,
  onSearchTermChange,
  onSelectNote,
  onLoadMore
}: NotesMainContentProps) => (
  <section className="min-w-0 xl:border-r">
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

    <SelectedNoteContent note={selectedNote} noteSummary={selectedNoteSummary} isLoading={isSelectedNoteLoading} isError={isSelectedNoteError} />
  </section>
);
