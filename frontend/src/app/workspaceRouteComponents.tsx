import { lazy, Suspense } from 'react';
import { ArticlePageSkeleton } from '@/features/articles/components/ArticlePageSkeleton';
import { ArticlesPageSkeleton } from '@/features/articles/components/ArticlesPageSkeleton';

const LazyArticlesPage = lazy(() => import('@/features/articles/pages/ArticlesPage').then((module) => ({ default: module.ArticlesPage })));
const LazyArticlePage = lazy(() => import('@/features/articles/pages/ArticlePage').then((module) => ({ default: module.ArticlePage })));

export const ArticlesPageRoute = () => (
  <Suspense fallback={<ArticlesPageSkeleton />}>
    <LazyArticlesPage />
  </Suspense>
);

export const ArticlePageRoute = () => (
  <Suspense fallback={<ArticlePageSkeleton />}>
    <LazyArticlePage />
  </Suspense>
);
