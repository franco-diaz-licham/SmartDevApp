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
        <AppInputTextArea
          autoFocus={form.editingField === 'summary'}
          inline
          inlineSize="summary"
          label="SUMMARY"
          inlineStatus={form.editingField === 'summary' ? 'edit' : 'read'}
          className="mt-5 p-2 pr-8 text-lg leading-8 text-muted-foreground"
          error={form.errors.summary}
          name="summary"
          readValue={form.values.summary}
          value={form.values.summary}
          onBlur={form.blurField}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('summary', getInputValue(event))}
          onInlineEdit={() => form.editField('summary')}
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

      <section className="mt-6">
        <h2 className="text-lg font-extrabold">Optional details</h2>
        <div className="mt-5 grid gap-4">
          <AppInputTextArea
            id="journal-workplace-context"
            label="Workplace context"
            error={form.errors.workplaceContext}
            name="workplaceContext"
            value={form.values.workplaceContext}
            placeholder="Payments platform"
            className="min-h-24"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('workplaceContext', getInputValue(event))}
          />
          <AppInputTextArea
            id="journal-outcome"
            label="Outcome"
            error={form.errors.outcome}
            name="outcome"
            value={form.values.outcome}
            placeholder="Fixed retry timeout"
            className="min-h-24"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('outcome', getInputValue(event))}
          />
          <AppInputTextArea
            id="journal-impact"
            label="Impact"
            error={form.errors.impact}
            name="impact"
            value={form.values.impact}
            className="min-h-24"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('impact', getInputValue(event))}
          />
          <AppInputTextArea
            id="journal-decisions"
            label="Decisions"
            error={form.errors.decisions}
            name="decisions"
            value={form.values.decisions}
            className="min-h-24"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('decisions', getInputValue(event))}
          />
          <AppInputTextArea
            id="journal-blockers"
            label="Blockers"
            error={form.errors.blockers}
            name="blockers"
            value={form.values.blockers}
            className="min-h-24"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('blockers', getInputValue(event))}
          />
          <AppInputTextArea
            id="journal-next-actions"
            label="Next actions"
            error={form.errors.nextActions}
            name="nextActions"
            value={form.values.nextActions}
            className="min-h-24"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('nextActions', getInputValue(event))}
          />
        </div>
      </section>
    </main>
  );
};
