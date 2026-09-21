import type { ChangeEvent, FocusEvent } from 'react';
import { useRef } from 'react';
import { ArticleMarkdown } from '@/features/articles/components/ArticleMarkdown';
import { AppInlineEditSurface } from '@/components/ui/AppInlineEditSurface';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import type { JournalEntryFormController } from '../hooks/useJournalEntryForm';

interface JournalEntryContentProps {
  form: JournalEntryFormController;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const JournalEntryContent = ({ form }: JournalEntryContentProps) => {
  const bodyEditorRef = useRef<HTMLDivElement>(null);

  const handleBodyEdit = () => {
    form.editField('bodyMarkdown');
  };

  const handleBodyEditorBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (bodyEditorRef.current?.contains(event.relatedTarget)) return;
    form.blurField();
  };

  return (
    <main className="min-w-0 px-5 py-7 sm:px-8 lg:min-h-0 lg:overflow-y-auto lg:px-10">
      <div className="flex flex-col gap-3 border-b border-border pb-10">
        <AppInputText
          autoFocus={form.editingField === 'title'}
          inline
          inlineSize="title"
          label="TITLE"
          inlineStatus={form.editingField === 'title' ? 'edit' : 'read'}
          className="mt-2 p-2 pr-8 text-3xl font-extrabold leading-tight"
          error={form.errors.title}
          name="title"
          required
          readValue={form.values.title}
          value={form.values.title}
          onBlur={form.blurField}
          onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('title', getInputValue(event))}
          onInlineEdit={() => form.editField('title')}
        />
        {form.editingField === 'bodyMarkdown' ? (
          <div ref={bodyEditorRef} onBlur={handleBodyEditorBlur}>
            <AppInputTextArea
              autoFocus
              aria-label="Journal body"
              inline
              label="Body"
              className="min-h-144 resize-none overflow-hidden font-mono text-sm leading-7 field-sizing-content"
              error={form.errors.bodyMarkdown}
              name="bodyMarkdown"
              required
              value={form.values.bodyMarkdown}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('bodyMarkdown', getInputValue(event))}
            />
          </div>
        ) : (
          <AppInlineEditSurface className="mt-3 min-h-144" inlineField="textArea" label="Body" required onEdit={handleBodyEdit}>
            <div className="min-w-0 space-y-6 pb-16">
              <ArticleMarkdown markdown={form.values.bodyMarkdown} />
            </div>
          </AppInlineEditSurface>
        )}
      </div>
    </main>
  );
};
