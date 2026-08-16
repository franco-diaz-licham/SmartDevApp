import { Link } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AuthenticatedOnly } from '@/features/auth';
import { NotesListSkeleton } from './NotesListItemSkeleton';
import type { PublicNoteListItemModel } from '../types/note.types';

interface NotesMainContentProps {
  notes: PublicNoteListItemModel[];
  searchTerm: string;
  isNotesLoading: boolean;
  isNotesError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onLoadMore: () => void;
}

export const NotesMainContent = ({ notes, searchTerm, isNotesLoading, isNotesError, hasNextPage, isFetchingNextPage, onSearchTermChange, onLoadMore }: NotesMainContentProps) => (
  <section className="h-full min-h-0 min-w-0 overflow-y-auto">
    <div className="px-5 py-6 sm:px-8 lg:px-10">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <AppInputText
          id="notes-search"
          label="Search notes"
          name="notesSearch"
          type="search"
          value={searchTerm}
          placeholder="Search title, summary, category, or tag"
          className="min-h-12 text-base"
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchTermChange(event.target.value)}
        />

        <AuthenticatedOnly>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-4 text-sm font-extrabold text-primary-foreground no-underline hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/30"
            to="/workspace/notes/new"
          >
            New note
          </Link>
        </AuthenticatedOnly>
      </div>

      <div className="mt-6 grid gap-3">
        {isNotesLoading && <NotesListSkeleton />}
        {isNotesError && <p className="rounded-md border border-error-border bg-error p-4 text-sm font-bold text-error-heading">Notes could not be loaded.</p>}
        {notes.map((note) => (
          <Link
            key={note.id}
            className="rounded-md border border-border bg-background p-4 no-underline transition hover:border-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            to={`/workspace/notes/${encodeURIComponent(note.id)}`}
          >
            <span className="text-xs font-extrabold uppercase text-primary">{note.category.displayName}</span>
            <span className="mt-2 block text-lg font-extrabold leading-snug text-foreground">{note.title}</span>
            <span className="mt-2 block border-t border-border pt-3 text-sm leading-6 text-muted-foreground">{note.summary}</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span key={tag.slug} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                  {tag.displayName}
                </span>
              ))}
            </div>
          </Link>
        ))}

        {!isNotesLoading && notes.length === 0 && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No notes match this view.</p>}
        {hasNextPage && (
          <AppButton appearance="secondary" className="mb-0 mt-0 w-full px-4 py-3 text-sm font-extrabold" type="button" disabled={isFetchingNextPage} onClick={onLoadMore}>
            Load more notes
          </AppButton>
        )}
        {isFetchingNextPage && <NotesListSkeleton />}
      </div>
    </div>
  </section>
);
