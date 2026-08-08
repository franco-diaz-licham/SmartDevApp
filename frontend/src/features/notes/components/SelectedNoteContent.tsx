import type { PublicNoteDetailModel, PublicNoteListItemModel } from '../types/note.types';
import { formatNoteDate, getNoteSectionId } from '../utils/noteContent';

interface SelectedNoteContentProps {
  note: PublicNoteDetailModel | undefined;
  noteSummary: PublicNoteListItemModel | undefined;
  isLoading: boolean;
  isError: boolean;
}

const renderMarkdownBlock = (block: string, index: number) => {
  const trimmedBlock = block.trim();
  const heading = /^(#{1,4})\s+(.+)$/.exec(trimmedBlock);

  if (heading) {
    const level = heading[1].length;
    const title = heading[2];
    const HeadingTag = `h${Math.min(level + 1, 4)}` as 'h2' | 'h3' | 'h4';

    return (
      <HeadingTag key={`${title}-${index}`} id={getNoteSectionId(title) || 'overview'} className="scroll-mt-28 border-t border-border pt-8 text-xl font-extrabold leading-tight first:border-t-0 first:pt-0">
        {title}
      </HeadingTag>
    );
  }

  if (trimmedBlock.startsWith('```')) {
    return (
      <pre key={index} className="overflow-x-auto rounded-md bg-foreground p-4 text-sm leading-6 text-background">
        <code>
          {trimmedBlock
            .replace(/^```[a-zA-Z]*\n?/, '')
            .replace(/```$/, '')
            .trim()}
        </code>
      </pre>
    );
  }

  const listItemMatches = trimmedBlock
    .split('\n')
    .map((line) => /^[-*]\s+(.+)$/.exec(line.trim()))
    .filter((match): match is RegExpExecArray => match !== null);

  if (listItemMatches.length > 0) {
    return (
      <ul key={index} className="list-disc space-y-2 pl-5 text-base leading-7 text-foreground">
        {listItemMatches.map((item) => (
          <li key={item[1]}>{item[1]}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="text-base leading-8 text-foreground">
      {trimmedBlock}
    </p>
  );
};

const renderMarkdown = (markdown: string) => {
  const blocks = markdown.split(/\n{2,}/).filter((block) => block.trim().length > 0);
  return blocks.map(renderMarkdownBlock);
};

export const SelectedNoteContent = ({ note, noteSummary, isLoading, isError }: SelectedNoteContentProps) => (
  <article className="min-w-0 px-5 py-7 sm:px-8 lg:px-10">
    {noteSummary && (
      <header id="overview" className="scroll-mt-28">
        <p className="text-sm font-extrabold uppercase text-primary">{noteSummary.category.displayName}</p>
        <h2 className="mt-2 text-3xl font-extrabold leading-tight">{noteSummary.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">Published {formatNoteDate(noteSummary.publishedAt)}</p>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{noteSummary.summary}</p>
      </header>
    )}

    <div className="mt-10 space-y-6 pb-16">
      {isLoading && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">Loading selected note...</p>}
      {isError && <p className="rounded-md border border-error-border bg-error p-4 text-sm font-bold text-error-heading">Selected note could not be loaded.</p>}
      {note && renderMarkdown(note.bodyMarkdown)}
      {!noteSummary && !isLoading && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">Select a note to read.</p>}
    </div>
  </article>
);
