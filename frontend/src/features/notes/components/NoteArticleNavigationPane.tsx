import { Link } from 'react-router-dom';
import type { PublicNoteDetailModel } from '../types/note.types';

interface NoteArticleNavigationPaneProps {
  note: PublicNoteDetailModel | undefined;
}

export const NoteArticleNavigationPane = ({ note }: NoteArticleNavigationPaneProps) => (
  <aside className="min-h-0 overflow-y-auto border-b border-border px-5 py-6 lg:border-b-0 lg:border-r xl:px-6">
    <Link className="text-sm font-extrabold text-primary no-underline hover:underline" to="/workspace">
      Back to notes
    </Link>

    {note && (
      <div className="mt-8">
        <p className="text-xs font-extrabold uppercase text-primary">{note.category.displayName}</p>
        <h2 className="mt-2 text-xl font-extrabold leading-tight">{note.title}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag.slug} className="rounded bg-background px-2 py-1 text-xs font-bold text-muted-foreground">
              {tag.displayName}
            </span>
          ))}
        </div>
      </div>
    )}
  </aside>
);
