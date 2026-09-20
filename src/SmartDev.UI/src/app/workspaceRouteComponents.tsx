import { lazy, Suspense } from 'react';
import { ArticleDetailsPageSkeleton } from '@/features/articles/components/ArticleDetailsPageSkeleton';
import { ArticlesPageSkeleton } from '@/features/articles/components/ArticlesPageSkeleton';
import { JournalEntryPageSkeleton } from '@/features/journal/components/JournalEntryPageSkeleton';
import { JournalPageSkeleton } from '@/features/journal/components/JournalPageSkeleton';

const LazyArticlesPage = lazy(() => import('@/features/articles/pages/ArticlesPage').then((module) => ({ default: module.ArticlesPage })));
const LazyArticleDetailsPage = lazy(() => import('@/features/articles/pages/ArticleDetailsPage').then((module) => ({ default: module.ArticleDetailsPage })));
const LazyJournalPage = lazy(() => import('@/features/journal/pages/JournalPage').then((module) => ({ default: module.JournalPage })));
const LazyJournalEntryPage = lazy(() => import('@/features/journal/pages/JournalEntryPage').then((module) => ({ default: module.JournalEntryPage })));

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

export const JournalPageRoute = () => (
  <Suspense fallback={<JournalPageSkeleton />}>
    <LazyJournalPage />
  </Suspense>
);

export const JournalEntryPageRoute = () => (
  <Suspense fallback={<JournalEntryPageSkeleton />}>
    <LazyJournalEntryPage />
  </Suspense>
);
