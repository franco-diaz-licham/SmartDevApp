import type { PublicNoteListItemModel } from '../types/note.types';

interface NotesResultsListProps {
  notes: PublicNoteListItemModel[];
  searchTerm: string;
  selectedSlug: string;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onSelectNote: (slug: string) => void;
  onLoadMore: () => void;
}

export const NotesResultsList = ({ notes, searchTerm, selectedSlug, isLoading, isError, hasNextPage, isFetchingNextPage, onSearchTermChange, onSelectNote, onLoadMore }: NotesResultsListProps) => (
  <div className="px-5 py-6 sm:px-8 lg:px-10">
    <label className="block text-sm font-extrabold" htmlFor="notes-search">
      Search notes
    </label>
    <input
      id="notes-search"
      className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      type="search"
      value={searchTerm}
      placeholder="Search title, summary, category, or tag"
      onChange={(event) => onSearchTermChange(event.target.value)}
    />

    <div className="mt-6 grid gap-3">
      {isLoading && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">Loading notes...</p>}
      {isError && <p className="rounded-md border border-error-border bg-error p-4 text-sm font-bold text-error-heading">Notes could not be loaded.</p>}

      {notes.map((note) => {
        const isSelected = selectedSlug === note.slug;

        return (
          <button
            key={note.id}
            className={`rounded-md border p-4 text-left transition hover:border-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 ${isSelected ? 'border-primary bg-muted/70' : 'border-border bg-background'}`}
            type="button"
            onClick={() => onSelectNote(note.slug)}
          >
            <span className="text-xs font-extrabold uppercase text-primary">{note.category.displayName}</span>
            <span className="mt-2 block text-lg font-extrabold leading-snug">{note.title}</span>
            <span className="mt-2 block text-sm leading-6 text-muted-foreground">{note.summary}</span>
            <span className="mt-3 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span key={tag.slug} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                  {tag.displayName}
                </span>
              ))}
            </span>
          </button>
        );
      })}

      {!isLoading && notes.length === 0 && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No notes match this view.</p>}

      {hasNextPage && (
        <button
          className="rounded-md border border-border px-4 py-3 text-sm font-extrabold hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isFetchingNextPage}
          onClick={onLoadMore}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more notes'}
        </button>
      )}
    </div>
  </div>
);
