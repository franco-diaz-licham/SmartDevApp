import { lazy, Suspense } from 'react';
import { ArticleDetailsPageSkeleton } from '@/features/articles/components/ArticleDetailsPageSkeleton';
import { ArticlesPageSkeleton } from '@/features/articles/components/ArticlesPageSkeleton';

const LazyArticlesPage = lazy(() => import('@/features/articles/pages/ArticlesPage').then((module) => ({ default: module.ArticlesPage })));
const LazyArticleDetailsPage = lazy(() => import('@/features/articles/pages/ArticleDetailsPage').then((module) => ({ default: module.ArticleDetailsPage })));

export const ArticlesPageRoute = () => (
  <Suspense fallback={<ArticlesPageSkeleton />}>
    <LazyArticlesPage />
  </Suspense>
);

export const ArticleDetailsPageRoute = () => (
  <Suspense fallback={<ArticleDetailsPageSkeleton />}>
    <LazyArticleDetailsPage />
  </Suspense>
);
