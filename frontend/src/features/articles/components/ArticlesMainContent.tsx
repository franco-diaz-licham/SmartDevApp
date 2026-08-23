import { Link, useNavigate } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppSelect } from '@/components/ui/AppSelect';
import { AuthenticatedOnly } from '@/features/auth';
import { ArticlesListSkeleton } from './ArticlesListItemSkeleton';
import type { ArticlePublishedDateSortDirection } from '../stores/articlesUi.store';
import type { ArticleTypeModel, PublicArticleListItemModel } from '../types/article.types';
import { articleTypeOptions } from '../types/articleEntryForm.schema';
import { allArticleTypes, getArticleTypeLabel } from '../utils/articleContent';

const publishedDateSortOptions = [
  { label: 'Newest', value: 'desc' },
  { label: 'Oldest', value: 'asc' }
] as const;

interface ArticlesMainContentProps {
  articles: PublicArticleListItemModel[];
  searchTerm: string;
  selectedArticleType: ArticleTypeModel | typeof allArticleTypes;
  publishedDateSortDirection: ArticlePublishedDateSortDirection;
  isArticlesLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onArticleTypeChange: (articleType: ArticleTypeModel | typeof allArticleTypes) => void;
  onPublishedDateSortDirectionChange: (sortDirection: ArticlePublishedDateSortDirection) => void;
  onLoadMore: () => void;
}

const articleTypeFilterOptions = [{ label: allArticleTypes, value: allArticleTypes }, ...articleTypeOptions.map((articleType) => ({ label: getArticleTypeLabel(articleType), value: articleType }))];

export const ArticlesMainContent = ({
  articles,
  searchTerm,
  selectedArticleType,
  publishedDateSortDirection,
  isArticlesLoading,
  hasNextPage,
  isFetchingNextPage,
  onSearchTermChange,
  onArticleTypeChange,
  onPublishedDateSortDirectionChange,
  onLoadMore
}: ArticlesMainContentProps) => {
  const navigate = useNavigate();

  return (
    <section className="min-h-0 flex-1 overflow-y-auto">
      <div className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <AppInputText
            id="articles-search"
            label="Search articles"
            name="articlesSearch"
            type="search"
            value={searchTerm}
            placeholder="Search title, summary, category, or tag"
            className="w-full sm:flex-1"
            onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchTermChange(event.target.value)}
          />
          <AppSelect
            id="articles-type-filter"
            label="Type"
            name="articlesType"
            value={selectedArticleType}
            options={articleTypeFilterOptions}
            className="w-full sm:w-38"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onArticleTypeChange(event.target.value as ArticleTypeModel | typeof allArticleTypes)}
          />
          <AppSelect
            id="articles-published-date-sort"
            label="Sort by published date"
            name="articlesPublishedDateSort"
            value={publishedDateSortDirection}
            options={publishedDateSortOptions}
            className="w-full sm:w-38"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onPublishedDateSortDirectionChange(event.target.value as ArticlePublishedDateSortDirection)}
          />
          <AuthenticatedOnly>
            <AppButton className="mb-0 mt-0 w-full text-sm sm:w-42" type="button" onClick={() => navigate('/workspace/articles/new')}>
              New article
            </AppButton>
          </AuthenticatedOnly>
        </div>

        <div className="mt-6 grid gap-3">
          {isArticlesLoading && <ArticlesListSkeleton />}

          {articles.map((article) => (
            <Link key={article.id} className="rounded-md border border-border p-4 no-underline transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" to={`/workspace/articles/${encodeURIComponent(article.id)}`}>
              <span className="text-xs font-extrabold uppercase text-primary">{getArticleTypeLabel(article.articleType)}</span>
              <span className="ml-2 text-xs font-extrabold uppercase text-muted-foreground">{article.category.displayName}</span>
              <span className="mt-2 block text-lg font-extrabold">{article.title}</span>
              <span className="mt-2 block border-t border-border pt-3 text-sm leading-6 text-muted-foreground">{article.summary}</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag.slug} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                    {tag.displayName}
                  </span>
                ))}
              </div>
            </Link>
          ))}

          {!isArticlesLoading && articles.length === 0 && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No articles match this view.</p>}

          {hasNextPage && (
            <AppButton appearance="secondary" className="mb-0 mt-0 w-full text-sm" type="button" disabled={isFetchingNextPage} onClick={onLoadMore}>
              Load more articles
            </AppButton>
          )}

          {isFetchingNextPage && <ArticlesListSkeleton />}
        </div>
      </div>
    </section>
  );
};
