import { useEffect, useMemo } from 'react';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { JournalMainContent } from '../components/JournalMainContent';
import { JournalPageSkeleton } from '../components/JournalPageSkeleton';
import { useJournalQueryParams } from '../hooks/useJournalQueryParams';
import { useJournalEntriesQuery } from '../queries/journal.queries';
import { useJournalUiStore } from '../stores/journalUi.store';
import { allJournalCompanies } from '../utils/journalContent';

export const JournalPage = () => {
  const { isAuthReady } = useAuth();
  const searchTerm = useJournalUiStore((state) => state.searchTerm);
  const selectedCompany = useJournalUiStore((state) => state.selectedCompany);
  const selectedEntryType = useJournalUiStore((state) => state.selectedEntryType);
  const selectedStatus = useJournalUiStore((state) => state.selectedStatus);
  const occurredFrom = useJournalUiStore((state) => state.occurredFrom);
  const occurredTo = useJournalUiStore((state) => state.occurredTo);
  const occurredDateSortDirection = useJournalUiStore((state) => state.occurredDateSortDirection);
  const setSearchTerm = useJournalUiStore((state) => state.setSearchTerm);
  const selectCompany = useJournalUiStore((state) => state.selectCompany);
  const selectEntryType = useJournalUiStore((state) => state.selectEntryType);
  const selectStatus = useJournalUiStore((state) => state.selectStatus);
  const setOccurredFrom = useJournalUiStore((state) => state.setOccurredFrom);
  const setOccurredTo = useJournalUiStore((state) => state.setOccurredTo);
  const setOccurredDateSortDirection = useJournalUiStore((state) => state.setOccurredDateSortDirection);
  const queryParams = useJournalQueryParams();
  const entriesQuery = useJournalEntriesQuery(queryParams, isAuthReady);
  const entries = useMemo(() => entriesQuery.data?.pages.flatMap((page) => page.items) ?? [], [entriesQuery.data]);
  const companyOptions = useMemo(() => {
    const loadedCompanies = entries.map((entry) => entry.company?.name).filter((company): company is string => Boolean(company));
    const options = [allJournalCompanies, ...Array.from(new Set(loadedCompanies)).sort((left, right) => left.localeCompare(right))];
    if (selectedCompany === allJournalCompanies || options.includes(selectedCompany)) return options.map((company) => ({ label: company, value: company }));
    return [selectedCompany, ...options].map((company) => ({ label: company, value: company }));
  }, [entries, selectedCompany]);

  useEffect(() => {
    document.title = `Journal | ${appConfig.appName}`;
  }, []);

  const handleLoadMore = () => {
    void entriesQuery.fetchNextPage();
  };

  if (!isAuthReady) return <JournalPageSkeleton />;

  return (
    <WorkspacePageWrapper>
      <JournalMainContent
        entries={entries}
        companyOptions={companyOptions}
        searchTerm={searchTerm}
        selectedCompany={selectedCompany}
        selectedEntryType={selectedEntryType}
        selectedStatus={selectedStatus}
        occurredFrom={occurredFrom}
        occurredTo={occurredTo}
        occurredDateSortDirection={occurredDateSortDirection}
        isEntriesLoading={entriesQuery.isLoading}
        hasNextPage={Boolean(entriesQuery.hasNextPage)}
        isFetchingNextPage={entriesQuery.isFetchingNextPage}
        onSearchTermChange={setSearchTerm}
        onCompanyChange={selectCompany}
        onEntryTypeChange={selectEntryType}
        onStatusChange={selectStatus}
        onOccurredFromChange={setOccurredFrom}
        onOccurredToChange={setOccurredTo}
        onOccurredDateSortDirectionChange={setOccurredDateSortDirection}
        onLoadMore={handleLoadMore}
      />
    </WorkspacePageWrapper>
  );
};
