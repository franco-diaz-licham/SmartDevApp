import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInlineEditSurface } from '@/components/ui/AppInlineEditSurface';
import { AppInputText } from '@/components/ui/AppInputText';
import { useAuth } from '@/features/auth';
import { useOwnerArticlesQuery, type PublicArticleListItemModel } from '@/features/articles';
import type { JournalEntryFormController } from '../hooks/useJournalEntryForm';

const searchDebounceMs = 300;

interface JournalRelatedArticlesFieldProps {
  form: JournalEntryFormController;
}

export const JournalRelatedArticlesField = ({ form }: JournalRelatedArticlesFieldProps) => {
  const { isAuthReady, isPublicView } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const isEditing = form.editingField === 'relatedArticles';

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), searchDebounceMs);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const articlesQuery = useOwnerArticlesQuery({ pageSize: 20, searchTerm: debouncedSearchTerm.trim() || null }, isEditing && isAuthReady && !isPublicView);
  const articles = useMemo(() => articlesQuery.data?.pages.flatMap((page) => page.items) ?? [], [articlesQuery.data]);
  const selectedIds = useMemo(() => new Set(form.values.relatedArticles.map((article) => article.articleId)), [form.values.relatedArticles]);

  const toggleArticle = (article: PublicArticleListItemModel) => {
    if (selectedIds.has(article.id)) {
      form.updateField(
        'relatedArticles',
        form.values.relatedArticles.filter((selected) => selected.articleId !== article.id)
      );
      return;
    }

    form.updateField('relatedArticles', [...form.values.relatedArticles, { articleId: article.id, title: article.title }]);
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
      <p className="mb-2 block text-sm font-semibold text-foreground">Related articles</p>
      {isEditing ? (
        <div className="rounded-md border border-border p-3">
          <AppInputText id="journal-related-articles-search" placeholder="Search articles" type="search" value={searchTerm} onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)} onKeyDown={handleSearchKeyDown} />
          <div className="mt-3 max-h-64 space-y-1 overflow-y-auto">
            {articlesQuery.isLoading ? <p className="px-3 py-2 text-sm text-muted-foreground">Loading articles...</p> : null}
            {!articlesQuery.isLoading && articles.length === 0 ? <p className="px-3 py-2 text-sm text-muted-foreground">No articles found.</p> : null}
            {articles.map((article) => (
              <AppButton key={article.id} appearance={selectedIds.has(article.id) ? 'primary' : 'secondary'} className="mb-0 mt-0 block w-full text-left text-sm" type="button" onClick={() => toggleArticle(article)}>
                {article.title}
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
        <AppInlineEditSurface onEdit={() => form.editField('relatedArticles')}>
          {form.values.relatedArticles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.values.relatedArticles.map((article) => (
                <span key={article.articleId} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                  {article.title}
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
