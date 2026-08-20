import { Link, useNavigate } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AuthenticatedOnly } from '@/features/auth';
import { ArticlesListSkeleton } from './ArticlesListItemSkeleton';
import type { PublicArticleListItemModel } from '../types/article.types';

interface ArticlesMainContentProps {
  articles: PublicArticleListItemModel[];
  searchTerm: string;
  isArticlesLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSearchTermChange: (searchTerm: string) => void;
  onLoadMore: () => void;
}

export const ArticlesMainContent = ({ articles, searchTerm, isArticlesLoading, hasNextPage, isFetchingNextPage, onSearchTermChange, onLoadMore }: ArticlesMainContentProps) => {
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
          <AuthenticatedOnly>
            <AppButton className="mb-0 mt-0 w-full text-sm sm:w-32" type="button" onClick={() => navigate('/workspace/articles/new')}>
              New article
            </AppButton>
          </AuthenticatedOnly>
        </div>

        <div className="mt-6 grid gap-3">
          {isArticlesLoading && <ArticlesListSkeleton />}

          {articles.map((article) => (
            <Link
              key={article.id}
              className="rounded-md border border-border p-4 no-underline transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              to={`/workspace/articles/${encodeURIComponent(article.id)}`}
            >
              <span className="text-xs font-extrabold uppercase text-primary">{article.category.displayName}</span>
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
