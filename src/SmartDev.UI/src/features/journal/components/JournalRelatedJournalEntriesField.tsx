import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInlineEditSurface } from '@/components/ui/AppInlineEditSurface';
import { AppInputText } from '@/components/ui/AppInputText';
import { useAuth } from '@/features/auth';
import type { JournalEntryFormController } from '../hooks/useJournalEntryForm';
import { useJournalEntriesQuery } from '../queries/journal.queries';
import type { JournalListItemModel } from '../types/journal.types';

const searchDebounceMs = 300;

interface JournalRelatedJournalEntriesFieldProps {
  form: JournalEntryFormController;
}

export const JournalRelatedJournalEntriesField = ({ form }: JournalRelatedJournalEntriesFieldProps) => {
  const { isAuthReady, isPublicView } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const isEditing = form.editingField === 'relatedJournalEntries';

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), searchDebounceMs);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const entriesQuery = useJournalEntriesQuery({ pageSize: 20, searchTerm: debouncedSearchTerm.trim() || null }, isEditing && isAuthReady && !isPublicView);
  const entries = useMemo(() => entriesQuery.data?.pages.flatMap((page) => page.items) ?? [], [entriesQuery.data]);
  const selectedIds = useMemo(() => new Set(form.values.relatedJournalEntries.map((entry) => entry.entryId)), [form.values.relatedJournalEntries]);

  const toggleEntry = (entry: JournalListItemModel) => {
    if (selectedIds.has(entry.id)) {
      form.updateField(
        'relatedJournalEntries',
        form.values.relatedJournalEntries.filter((selected) => selected.entryId !== entry.id)
      );
      return;
    }

    form.updateField('relatedJournalEntries', [...form.values.relatedJournalEntries, { entryId: entry.id, title: entry.title }]);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.preventDefault();
  };

  const handleDone = () => {
    setSearchTerm('');
    form.blurField();
  };

  return (
    <div className="block w-full">
      <p className="mb-2 block text-sm font-semibold text-foreground">Related journal entries</p>
      {isEditing ? (
        <div className="rounded-md border border-border p-3">
          <AppInputText id="journal-related-entries-search" placeholder="Search journal entries" type="search" value={searchTerm} onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)} onKeyDown={handleSearchKeyDown} />
          <div className="mt-3 max-h-64 space-y-1 overflow-y-auto">
            {entriesQuery.isLoading ? <p className="px-3 py-2 text-sm text-muted-foreground">Loading journal entries...</p> : null}
            {!entriesQuery.isLoading && entries.length === 0 ? <p className="px-3 py-2 text-sm text-muted-foreground">No journal entries found.</p> : null}
            {entries.map((entry) => (
              <AppButton key={entry.id} appearance={selectedIds.has(entry.id) ? 'primary' : 'secondary'} className="mb-0 mt-0 block w-full text-left text-sm" type="button" onClick={() => toggleEntry(entry)}>
                {entry.title}
              </AppButton>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <AppButton className="mb-0 mt-0 text-sm" type="button" onClick={handleDone}>
              Done
            </AppButton>
          </div>
        </div>
      ) : (
        <AppInlineEditSurface onEdit={() => form.editField('relatedJournalEntries')}>
          {form.values.relatedJournalEntries.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.values.relatedJournalEntries.map((entry) => (
                <span key={entry.entryId} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                  {entry.title}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">None</span>
          )}
        </AppInlineEditSurface>
      )}
    </div>
  );
};
