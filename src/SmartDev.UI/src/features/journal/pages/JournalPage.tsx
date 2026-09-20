import { useEffect, useMemo } from 'react';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { JournalMainContent } from '../components/JournalMainContent';
import { JournalPageSkeleton } from '../components/JournalPageSkeleton';
import { useJournalQueryParams } from '../hooks/useJournalQueryParams';
import { useJournalEntriesQuery } from '../queries/journal.queries';
import { useJournalUiStore } from '../stores/journalUi.store';

export const JournalPage = () => {
  const { isAuthReady } = useAuth();
  const searchTerm = useJournalUiStore((state) => state.searchTerm);
  const selectedEntryType = useJournalUiStore((state) => state.selectedEntryType);
  const selectedStatus = useJournalUiStore((state) => state.selectedStatus);
  const occurredDateSortDirection = useJournalUiStore((state) => state.occurredDateSortDirection);
  const setSearchTerm = useJournalUiStore((state) => state.setSearchTerm);
  const selectEntryType = useJournalUiStore((state) => state.selectEntryType);
  const selectStatus = useJournalUiStore((state) => state.selectStatus);
  const setOccurredDateSortDirection = useJournalUiStore((state) => state.setOccurredDateSortDirection);
  const queryParams = useJournalQueryParams();
  const entriesQuery = useJournalEntriesQuery(queryParams, isAuthReady);
  const entries = useMemo(() => entriesQuery.data?.pages.flatMap((page) => page.items) ?? [], [entriesQuery.data]);

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
        searchTerm={searchTerm}
        selectedEntryType={selectedEntryType}
        selectedStatus={selectedStatus}
        occurredDateSortDirection={occurredDateSortDirection}
        isEntriesLoading={entriesQuery.isLoading}
        hasNextPage={Boolean(entriesQuery.hasNextPage)}
        isFetchingNextPage={entriesQuery.isFetchingNextPage}
        onSearchTermChange={setSearchTerm}
        onEntryTypeChange={selectEntryType}
        onStatusChange={selectStatus}
        onOccurredDateSortDirectionChange={setOccurredDateSortDirection}
        onLoadMore={handleLoadMore}
      />
    </WorkspacePageWrapper>
  );
};
