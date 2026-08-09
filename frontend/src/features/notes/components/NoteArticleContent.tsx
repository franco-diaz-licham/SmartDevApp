import type { KeyboardEvent } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import type { PublicNoteDetailModel } from '../types/note.types';
import { formatNoteDate, getNoteSectionId } from '../utils/noteContent';

export type EditableNoteArticleField = 'title' | 'summary' | 'bodyMarkdown' | 'slug' | 'category' | 'tags';

interface NoteArticleContentProps {
  bodyMarkdownField?: UseFormRegisterReturn;
  bodyMarkdownError?: FieldError;
  bodyMarkdownValue?: string;
  editingField?: EditableNoteArticleField;
  isEditable?: boolean;
  note: PublicNoteDetailModel | undefined;
  isLoading: boolean;
  isError: boolean;
  summaryField?: UseFormRegisterReturn;
  summaryError?: FieldError;
  titleField?: UseFormRegisterReturn;
  titleError?: FieldError;
  onEditField?: (field: EditableNoteArticleField) => void;
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

export const NoteArticleContent = ({ bodyMarkdownField, bodyMarkdownError, bodyMarkdownValue, editingField, isEditable = false, note, isLoading, isError, summaryField, summaryError, titleField, titleError, onEditField }: NoteArticleContentProps) => {
  const handleBodyKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isEditable) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEditField?.('bodyMarkdown');
    }
  };

  return (
    <article className="min-h-0 min-w-0 overflow-y-auto px-5 py-7 sm:px-8 lg:px-10">
      {isLoading && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">Loading note...</p>}
      {isError && <p className="rounded-md border border-error-border bg-error p-4 text-sm font-bold text-error-heading">Note could not be loaded.</p>}

      {note && (
        <>
          <header id="overview" className="scroll-mt-28">
            <p className="text-sm font-extrabold uppercase text-primary">{note.category.displayName}</p>
            {isEditable && editingField === 'title' && titleField ? (
              <AppInputText {...titleField} autoFocus className="mt-2 border-0 px-0 text-3xl font-extrabold leading-tight shadow-none focus:ring-0" error={titleError?.message} />
            ) : (
              <button className="mt-2 block w-full bg-transparent p-0 text-left text-3xl font-extrabold leading-tight text-foreground disabled:cursor-default" type="button" disabled={!isEditable} onClick={() => onEditField?.('title')}>
                {note.title}
              </button>
            )}
            <p className="mt-3 text-sm text-muted-foreground">Published {formatNoteDate(note.publishedAt)}</p>
            {isEditable && editingField === 'summary' && summaryField ? (
              <AppInputTextArea {...summaryField} autoFocus className="mt-5 min-h-32 text-lg leading-8" error={summaryError?.message} />
            ) : (
              <button className="mt-5 block w-full bg-transparent p-0 text-left text-lg leading-8 text-muted-foreground disabled:cursor-default" type="button" disabled={!isEditable} onClick={() => onEditField?.('summary')}>
                {note.summary}
              </button>
            )}
          </header>

          {isEditable && editingField === 'bodyMarkdown' && bodyMarkdownField ? (
            <AppInputTextArea {...bodyMarkdownField} autoFocus className="mt-10 min-h-[36rem] font-mono text-sm leading-7" error={bodyMarkdownError?.message} />
          ) : (
            <div className={isEditable ? 'mt-10 cursor-text' : 'mt-10'} role={isEditable ? 'button' : undefined} tabIndex={isEditable ? 0 : undefined} onClick={() => onEditField?.('bodyMarkdown')} onKeyDown={handleBodyKeyDown}>
              <div className="space-y-6 pb-16">{renderMarkdown(bodyMarkdownValue ?? note.bodyMarkdown)}</div>
            </div>
          )}
        </>
      )}
    </article>
  );
};
