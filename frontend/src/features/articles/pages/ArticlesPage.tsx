import { useEffect, useMemo } from 'react';
import { appConfig } from '@/app/appConfig';
import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { useAuth } from '@/features/auth';
import { ArticlesCategoryPane } from '../components/ArticlesCategoryPane';
import { ArticlesMainContent } from '../components/ArticlesMainContent';
import { ArticlesPageSkeleton } from '../components/ArticlesPageSkeleton';
import { useArticlesQueryParams } from '../hooks/useArticlesQueryParams';
import { useOwnerArticleCategoriesQuery, useOwnerArticlesQuery, usePublicArticleCategoriesQuery, usePublicArticlesQuery } from '../queries/article.queries';
import { useArticlesUiStore } from '../stores/articlesUi.store';
import { allArticlesCategory } from '../utils/articleContent';

export const ArticlesPage = () => {
  const { isAuthReady, isPublicView } = useAuth();

  const searchTerm = useArticlesUiStore((state) => state.searchTerm);
  const selectedCategory = useArticlesUiStore((state) => state.selectedCategory);
  const setSearchTerm = useArticlesUiStore((state) => state.setSearchTerm);
  const selectCategory = useArticlesUiStore((state) => state.selectCategory);
  const articlesQueryParams = useArticlesQueryParams();
  const publicArticlesQuery = usePublicArticlesQuery(articlesQueryParams, isAuthReady && isPublicView);
  const ownerArticlesQuery = useOwnerArticlesQuery(articlesQueryParams, isAuthReady && !isPublicView);
  const publicCategoriesQuery = usePublicArticleCategoriesQuery({ pageSize: 100 }, isAuthReady && isPublicView);
  const ownerCategoriesQuery = useOwnerArticleCategoriesQuery({ pageSize: 100 }, isAuthReady && !isPublicView);
  const articlesQuery = isPublicView ? publicArticlesQuery : ownerArticlesQuery;
  const categoriesQuery = isPublicView ? publicCategoriesQuery : ownerCategoriesQuery;

  const articles = useMemo(() => articlesQuery.data?.pages.flatMap((page) => page.items) ?? [], [articlesQuery.data]);
  const categories = useMemo(() => {
    const loadedCategories = [allArticlesCategory, ...(categoriesQuery.data?.items ?? [])];
    if (selectedCategory === allArticlesCategory || loadedCategories.includes(selectedCategory)) return loadedCategories;
    return [allArticlesCategory, selectedCategory, ...loadedCategories.filter((category) => category !== allArticlesCategory)];
  }, [categoriesQuery.data, selectedCategory]);

  useEffect(() => {
    document.title = `Articles | ${appConfig.appName}`;
  }, []);

  const handleLoadMore = () => {
    void articlesQuery.fetchNextPage();
  };

  if (!isAuthReady) return <ArticlesPageSkeleton />;

  return (
    <WorkspacePageWrapper>
      <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]">
        <ArticlesCategoryPane categories={categories} selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
        <ArticlesMainContent
          articles={articles}
          searchTerm={searchTerm}
          isArticlesLoading={articlesQuery.isLoading}
          isArticlesError={articlesQuery.isError}
          hasNextPage={articlesQuery.hasNextPage}
          isFetchingNextPage={articlesQuery.isFetchingNextPage}
          onSearchTermChange={setSearchTerm}
          onLoadMore={handleLoadMore}
        />
      </div>
    </WorkspacePageWrapper>
  );
};
