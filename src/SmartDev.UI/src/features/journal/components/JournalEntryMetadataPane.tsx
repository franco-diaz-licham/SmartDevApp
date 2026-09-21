import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppSelect } from '@/components/ui/AppSelect';
import type { JournalEntryFormController } from '../hooks/useJournalEntryForm';
import type { JournalConfidenceModel, JournalEntryStatusModel, JournalEntryTypeModel } from '../types/journal.types';
import { journalConfidenceOptions, journalEntryTypeOptions, journalStatusOptions } from '../types/journalEntryForm.schema';
import { getJournalConfidenceLabel, getJournalStatusLabel, getJournalTypeLabel } from '../utils/journalContent';
import { JournalRelatedJournalEntriesField } from './JournalRelatedJournalEntriesField';

const typeOptions = journalEntryTypeOptions.map((entryType) => ({ label: getJournalTypeLabel(entryType), value: entryType }));
const statusOptions = journalStatusOptions.map((status) => ({ label: getJournalStatusLabel(status), value: status }));
const confidenceOptions = journalConfidenceOptions.map((confidence) => ({ label: getJournalConfidenceLabel(confidence), value: confidence }));

const toBadges = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => (
      <span key={item} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
        {item}
      </span>
    ));

interface JournalEntryMetadataPaneProps {
  form: JournalEntryFormController;
  mutationError?: string;
  onCancel: () => void;
}

export const JournalEntryMetadataPane = ({ form, mutationError = '', onCancel }: JournalEntryMetadataPaneProps) => (
  <aside className="border-t border-border p-5 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0">
    <div className="border-b border-border pb-4">
      <h2 className="text-lg font-extrabold">Details</h2>
      <div className="mt-4 flex gap-2">
        <AppButton className="mb-0 mt-0 w-1/2 text-sm" type="submit" disabled={!form.isDirty || form.isSaving}>
          {form.isSaving ? 'Saving...' : 'Save'}
        </AppButton>
        <AppButton appearance="secondary" className="mb-0 mt-0 w-1/2 text-sm" type="button" disabled={!form.isDirty || form.isSaving} onClick={onCancel}>
          Cancel
        </AppButton>
      </div>
    </div>

    {form.savedMessage ? <p className="mt-4 rounded-md border border-success-border bg-success p-3 text-sm font-bold text-success-heading">{form.savedMessage}</p> : null}
    {mutationError ? <p className="mt-4 rounded-md border border-destructive bg-destructive/10 p-3 text-sm font-bold text-destructive">{mutationError}</p> : null}

    <div className="mt-6 space-y-5 text-sm">
      <AppInputText
        inline
        inlineStatus="edit"
        type="date"
        label="Date"
        required
        error={form.errors.occurredOn}
        name="occurredOn"
        value={form.values.occurredOn}
        onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('occurredOn', event.target.value)}
      />
      <AppSelect
        inline
        inlineStatus="edit"
        label="Type"
        name="entryType"
        options={typeOptions}
        value={form.values.entryType}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => form.updateField('entryType', event.target.value as JournalEntryTypeModel)}
      />
      <AppSelect
        inline
        inlineStatus="edit"
        label="Status"
        name="status"
        options={statusOptions}
        value={form.values.status}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => form.updateField('status', event.target.value as JournalEntryStatusModel)}
      />
      <AppSelect
        inline
        inlineStatus="edit"
        label="Confidence"
        name="confidence"
        options={confidenceOptions}
        value={form.values.confidence}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => form.updateField('confidence', event.target.value as JournalConfidenceModel)}
      />
      <AppInputText
        autoFocus={form.editingField === 'tags'}
        inline
        inlineStatus={form.editingField === 'tags' ? 'edit' : 'read'}
        className="flex flex-wrap gap-2"
        label="Tags"
        error={form.errors.tags}
        name="tags"
        readValue={toBadges(form.values.tags)}
        value={form.values.tags}
        onBlur={form.blurField}
        onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('tags', event.target.value)}
        onInlineEdit={() => form.editField('tags')}
      />
      <AppInputText
        autoFocus={form.editingField === 'companyName'}
        inline
        inlineStatus={form.editingField === 'companyName' ? 'edit' : 'read'}
        label="Company"
        error={form.errors.companyName}
        name="companyName"
        readValue={form.values.companyName}
        value={form.values.companyName}
        onBlur={form.blurField}
        onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('companyName', event.target.value)}
        onInlineEdit={() => form.editField('companyName')}
      />
      <AppInputText
        autoFocus={form.editingField === 'companyRoleTitle'}
        inline
        inlineStatus={form.editingField === 'companyRoleTitle' ? 'edit' : 'read'}
        label="Role title"
        error={form.errors.companyRoleTitle}
        name="companyRoleTitle"
        readValue={form.values.companyRoleTitle}
        value={form.values.companyRoleTitle}
        onBlur={form.blurField}
        onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('companyRoleTitle', event.target.value)}
        onInlineEdit={() => form.editField('companyRoleTitle')}
      />
      <AppInputText
        autoFocus={form.editingField === 'collaborators'}
        inline
        inlineStatus={form.editingField === 'collaborators' ? 'edit' : 'read'}
        className="flex flex-wrap gap-2"
        label="Collaborators"
        error={form.errors.collaborators}
        name="collaborators"
        readValue={toBadges(form.values.collaborators)}
        value={form.values.collaborators}
        onBlur={form.blurField}
        onChange={(event: ChangeEvent<HTMLInputElement>) => form.updateField('collaborators', event.target.value)}
        onInlineEdit={() => form.editField('collaborators')}
      />
      <JournalRelatedJournalEntriesField form={form} />
    </div>
  </aside>
);
