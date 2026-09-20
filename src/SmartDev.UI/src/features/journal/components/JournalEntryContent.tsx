import type { ChangeEvent } from 'react';
import { ArticleMarkdown } from '@/features/articles/components/ArticleMarkdown';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import type { JournalEntryFormController } from '../hooks/useJournalEntryForm';

interface JournalEntryContentProps {
  form: JournalEntryFormController;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const JournalEntryContent = ({ form }: JournalEntryContentProps) => {
  const previewMarkdown = form.values.bodyMarkdown;

  return (
    <main className="min-w-0">
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <AppInputText
          autoFocus
          id="journal-title"
          label="Title"
          required
          error={form.errors.title}
          name="title"
          value={form.values.title}
          placeholder="What did you work on?"
          className="text-2xl font-extrabold"
          onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('title', getInputValue(event))}
        />
        <AppInputTextArea
          id="journal-body"
          label="Body"
          required
          error={form.errors.bodyMarkdown}
          name="bodyMarkdown"
          value={form.values.bodyMarkdown}
          placeholder="Capture the work while it is fresh."
          className="min-h-80 font-mono text-sm leading-7"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('bodyMarkdown', getInputValue(event))}
        />
      </div>

      <details className="mt-6 rounded-md border border-border p-4">
        <summary className="cursor-pointer text-sm font-extrabold uppercase text-muted-foreground">Optional details</summary>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <AppInputText id="journal-summary" label="Summary" error={form.errors.summary} name="summary" value={form.values.summary} onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('summary', getInputValue(event))} />
          <AppInputText id="journal-tags" label="Tags" error={form.errors.tags} name="tags" value={form.values.tags} placeholder="backend, reliability" onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('tags', getInputValue(event))} />
          <AppInputText id="journal-company" label="Company" error={form.errors.companyName} name="companyName" value={form.values.companyName} onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('companyName', getInputValue(event))} />
          <AppInputText id="journal-company-role" label="Role title" error={form.errors.companyRoleTitle} name="companyRoleTitle" value={form.values.companyRoleTitle} onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('companyRoleTitle', getInputValue(event))} />
          <AppInputText id="journal-workplace-context" label="Workplace context" error={form.errors.workplaceContext} name="workplaceContext" value={form.values.workplaceContext} placeholder="Payments platform" onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('workplaceContext', getInputValue(event))} />
          <AppInputText id="journal-outcome" label="Outcome" error={form.errors.outcome} name="outcome" value={form.values.outcome} placeholder="Fixed retry timeout" onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('outcome', getInputValue(event))} />
          <AppInputTextArea id="journal-impact" label="Impact" error={form.errors.impact} name="impact" value={form.values.impact} className="min-h-24" onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('impact', getInputValue(event))} />
          <AppInputTextArea id="journal-collaborators" label="Collaborators" error={form.errors.collaborators} name="collaborators" value={form.values.collaborators} className="min-h-24" placeholder="Names separated by commas" onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('collaborators', getInputValue(event))} />
          <AppInputTextArea id="journal-decisions" label="Decisions" error={form.errors.decisions} name="decisions" value={form.values.decisions} className="min-h-24" onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('decisions', getInputValue(event))} />
          <AppInputTextArea id="journal-blockers" label="Blockers" error={form.errors.blockers} name="blockers" value={form.values.blockers} className="min-h-24" onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('blockers', getInputValue(event))} />
          <AppInputTextArea id="journal-next-actions" label="Next actions" error={form.errors.nextActions} name="nextActions" value={form.values.nextActions} className="min-h-24" onChange={(event: ChangeEvent<HTMLTextAreaElement>) => form.updateField('nextActions', getInputValue(event))} />
        </div>
      </details>

      {previewMarkdown.trim().length > 0 ? (
        <section className="mt-6 border-t border-border pt-6">
          <h2 className="text-lg font-extrabold">Preview</h2>
          <div className="mt-4 rounded-md border border-border p-4">
            <ArticleMarkdown markdown={previewMarkdown} />
          </div>
        </section>
      ) : null}
    </main>
  );
};
