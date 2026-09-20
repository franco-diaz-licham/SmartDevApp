import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppSelect } from '@/components/ui/AppSelect';
import type { JournalEntryFormController } from '../hooks/useJournalEntryForm';
import type { JournalConfidenceModel, JournalEntryStatusModel, JournalEntryTypeModel } from '../types/journal.types';
import { journalConfidenceOptions, journalEntryTypeOptions, journalStatusOptions } from '../types/journalEntryForm.schema';
import { getJournalConfidenceLabel, getJournalStatusLabel, getJournalTypeLabel } from '../utils/journalContent';

const typeOptions = journalEntryTypeOptions.map((entryType) => ({ label: getJournalTypeLabel(entryType), value: entryType }));
const statusOptions = journalStatusOptions.map((status) => ({ label: getJournalStatusLabel(status), value: status }));
const confidenceOptions = journalConfidenceOptions.map((confidence) => ({ label: getJournalConfidenceLabel(confidence), value: confidence }));

interface JournalEntryMetadataPaneProps {
  form: JournalEntryFormController;
  mutationError?: string;
  onCancel: () => void;
}

export const JournalEntryMetadataPane = ({ form, mutationError = '', onCancel }: JournalEntryMetadataPaneProps) => (
  <aside className="h-fit rounded-md border border-border p-5">
    <div className="flex gap-2">
      <AppButton className="mb-0 mt-0 w-1/2 text-sm" type="submit" disabled={!form.isDirty || form.isSaving}>
        {form.isSaving ? 'Saving...' : 'Save'}
      </AppButton>
      <AppButton appearance="secondary" className="mb-0 mt-0 w-1/2 text-sm" type="button" disabled={!form.isDirty || form.isSaving} onClick={onCancel}>
        Cancel
      </AppButton>
    </div>

    {form.savedMessage ? <p className="mt-4 rounded-md border border-success-border bg-success p-3 text-sm font-bold text-success-heading">{form.savedMessage}</p> : null}
    {mutationError ? <p className="mt-4 rounded-md border border-destructive bg-destructive/10 p-3 text-sm font-bold text-destructive">{mutationError}</p> : null}

    <div className="mt-6 grid gap-4">
      <AppInputText id="journal-occurred-on" label="Date" required type="date" error={form.errors.occurredOn} name="occurredOn" value={form.values.occurredOn} onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('occurredOn', event.target.value)} />
      <AppSelect id="journal-entry-type" label="Type" options={typeOptions} value={form.values.entryType} onChange={(event: ChangeEvent<HTMLSelectElement>) => form.updateField('entryType', event.target.value as JournalEntryTypeModel)} />
      <AppSelect id="journal-status" label="Status" options={statusOptions} value={form.values.status} onChange={(event: ChangeEvent<HTMLSelectElement>) => form.updateField('status', event.target.value as JournalEntryStatusModel)} />
      <AppSelect id="journal-confidence" label="Confidence" options={confidenceOptions} value={form.values.confidence} onChange={(event: ChangeEvent<HTMLSelectElement>) => form.updateField('confidence', event.target.value as JournalConfidenceModel)} />
    </div>
  </aside>
);
