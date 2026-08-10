import type { ChangeEvent, FocusEvent } from 'react';
import { useRef } from 'react';
import { AppInlineEditSurface } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import { NoteMarkdown } from './NoteMarkdown';
import type { EditableNoteEntryField, NoteEntryFormController } from '../hooks/useNoteEntryForm';
import type { PublicNoteDetailModel } from '../types/note.types';
import { formatNoteDate } from '../utils/noteContent';

export type EditableNoteArticleField = EditableNoteEntryField;

interface NoteArticleContentProps {
  form?: NoteEntryFormController;
  isEditable?: boolean;
  note: PublicNoteDetailModel | undefined;
  isLoading: boolean;
  isError: boolean;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const NoteArticleContent = ({ form, isEditable = false, note, isLoading, isError }: NoteArticleContentProps) => {
  const bodyEditorRef = useRef<HTMLDivElement>(null);
  const editingField = form?.editingField;
  const titleValue = form?.values.title;
  const summaryValue = form?.values.summary;
  const bodyMarkdownValue = form?.values.bodyMarkdown;

  const handleBodyEdit = () => {
    form?.editField('bodyMarkdown');
  };

  const handleBodyEditorBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (bodyEditorRef.current?.contains(event.relatedTarget)) return;
    form?.blurField();
  };

  return (
    <article className="min-h-0 min-w-0 overflow-y-auto px-5 py-7 sm:px-8 lg:px-10">
      {isLoading && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">Loading note...</p>}
      {isError && <p className="rounded-md border border-error-border bg-error p-4 text-sm font-bold text-error-heading">Note could not be loaded.</p>}

      {note && (
        <>
          <header id="overview" className="scroll-mt-28">
            <p className="text-sm font-extrabold uppercase text-primary">{note.category.displayName}</p>
            <AppInputText
              autoFocus={isEditable && editingField === 'title'}
              inline
              inlineSize="title"
              inlineStatus={isEditable && editingField === 'title' ? 'edit' : 'read'}
              className="mt-2 p-2 pr-8 text-3xl font-extrabold leading-tight text-foreground"
              error={form?.errors.title}
              name="title"
              readValue={titleValue ?? note.title}
              value={titleValue ?? note.title}
              onBlur={form?.blurField}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                form?.updateField('title', getInputValue(event));
              }}
              onInlineEdit={isEditable ? () => form?.editField('title') : undefined}
            />
            <p className="mt-3 text-sm text-muted-foreground">Published {formatNoteDate(note.publishedAt)}</p>
            <AppInputTextArea
              autoFocus={isEditable && editingField === 'summary'}
              inline
              inlineSize="summary"
              inlineStatus={isEditable && editingField === 'summary' ? 'edit' : 'read'}
              className="mt-5 p-2 pr-8 text-lg leading-8"
              error={form?.errors.summary}
              name="summary"
              readValue={summaryValue ?? note.summary}
              value={summaryValue ?? note.summary}
              onBlur={form?.blurField}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                form?.updateField('summary', getInputValue(event));
              }}
              onInlineEdit={isEditable ? () => form?.editField('summary') : undefined}
            />
          </header>

          {isEditable && editingField === 'bodyMarkdown' ? (
            <div ref={bodyEditorRef} className="mt-10 rounded-md border border-border bg-background" onBlur={handleBodyEditorBlur}>
              <AppInputTextArea
                autoFocus
                aria-label="Note body"
                inline
                className="min-h-[36rem] resize-none overflow-hidden border-0 font-mono text-sm leading-7 shadow-none [field-sizing:content] focus:ring-0"
                error={form?.errors.bodyMarkdown}
                name="bodyMarkdown"
                value={bodyMarkdownValue ?? note.bodyMarkdown}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  form?.updateField('bodyMarkdown', getInputValue(event));
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
