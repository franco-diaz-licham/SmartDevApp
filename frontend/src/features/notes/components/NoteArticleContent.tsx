import type { ChangeEvent, FocusEvent } from 'react';
import { useRef } from 'react';
import { AppButton, AppInlineEditSurface } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import { NoteMarkdown } from './NoteMarkdown';
import type { PublicNoteDetailModel } from '../types/note.types';
import { formatNoteDate } from '../utils/noteContent';

export type EditableNoteArticleField = 'title' | 'summary' | 'bodyMarkdown' | 'slug' | 'category' | 'tags';

interface NoteArticleContentProps {
  bodyMarkdownError?: string;
  bodyMarkdownValue?: string;
  editingField?: EditableNoteArticleField;
  isEditable?: boolean;
  note: PublicNoteDetailModel | undefined;
  isLoading: boolean;
  isError: boolean;
  summaryError?: string;
  summaryValue?: string;
  titleError?: string;
  titleValue?: string;
  onBodyMarkdownChange?: (value: string) => void;
  onFieldBlur?: () => void;
  onEditField?: (field: EditableNoteArticleField) => void;
  onSummaryChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const NoteArticleContent = ({
  bodyMarkdownError,
  bodyMarkdownValue,
  editingField,
  isEditable = false,
  note,
  isLoading,
  isError,
  summaryError,
  summaryValue,
  titleError,
  titleValue,
  onBodyMarkdownChange,
  onFieldBlur,
  onEditField,
  onSummaryChange,
  onTitleChange
}: NoteArticleContentProps) => {
  const bodyEditorRef = useRef<HTMLDivElement>(null);

  const handleBodyEdit = () => {
    onEditField?.('bodyMarkdown');
  };

  const handleBodyEditorBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (bodyEditorRef.current?.contains(event.relatedTarget)) return;
    onFieldBlur?.();
  };

  return (
    <article className="min-h-0 min-w-0 overflow-y-auto px-5 py-7 sm:px-8 lg:px-10">
      {isLoading && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">Loading note...</p>}
      {isError && <p className="rounded-md border border-error-border bg-error p-4 text-sm font-bold text-error-heading">Note could not be loaded.</p>}

      {note && (
        <>
          <header id="overview" className="scroll-mt-28">
            <p className="text-sm font-extrabold uppercase text-primary">{note.category.displayName}</p>
            {isEditable && editingField === 'title' ? (
              <AppInputText
                autoFocus
                inline
                inlineSize="title"
                className="mt-2 p-2 pr-8 text-3xl font-extrabold leading-tight"
                error={titleError}
                name="title"
                value={titleValue ?? note.title}
                onBlur={onFieldBlur}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onTitleChange?.(getInputValue(event));
                }}
              />
            ) : (
              <AppButton inline inlineSize="title" className="mt-2 block w-full p-2 pr-8 text-3xl font-extrabold leading-tight text-foreground" type="button" disabled={!isEditable} onClick={() => onEditField?.('title')}>
                {titleValue ?? note.title}
              </AppButton>
            )}
            <p className="mt-3 text-sm text-muted-foreground">Published {formatNoteDate(note.publishedAt)}</p>
            {isEditable && editingField === 'summary' ? (
              <AppInputTextArea
                autoFocus
                inline
                inlineSize="summary"
                className="mt-5 p-2 pr-8 text-lg leading-8"
                error={summaryError}
                name="summary"
                value={summaryValue ?? note.summary}
                onBlur={onFieldBlur}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  onSummaryChange?.(getInputValue(event));
                }}
              />
            ) : (
              <AppButton inline inlineSize="summary" className="mt-5 block w-full p-2 pr-8 text-lg leading-8 text-muted-foreground" type="button" disabled={!isEditable} onClick={() => onEditField?.('summary')}>
                {summaryValue ?? note.summary}
              </AppButton>
            )}
          </header>

          {isEditable && editingField === 'bodyMarkdown' ? (
            <div ref={bodyEditorRef} className="mt-10 rounded-md border border-border bg-background" onBlur={handleBodyEditorBlur}>
              <AppInputTextArea
                autoFocus
                aria-label="Note body"
                inline
                className="min-h-[36rem] resize-none overflow-hidden border-0 font-mono text-sm leading-7 shadow-none [field-sizing:content] focus:ring-0"
                error={bodyMarkdownError}
                name="bodyMarkdown"
                value={bodyMarkdownValue ?? note.bodyMarkdown}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  onBodyMarkdownChange?.(getInputValue(event));
                }}
              />
            </div>
          ) : (
            <AppInlineEditSurface className="mt-10" disabled={!isEditable} iconClassName="top-2 size-4 translate-y-0" onEdit={handleBodyEdit}>
              <div className="space-y-6 pb-16">
                <NoteMarkdown markdown={bodyMarkdownValue ?? note.bodyMarkdown} />
              </div>
            </AppInlineEditSurface>
          )}
        </>
      )}
    </article>
  );
};
