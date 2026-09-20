import type { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppSelect } from '@/components/ui/AppSelect';
import { JournalListSkeleton } from './JournalListSkeleton';
import type { JournalSortDirection } from '../stores/journalUi.store';
import type { JournalEntryStatusModel, JournalEntryTypeModel, JournalListItemModel } from '../types/journal.types';
import { journalEntryTypeOptions, journalStatusOptions } from '../types/journalEntryForm.schema';
import { allJournalStatuses, allJournalTypes, formatJournalDate, getJournalStatusLabel, getJournalTypeLabel } from '../utils/journalContent';

const sortOptions = [
  { label: 'Newest', value: 'desc' },
  { label: 'Oldest', value: 'asc' }
] as const;

const entryTypeOptions = [{ label: allJournalTypes, value: allJournalTypes }, ...journalEntryTypeOptions.map((entryType) => ({ label: getJournalTypeLabel(entryType), value: entryType }))];

const statusOptions = [{ label: allJournalStatuses, value: allJournalStatuses }, ...journalStatusOptions.map((status) => ({ label: getJournalStatusLabel(status), value: status }))];

interface JournalMainContentProps {
  entries: JournalListItemModel[];
  searchTerm: string;
  selectedEntryType: JournalEntryTypeModel | typeof allJournalTypes;
  selectedStatus: JournalEntryStatusModel | typeof allJournalStatuses;
  occurredDateSortDirection: JournalSortDirection;
  isEntriesLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onEntryTypeChange: (entryType: JournalEntryTypeModel | typeof allJournalTypes) => void;
  onStatusChange: (status: JournalEntryStatusModel | typeof allJournalStatuses) => void;
  onOccurredDateSortDirectionChange: (sortDirection: JournalSortDirection) => void;
  onLoadMore: () => void;
}

export const JournalMainContent = ({
  entries,
  searchTerm,
  selectedEntryType,
  selectedStatus,
  occurredDateSortDirection,
  isEntriesLoading,
  hasNextPage,
  isFetchingNextPage,
  onSearchTermChange,
  onEntryTypeChange,
  onStatusChange,
  onOccurredDateSortDirectionChange,
  onLoadMore
}: JournalMainContentProps) => {
  const navigate = useNavigate();

  return (
    <section className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1400px] p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3 border-b border-border pb-6 lg:flex-row lg:items-end">
          <AppInputText
            id="journal-search"
            label="Search journal"
            name="journalSearch"
            type="search"
            value={searchTerm}
            placeholder="Search title, body, company, outcome, or tags"
            className="w-full lg:flex-1"
            onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchTermChange(event.target.value)}
          />
          <AppSelect
            id="journal-type-filter"
            label="Type"
            name="journalType"
            value={selectedEntryType}
            options={entryTypeOptions}
            className="w-full lg:w-48"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onEntryTypeChange(event.target.value as JournalEntryTypeModel | typeof allJournalTypes)}
          />
          <AppSelect
            id="journal-status-filter"
            label="Status"
            name="journalStatus"
            value={selectedStatus}
            options={statusOptions}
            className="w-full lg:w-44"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onStatusChange(event.target.value as JournalEntryStatusModel | typeof allJournalStatuses)}
          />
          <AppSelect
            id="journal-date-sort"
            label="Sort"
            name="journalSort"
            value={occurredDateSortDirection}
            options={sortOptions}
            className="w-full lg:w-36"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onOccurredDateSortDirectionChange(event.target.value as JournalSortDirection)}
          />
          <AppButton className="mb-0 mt-0 w-full text-sm lg:w-40" type="button" onClick={() => navigate('/journal/new')}>
            New entry
          </AppButton>
        </div>

        <div className="mt-6 grid gap-3">
          {isEntriesLoading && <JournalListSkeleton />}
          {entries.map((entry) => (
            <Link key={entry.id} className="rounded-md border border-border p-4 no-underline transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" to={`/journal/${encodeURIComponent(entry.id)}`}>
              <span className="text-xs font-extrabold uppercase text-primary">{getJournalTypeLabel(entry.entryType)}</span>
              <span className="ml-2 text-xs font-extrabold uppercase text-muted-foreground">{entry.status}</span>
              <span className="ml-2 text-xs font-extrabold uppercase text-muted-foreground">{formatJournalDate(entry.occurredOn)}</span>
              <span className="mt-2 block text-lg font-extrabold">{entry.title}</span>
              {entry.impact ? <span className="mt-2 block border-t border-border pt-3 text-sm leading-6 text-muted-foreground">{entry.impact}</span> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.company?.name ? <span className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">{entry.company.name}</span> : null}
                {entry.workplaceContext ? <span className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">{entry.workplaceContext}</span> : null}
                {entry.tags.map((tag) => (
                  <span key={tag.slug} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                    {tag.displayName}
                  </span>
                ))}
              </div>
            </Link>
          ))}
          {!isEntriesLoading && entries.length === 0 && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No journal entries match this view.</p>}
          {hasNextPage && (
            <AppButton appearance="secondary" className="mb-0 mt-0 w-full text-sm" type="button" disabled={isFetchingNextPage} onClick={onLoadMore}>
              Load more entries
            </AppButton>
          )}
          {isFetchingNextPage && <JournalListSkeleton />}
        </div>
      </div>
    </section>
  );
};
