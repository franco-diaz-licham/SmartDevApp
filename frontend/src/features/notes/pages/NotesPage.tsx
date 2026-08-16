import { useEffect, useMemo } from 'react';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { NotesCategoryPane } from '../components/NotesCategoryPane';
import { NotesMainContent } from '../components/NotesMainContent';
import { NotesPageSkeleton } from '../components/NotesPageSkeleton';
import { useNotesQueryParams } from '../hooks/useNotesQueryParams';
import { useOwnerNoteCategoriesQuery, useOwnerNotesQuery, usePublicNoteCategoriesQuery, usePublicNotesQuery } from '../queries/note.queries';
import { useNotesUiStore } from '../stores/notesUi.store';
import { allNotesCategory } from '../utils/noteContent';

export const NotesPage = () => {
  const { isAuthReady, isPublicView } = useAuth();

  const searchTerm = useNotesUiStore((state) => state.searchTerm);
  const selectedCategory = useNotesUiStore((state) => state.selectedCategory);
  const setSearchTerm = useNotesUiStore((state) => state.setSearchTerm);
  const selectCategory = useNotesUiStore((state) => state.selectCategory);
  const notesQueryParams = useNotesQueryParams();
  const publicNotesQuery = usePublicNotesQuery(notesQueryParams, isAuthReady && isPublicView);
  const ownerNotesQuery = useOwnerNotesQuery(notesQueryParams, isAuthReady && !isPublicView);
  const publicCategoriesQuery = usePublicNoteCategoriesQuery({ pageSize: 100 }, isAuthReady && isPublicView);
  const ownerCategoriesQuery = useOwnerNoteCategoriesQuery({ pageSize: 100 }, isAuthReady && !isPublicView);
  const notesQuery = isPublicView ? publicNotesQuery : ownerNotesQuery;
  const categoriesQuery = isPublicView ? publicCategoriesQuery : ownerCategoriesQuery;

  const notes = useMemo(() => notesQuery.data?.pages.flatMap((page) => page.items) ?? [], [notesQuery.data]);
  const categories = useMemo(() => {
    const loadedCategories = [allNotesCategory, ...(categoriesQuery.data?.items ?? [])];
    if (selectedCategory === allNotesCategory || loadedCategories.includes(selectedCategory)) return loadedCategories;
    return [allNotesCategory, selectedCategory, ...loadedCategories.filter((category) => category !== allNotesCategory)];
  }, [categoriesQuery.data, selectedCategory]);

  useEffect(() => {
    document.title = `Notes | ${appConfig.appName}`;
  }, []);

  const handleLoadMore = () => {
    void notesQuery.fetchNextPage();
  };

  if (!isAuthReady) return <NotesPageSkeleton />;

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]">
        <NotesCategoryPane categories={categories} selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
        <NotesMainContent
          notes={notes}
          searchTerm={searchTerm}
          isNotesLoading={notesQuery.isLoading}
          isNotesError={notesQuery.isError}
          hasNextPage={notesQuery.hasNextPage}
          isFetchingNextPage={notesQuery.isFetchingNextPage}
          onSearchTermChange={setSearchTerm}
          onLoadMore={handleLoadMore}
        />
      </div>
    </WorkspacePageWrapper>
  );
};
