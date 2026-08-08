import { Link } from 'react-router-dom';
import type { PublicNoteListItemModel } from '../types/note.types';
import { formatNoteDate } from '../utils/noteContent';

interface SelectedNoteMiniArticleProps {
  note: PublicNoteListItemModel | undefined;
}

export const SelectedNoteMiniArticle = ({ note }: SelectedNoteMiniArticleProps) => (
  <section className="border-b border-border px-5 py-6 sm:px-8 lg:px-10" aria-label="Selected note summary">
    {note ? (
      <>
        <p className="text-xs font-extrabold uppercase text-primary">{note.category.displayName}</p>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight">{note.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">Published {formatNoteDate(note.publishedAt)}</p>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">{note.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag.slug} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
              {tag.displayName}
            </span>
          ))}
        </div>
        <Link className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground no-underline hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/30" to={`/workspace/notes/${note.slug}`}>
          Open note
        </Link>
      </>
    ) : (
      <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">Select a note to preview it.</p>
    )}
  </section>
);
